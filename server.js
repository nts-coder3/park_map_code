"use strict";

var crypto = require("crypto");
var fs = require("fs");
var http = require("http");
var https = require("https");
var path = require("path");
var url = require("url");

var ROOT = __dirname;
var DATA_DIRECTORY = path.join(ROOT, "data");
var APPLICATIONS_FILE = path.join(DATA_DIRECTORY, "applications.json");
var STATIC_ASSETS = {
  "/park-map.css": { filename: "park-map.css", contentType: "text/css; charset=utf-8" },
  "/park-map.js": { filename: "park-map.js", contentType: "text/javascript; charset=utf-8" },
  "/application.css": { filename: "application.css", contentType: "text/css; charset=utf-8" },
  "/application.js": { filename: "application.js", contentType: "text/javascript; charset=utf-8" }
};
var REVIEW_EMAIL = "nathanijunshin@gmail.com";
var MAX_REQUEST_BYTES = 15 * 1024 * 1024;
var MAX_IMAGE_BYTES = 4 * 1024 * 1024;
var MAX_IMAGES = 5;
var SUBMISSION_WINDOW_MS = 15 * 60 * 1000;
var SUBMISSION_LIMIT = 5;
var submissionAttempts = new Map();

function loadEnvironmentFile(filename) {
  if (!fs.existsSync(filename)) return;

  var lines = fs.readFileSync(filename, "utf8").split(/\r?\n/);
  lines.forEach(function (line, index) {
    var entry = line.trim();
    if (!entry || entry.charAt(0) === "#") return;
    if (entry.indexOf("export ") === 0) entry = entry.slice(7).trim();

    var match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(entry);
    if (!match) throw new Error("Invalid .env entry on line " + (index + 1) + ".");

    var value = match[2].trim();
    var quote = value.charAt(0);
    if (quote === '"' || quote === "'") {
      var quotedValue = quote === '"'
        ? /^"((?:\\.|[^"])*)"\s*(?:#.*)?$/.exec(value)
        : /^'([^']*)'\s*(?:#.*)?$/.exec(value);
      if (!quotedValue) {
        throw new Error("Unterminated quoted value in .env on line " + (index + 1) + ".");
      }
      value = quotedValue[1];
      if (quote === '"') value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, '"');
    } else {
      value = value.replace(/\s+#.*$/, "").trim();
    }

    if (typeof process.env[match[1]] === "undefined") process.env[match[1]] = value;
  });
}

loadEnvironmentFile(path.join(ROOT, ".env"));

var config = {
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.RESEND_FROM_EMAIL,
  adminPassword: process.env.PARK_ADMIN_PASSWORD,
  publicUrl: (process.env.PARK_PUBLIC_URL || "").replace(/\/+$/, "")
};

function requireConfiguration() {
  var missing = [];
  if (!config.apiKey) missing.push("RESEND_API_KEY");
  if (!config.from || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(config.from)) missing.push("RESEND_FROM_EMAIL");
  if (!config.adminPassword || config.adminPassword.length < 20) missing.push("PARK_ADMIN_PASSWORD (at least 20 characters)");
  if (missing.length) {
    throw new Error("Configure these environment variables before starting the server: " + missing.join(", "));
  }
  if (config.publicUrl && !/^https:\/\/[^/]+(?:\/.*)?$/i.test(config.publicUrl)) {
    throw new Error("PARK_PUBLIC_URL must be an HTTPS URL.");
  }
}

function readApplications() {
  var content = fs.readFileSync(APPLICATIONS_FILE, "utf8");
  var applications = JSON.parse(content);
  if (!Array.isArray(applications)) throw new Error("Application data must be a JSON array.");
  return applications;
}

function writeApplications(applications) {
  var temporaryFile = APPLICATIONS_FILE + ".tmp";
  fs.writeFileSync(temporaryFile, JSON.stringify(applications, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, APPLICATIONS_FILE);
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

function readRequestBody(request, limit, callback) {
  var chunks = [];
  var bytesRead = 0;
  var finished = false;

  function finish(error, body) {
    if (finished) return;
    finished = true;
    callback(error, body);
  }

  if (Number(request.headers["content-length"]) > limit) {
    request.resume();
    finish(new Error("Request body is too large."));
    return;
  }

  request.on("data", function (chunk) {
    bytesRead += chunk.length;
    if (bytesRead > limit) {
      request.resume();
      finish(new Error("Request body is too large."));
      return;
    }
    chunks.push(chunk);
  });
  request.on("end", function () {
    finish(null, Buffer.concat(chunks).toString("utf8"));
  });
  request.on("error", function (error) {
    finish(error);
  });
}

function safeEqual(left, right) {
  var leftHash = crypto.createHash("sha256").update(String(left)).digest();
  var rightHash = crypto.createHash("sha256").update(String(right)).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function isAdmin(request, response) {
  var authorization = request.headers.authorization || "";
  var match = authorization.match(/^Basic\s+(.+)$/i);
  var credentials = "";
  if (match) {
    try {
      credentials = Buffer.from(match[1], "base64").toString("utf8");
    } catch (error) {
      credentials = "";
    }
  }
  var separator = credentials.indexOf(":");
  var username = separator >= 0 ? credentials.slice(0, separator) : "";
  var password = separator >= 0 ? credentials.slice(separator + 1) : "";
  var validUsername = safeEqual(username, "admin");
  var validPassword = safeEqual(password, config.adminPassword);

  if (validUsername && validPassword) return true;
  response.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Park application review", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end("Admin authentication required.");
  return false;
}

function validateImages(images) {
  var allowedTypes = {
    "image/jpeg": { extension: "jpg", signature: function (buffer) { return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff; } },
    "image/png": { extension: "png", signature: function (buffer) { return buffer.length >= 8 && buffer.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); } },
    "image/gif": { extension: "gif", signature: function (buffer) { var signature = buffer.slice(0, 6).toString("ascii"); return signature === "GIF87a" || signature === "GIF89a"; } },
    "image/webp": { extension: "webp", signature: function (buffer) { return buffer.length >= 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP"; } }
  };
  if (!Array.isArray(images) || images.length > MAX_IMAGES) throw new Error("Select no more than 5 images.");

  var totalBytes = 0;
  var validatedImages = [];
  images.forEach(function (image) {
    if (!image || typeof image.data !== "string" || typeof image.type !== "string") {
      throw new Error("One of the selected image files is invalid.");
    }
    var type = allowedTypes[image.type];
    if (!type || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data)) {
      throw new Error("Images must be valid JPG, PNG, GIF, or WebP files.");
    }

    var content = Buffer.from(image.data, "base64");
    totalBytes += content.length;
    if (!content.length || content.length > MAX_IMAGE_BYTES || !type.signature(content)) {
      throw new Error("Each image must be a valid image no larger than 4 MB.");
    }

    var fileName = path.basename(String(image.name || "park-photo"))
      .replace(/[^A-Za-z0-9._-]/g, "_")
      .slice(0, 100);
    if (!fileName || fileName === "." || fileName === "..") fileName = "park-photo." + type.extension;
    validatedImages.push({
      name: fileName,
      type: image.type,
      data: image.data
    });
  });
  if (totalBytes > 10 * 1024 * 1024) throw new Error("The total size of the images must be no more than 10 MB.");
  return validatedImages;
}

function validateApplication(input) {
  if (!input || typeof input !== "object") throw new Error("Enter the application details.");
  var email = String(input.email || "").trim();
  var parkName = String(input.parkName || "").trim();
  var address = String(input.address || "").trim();
  var latitude = input.latitude === undefined || input.latitude === null ? "" : String(input.latitude).trim();
  var longitude = input.longitude === undefined || input.longitude === null ? "" : String(input.longitude).trim();
  var amenities = input.amenities === undefined ? [] : input.amenities;
  var otherAmenity = String(input.otherAmenity || "").trim();
  var otherAmenitySelected = input.otherAmenitySelected === true;

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  if (!parkName || parkName.length > 120) throw new Error("Enter a park name no longer than 120 characters.");
  if (address.length > 300) throw new Error("The street address must be 300 characters or fewer.");
  if (!Array.isArray(amenities) || amenities.length > 50
    || amenities.some(function (amenity) {
      return typeof amenity !== "string" || !amenity.trim() || amenity.trim().length > 100;
    })) {
    throw new Error("Select valid park amenities.");
  }
  amenities = Array.from(new Set(amenities.map(function (amenity) { return amenity.trim(); })));
  if (otherAmenity.length > 100) throw new Error("Other amenities must be 100 characters or fewer.");
  if (otherAmenitySelected && !otherAmenity) throw new Error("Enter the other park amenity.");
  if (!otherAmenitySelected && otherAmenity) throw new Error("Select Other to enter another park amenity.");

  if ((!address && (!latitude || !longitude)) || (Boolean(latitude) !== Boolean(longitude))) {
    throw new Error("Enter a street address or both latitude and longitude.");
  }
  if (latitude && (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
    throw new Error("Enter a valid latitude between -90 and 90.");
  }
  if (longitude && (!Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
    throw new Error("Enter a valid longitude between -180 and 180.");
  }

  return {
    id: crypto.randomBytes(16).toString("hex"),
    email: email,
    parkName: parkName,
    address: address,
    latitude: latitude,
    longitude: longitude,
    amenities: amenities,
    otherAmenity: otherAmenity,
    images: validateImages(input.images || []),
    status: "pending",
    notificationStatus: "pending",
    createdAt: new Date().toISOString()
  };
}

function withinSubmissionLimit(request) {
  var now = Date.now();
  var address = request.socket.remoteAddress || "unknown";
  var attempts = (submissionAttempts.get(address) || []).filter(function (timestamp) {
    return now - timestamp < SUBMISSION_WINDOW_MS;
  });
  if (attempts.length >= SUBMISSION_LIMIT) {
    submissionAttempts.set(address, attempts);
    return false;
  }
  attempts.push(now);
  submissionAttempts.set(address, attempts);
  return true;
}

function sendResendEmail(message, callback) {
  var requestBody = Buffer.from(JSON.stringify(message));
  var finished = false;
  function finish(error) {
    if (finished) return;
    finished = true;
    callback(error);
  }

  var request = https.request({
    hostname: "api.resend.com",
    path: "/emails",
    method: "POST",
    headers: {
      "Authorization": "Bearer " + config.apiKey,
      "Content-Type": "application/json",
      "Content-Length": requestBody.length
    }
  }, function (response) {
    response.on("end", function () {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        finish(null);
      } else {
        finish(new Error("Email provider returned status " + response.statusCode + "."));
      }
    });
    response.resume();
  });

  request.setTimeout(15000, function () {
    request.abort();
  });
  request.on("error", function () {
    finish(new Error("Could not connect to the email provider."));
  });
  request.end(requestBody);
}

function applicationEmailMarkup(application) {
  var location = [];
  var amenities = (application.amenities || []).slice();
  if (application.otherAmenity) amenities.push("Other: " + application.otherAmenity);
  if (application.address) location.push("<p><strong>Address:</strong> " + escapeHtml(application.address) + "</p>");
  if (application.latitude && application.longitude) {
    location.push("<p><strong>Coordinates:</strong> " + escapeHtml(application.latitude) + ", " + escapeHtml(application.longitude) + "</p>");
  }
  if (amenities.length) {
    location.push("<p><strong>Amenities:</strong> " + amenities.map(escapeHtml).join(", ") + "</p>");
  }
  var adminUrl = config.publicUrl ? config.publicUrl + "/admin" : "";
  var reviewLink = adminUrl
    ? '<a href="' + escapeHtml(adminUrl) + '">' + escapeHtml(adminUrl) + "</a>"
    : "<code>/admin</code> on the deployed park-map site";
  return "<h1>New park application</h1>"
    + "<p><strong>Park:</strong> " + escapeHtml(application.parkName) + "</p>"
    + "<p><strong>Applicant email:</strong> " + escapeHtml(application.email) + "</p>"
    + location.join("")
    + "<p><strong>Reference:</strong> " + escapeHtml(application.id) + "</p>"
    + "<p>Review this application at " + reviewLink
    + " and approve or decline it to email the applicant.</p>";
}

function createReviewEmail(application) {
  var adminUrl = config.publicUrl ? config.publicUrl + "/admin" : "";
  var attachments = application.images.map(function (image) {
    return {
      filename: image.name,
      content: image.data,
      content_type: image.type
    };
  });
  return {
    from: config.from,
    to: [REVIEW_EMAIL],
    reply_to: application.email,
    subject: "Park application: " + application.parkName,
    html: applicationEmailMarkup(application),
    text: "New park application\nPark: " + application.parkName
      + "\nApplicant email: " + application.email
      + (application.address ? "\nAddress: " + application.address : "")
      + (application.latitude && application.longitude
        ? "\nCoordinates: " + application.latitude + ", " + application.longitude
        : "")
      + ((application.amenities || []).length || application.otherAmenity
        ? "\nAmenities: " + (application.amenities || []).concat(application.otherAmenity ? ["Other: " + application.otherAmenity] : []).join(", ")
        : "")
      + "\nReference: " + application.id
      + "\nReview and decide at " + (adminUrl || "the /admin page on the deployed park-map site") + ".",
    attachments: attachments
  };
}

function notifyReviewTeam(application, callback) {
  sendResendEmail(createReviewEmail(application), callback);
}

function renderAdminPage(applications) {
  var cards = applications.slice().reverse().map(function (application) {
    var images = application.images.map(function (image) {
      return '<a href="data:' + escapeHtml(image.type) + ";base64," + escapeHtml(image.data)
        + '" target="_blank" rel="noopener"><img class="application-image" src="data:' + escapeHtml(image.type)
        + ";base64," + escapeHtml(image.data) + '" alt="' + escapeHtml(image.name) + '"></a>';
    }).join("");
    var location = application.address
      ? "<p><strong>Address:</strong> " + escapeHtml(application.address) + "</p>"
      : "";
    if (application.latitude && application.longitude) {
      location += "<p><strong>Coordinates:</strong> " + escapeHtml(application.latitude) + ", " + escapeHtml(application.longitude) + "</p>";
    }
    var amenities = (application.amenities || []).slice();
    if (application.otherAmenity) amenities.push("Other: " + application.otherAmenity);
    if (amenities.length) {
      location += "<p><strong>Amenities:</strong> " + amenities.map(escapeHtml).join(", ") + "</p>";
    }
    var decision = application.status === "pending"
      ? '<form class="decision-actions" method="post" action="/admin/applications/' + escapeHtml(application.id) + '/decision">'
        + '<button class="approve-button" name="decision" value="approved" type="submit">Approve</button>'
        + '<button class="decline-button" name="decision" value="rejected" type="submit">Decline</button></form>'
      : '<p class="decision-result">Decision: ' + (application.status === "approved" ? "Approved" : "Declined")
        + " · " + escapeHtml(application.decidedAt || "") + "</p>";
    var notice = application.notificationStatus === "failed"
      ? '<p class="notice notice--error">The review email could not be sent. This application is still saved.</p>'
      : "";
    return '<article class="application-card"><div class="card-heading"><h2>' + escapeHtml(application.parkName)
      + '</h2><span class="status status--' + escapeHtml(application.status) + '">' + escapeHtml(application.status)
      + "</span></div><p><strong>Applicant:</strong> <a href=\"mailto:" + escapeHtml(application.email) + "\">"
      + escapeHtml(application.email) + "</a></p>" + location + "<p><strong>Submitted:</strong> "
      + escapeHtml(application.createdAt) + "</p>" + notice + (images ? '<div class="images">' + images + "</div>" : "")
      + decision + "</article>";
  }).join("");

  return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">"
    + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Application review | Bay Area Parks</title>'
    + "<style>"
    + "body{margin:0;background:#f4f6ef;color:#20352b;font:15px/1.5 'Segoe UI',Arial,sans-serif}"
    + "header{padding:24px max(24px,calc((100% - 920px)/2));background:#e7eddf}"
    + "main{max-width:920px;margin:28px auto;padding:0 20px 50px}"
    + "h1,h2{font-family:Georgia,'Times New Roman',serif}h1{margin:0;font-size:36px}h2{margin:0}"
    + ".application-card{margin:18px 0;padding:22px;border:1px solid #e5e9df;border-radius:15px;background:#fffefa;box-shadow:0 8px 24px #22392a12}"
    + ".card-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}"
    + ".status{padding:4px 9px;border-radius:999px;background:#f2f3ec;color:#566456;font-size:12px;font-weight:700;text-transform:capitalize}"
    + ".status--approved{background:#e4efe0;color:#28503c}.status--rejected{background:#fff0e9;color:#843d29}"
    + ".images{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0}.application-image{width:150px;height:110px;border-radius:9px;object-fit:cover}"
    + ".decision-actions{display:flex;gap:10px;margin-top:18px}.decision-actions button{padding:10px 14px;border:0;border-radius:9px;color:white;cursor:pointer;font-weight:700}"
    + ".approve-button{background:#315c43}.decline-button{background:#934b38}.decision-result{font-weight:700}"
    + ".notice{padding:10px;border-radius:8px;background:#f8faf5}.notice--error{background:#fff2ed;color:#843d29}"
    + ".empty{padding:30px;border:1px dashed #cbd5c8;border-radius:12px;color:#68776c;text-align:center}"
    + "</style></head><body><header><h1>Park application review</h1></header><main>"
    + (cards || '<p class="empty">There are no applications yet.</p>')
    + "</main></body></html>";
}

function handleApplicationSubmission(request, response) {
  if (!withinSubmissionLimit(request)) {
    sendJson(response, 429, { error: "Too many applications from this connection. Please try again later." });
    return;
  }

  readRequestBody(request, MAX_REQUEST_BYTES, function (bodyError, body) {
    if (bodyError) {
      sendJson(response, 413, { error: bodyError.message });
      return;
    }

    var application;
    try {
      application = validateApplication(JSON.parse(body));
    } catch (error) {
      sendJson(response, 400, { error: error instanceof SyntaxError ? "The application data is invalid." : error.message });
      return;
    }

    var applications;
    try {
      applications = readApplications();
      applications.push(application);
      writeApplications(applications);
    } catch (error) {
      console.error("Could not save a park application:", error.message);
      sendJson(response, 500, { error: "The application could not be saved. Please try again later." });
      return;
    }

    notifyReviewTeam(application, function (emailError) {
      if (emailError) {
        application.notificationStatus = "failed";
        try {
          writeApplications(applications);
        } catch (error) {
          console.error("Could not save the email notification status:", error.message);
        }
        console.error("Could not notify the review team for application " + application.id + ".");
        sendJson(response, 502, {
          error: "Your application was saved, but the review team could not be notified. Please contact the park guide team."
        });
        return;
      }

      application.notificationStatus = "sent";
      try {
        writeApplications(applications);
      } catch (error) {
        console.error("Could not update the application notification status:", error.message);
      }
      sendJson(response, 201, { id: application.id, status: application.status });
    });
  });
}

function handleDecision(request, response, applicationId) {
  if (!isAdmin(request, response)) return;

  var expectedOrigin = (request.socket.encrypted ? "https://" : "http://") + request.headers.host;
  if (request.headers.origin !== expectedOrigin) {
    sendJson(response, 403, { error: "The review request origin could not be verified." });
    return;
  }

  readRequestBody(request, 1024, function (bodyError, body) {
    if (bodyError) {
      sendJson(response, 413, { error: "The decision request is too large." });
      return;
    }
    var decision = require("querystring").parse(body).decision;
    if (decision !== "approved" && decision !== "rejected") {
      sendJson(response, 400, { error: "Choose approve or decline." });
      return;
    }

    var applications;
    try {
      applications = readApplications();
    } catch (error) {
      console.error("Could not load park applications:", error.message);
      sendJson(response, 500, { error: "Application records could not be loaded." });
      return;
    }
    var application = applications.find(function (record) { return record.id === applicationId; });
    if (!application) {
      sendJson(response, 404, { error: "That application could not be found." });
      return;
    }
    if (application.status !== "pending") {
      sendJson(response, 409, { error: "A decision has already been recorded for this application." });
      return;
    }

    var accepted = decision === "approved";
    var subject = accepted ? "Your park application was accepted" : "An update on your park application";
    var decisionText = accepted
      ? 'Good news! Your suggestion for "' + application.parkName + '" has been accepted for the Bay Area Parks guide.'
      : 'Thank you for suggesting "' + application.parkName + '". It was not accepted for the Bay Area Parks guide at this time.';
    sendResendEmail({
      from: config.from,
      to: [application.email],
      subject: subject,
      text: decisionText,
      html: "<p>" + escapeHtml(decisionText) + "</p><p>Thank you for helping people find places to enjoy the outdoors.</p>"
    }, function (emailError) {
      if (emailError) {
        console.error("Could not send a decision email for application " + application.id + ".");
        sendJson(response, 502, { error: "The decision email could not be sent. No decision was recorded; please try again." });
        return;
      }

      application.status = decision;
      application.decidedAt = new Date().toISOString();
      try {
        writeApplications(applications);
      } catch (error) {
        console.error("Could not save the application decision:", error.message);
        sendJson(response, 500, { error: "The email was sent, but the decision could not be saved. Contact the site administrator." });
        return;
      }
      response.writeHead(303, { Location: "/admin", "Cache-Control": "no-store" });
      response.end();
    });
  });
}

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
}

function createServer() {
  return http.createServer(function (request, response) {
    setSecurityHeaders(response);
    var pathname = url.parse(request.url).pathname;

    if (request.method === "POST" && pathname === "/api/applications") {
      if (request.headers["content-type"] !== "application/json") {
        sendJson(response, 415, { error: "Applications must be submitted as JSON." });
        return;
      }
      handleApplicationSubmission(request, response);
      return;
    }

    if (request.method === "GET" && pathname === "/admin") {
      if (!isAdmin(request, response)) return;
      try {
        var applications = readApplications();
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        });
        response.end(renderAdminPage(applications));
      } catch (error) {
        console.error("Could not load park applications:", error.message);
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Application records could not be loaded.");
      }
      return;
    }

    var decisionMatch = pathname.match(/^\/admin\/applications\/([a-f0-9]{32})\/decision$/);
    if (request.method === "POST" && decisionMatch) {
      if (request.headers["content-type"] !== "application/x-www-form-urlencoded") {
        sendJson(response, 415, { error: "The decision request format is invalid." });
        return;
      }
      handleDecision(request, response, decisionMatch[1]);
      return;
    }

    var staticAsset = STATIC_ASSETS[pathname];
    if (request.method === "GET" && staticAsset) {
      fs.readFile(path.join(ROOT, staticAsset.filename), function (error, content) {
        if (error) {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Asset not found.");
          return;
        }
        response.writeHead(200, {
          "Content-Type": staticAsset.contentType,
          "Cache-Control": "no-cache"
        });
        response.end(content);
      });
      return;
    }

    if (request.method === "GET" && (pathname === "/" || pathname === "/index.html" || pathname === "/application.html" || pathname === "/search.html" || pathname === "/parks.html")) {
      var filename = pathname === "/" ? "index.html" : pathname.slice(1);
      fs.readFile(path.join(ROOT, filename), function (error, content) {
        if (error) {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Page not found.");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
          "Referrer-Policy": pathname === "/application.html"
            ? "no-referrer"
            : "strict-origin-when-cross-origin"
        });
        response.end(content);
      });
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found.");
  });
}

function startServer() {
  requireConfiguration();
  if (!fs.existsSync(DATA_DIRECTORY)) fs.mkdirSync(DATA_DIRECTORY);
  if (!fs.existsSync(APPLICATIONS_FILE)) writeApplications([]);

  var port = Number(process.env.PORT || 8080);
  var host = process.env.HOST || "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be between 1 and 65535.");

  createServer().listen(port, host, function () {
    console.log("Park map server listening on http://" + host + ":" + port);
    if (host !== "127.0.0.1" && host !== "localhost" && host !== "::1") {
      console.warn("Use HTTPS at the public endpoint; do not expose this server directly over plain HTTP.");
    }
  });
}

if (require.main === module) {
  try {
    startServer();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  createServer: createServer,
  createReviewEmail: createReviewEmail,
  renderAdminPage: renderAdminPage,
  validateApplication: validateApplication,
  validateImages: validateImages
};
