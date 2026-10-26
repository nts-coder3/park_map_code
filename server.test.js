"use strict";

var assert = require("assert");
var fs = require("fs");
var http = require("http");
var path = require("path");
var backend = require("./server");

var validApplication = {
  email: "neighbor@example.com",
  parkName: "Garden Park",
  address: "1 Park Way",
  images: []
};

var application = backend.validateApplication(validApplication);
assert.strictEqual(application.email, validApplication.email);
assert.strictEqual(application.status, "pending");
assert.strictEqual(application.images.length, 0);
assert.deepStrictEqual(application.amenities, []);
assert.strictEqual(application.otherAmenity, "");

var applicationWithAmenities = backend.validateApplication({
  email: "neighbor@example.com",
  parkName: "Amenity Park",
  address: "1 Park Way",
  amenities: ["Picnic area", "Drinking fountain", "Picnic area"],
  otherAmenity: "<scenic feature>",
  otherAmenitySelected: true
});
assert.deepStrictEqual(applicationWithAmenities.amenities, ["Picnic area", "Drinking fountain"]);
assert.strictEqual(applicationWithAmenities.otherAmenity, "<scenic feature>");
var amenityReviewEmail = backend.createReviewEmail(applicationWithAmenities);
assert(amenityReviewEmail.text.includes("Amenities: Picnic area, Drinking fountain, Other: <scenic feature>"));
assert(amenityReviewEmail.html.includes("Other: &lt;scenic feature&gt;"));

assert.throws(function () {
  backend.validateApplication({
    email: "neighbor@example.com",
    parkName: "Missing Other Amenity",
    address: "1 Park Way",
    otherAmenitySelected: true
  });
}, /Enter the other park amenity/);

var coordinatesOnly = backend.validateApplication({
  email: "neighbor@example.com",
  parkName: "Coordinate Park",
  latitude: 0,
  longitude: -122.4
});
assert.strictEqual(coordinatesOnly.latitude, "0");
assert.strictEqual(coordinatesOnly.longitude, "-122.4");

assert.throws(function () {
  backend.validateApplication({
    email: "neighbor@example.com",
    parkName: "Incomplete Park",
    address: "1 Park Way",
    latitude: "37.7"
  });
}, /both latitude and longitude/);

assert.throws(function () {
  backend.validateApplication({
    email: "not-an-email",
    parkName: "Garden Park",
    address: "1 Park Way"
  });
}, /valid email address/);

assert.throws(function () {
  backend.validateApplication({
    email: "neighbor@example.com",
    parkName: "Out of bounds",
    latitude: "91",
    longitude: "-122"
  });
}, /valid latitude/);

var gifApplication = backend.validateApplication({
  email: "neighbor@example.com",
  parkName: "Photo Park",
  address: "1 Park Way",
  images: [{
    name: "park.gif",
    type: "image/gif",
    data: "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
  }]
});
assert.strictEqual(gifApplication.images[0].name, "park.gif");
var reviewEmail = backend.createReviewEmail(gifApplication);
assert.deepStrictEqual(reviewEmail.to, ["nathanijunshin@gmail.com"]);
assert.strictEqual(reviewEmail.reply_to, "neighbor@example.com");
assert.strictEqual(reviewEmail.attachments.length, 1);
assert(reviewEmail.text.indexOf("Photo Park") !== -1);

assert.throws(function () {
  backend.validateApplication({
    email: "neighbor@example.com",
    parkName: "Spoofed image",
    address: "1 Park Way",
    images: [{ name: "fake.png", type: "image/png", data: "ZmFrZQ==" }]
  });
}, /valid image/);

var adminPage = backend.renderAdminPage([{
  id: "0123456789abcdef0123456789abcdef",
  email: "neighbor@example.com",
  parkName: "<script>alert(1)</script>",
  address: "1 Park Way",
  amenities: ["Picnic area"],
  otherAmenity: "<img src=x>",
  latitude: "",
  longitude: "",
  images: [],
  status: "pending",
  notificationStatus: "sent",
  createdAt: "2026-10-09T12:00:00.000Z"
}]);
assert(adminPage.indexOf("&lt;script&gt;alert(1)&lt;/script&gt;") !== -1);
assert(adminPage.includes("Amenities:</strong> Picnic area, Other: &lt;img src=x&gt;"));
assert.strictEqual(adminPage.indexOf("<script>alert(1)</script>"), -1);

var mapScript = fs.readFileSync(path.join(__dirname, "park-map.js"), "utf8");
assert(mapScript.includes("https://tile.openstreetmap.org/{z}/{x}/{y}.png"));
assert(!mapScript.includes("{s}.tile.openstreetmap.org"));
assert(mapScript.includes("https://www.openstreetmap.org/copyright"));

var server = backend.createServer();
server.listen(0, "127.0.0.1", function () {
  var port = server.address().port;
  http.get({ host: "127.0.0.1", port: port, path: "/" }, function (mapResponse) {
    assert.strictEqual(mapResponse.statusCode, 200);
    assert.strictEqual(mapResponse.headers["referrer-policy"], "strict-origin-when-cross-origin");
    mapResponse.resume();

    http.get({ host: "127.0.0.1", port: port, path: "/admin" }, function (adminResponse) {
      assert.strictEqual(adminResponse.statusCode, 401);
      assert.strictEqual(adminResponse.headers["referrer-policy"], "no-referrer");
      adminResponse.resume();

      http.get({ host: "127.0.0.1", port: port, path: "/application.html" }, function (applicationResponse) {
        assert.strictEqual(applicationResponse.statusCode, 200);
        assert.strictEqual(applicationResponse.headers["referrer-policy"], "no-referrer");
        applicationResponse.resume();

        http.get({ host: "127.0.0.1", port: port, path: "/parks.html" }, function (parksResponse) {
          assert.strictEqual(parksResponse.statusCode, 200);
          assert.strictEqual(parksResponse.headers["referrer-policy"], "strict-origin-when-cross-origin");
          var parksHtml = "";
          parksResponse.setEncoding("utf8");
          parksResponse.on("data", function (chunk) {
            parksHtml += chunk;
          });
          parksResponse.on("end", function () {
            assert(parksHtml.includes('<body data-page="parks">'));
            assert(parksHtml.includes('id="park-grid"'));
            assert(parksHtml.includes('<script src="park-map.js"></script>'));

            console.log("Park application backend checks passed.");
            server.close();
          });
        }).on("error", function (error) {
          console.error(error);
          server.close();
          process.exitCode = 1;
        });
      }).on("error", function (error) {
        console.error(error);
        server.close();
        process.exitCode = 1;
      });
    }).on("error", function (error) {
      console.error(error);
      server.close();
      process.exitCode = 1;
    });
  }).on("error", function (error) {
    console.error(error);
    server.close();
    process.exitCode = 1;
  });
});
