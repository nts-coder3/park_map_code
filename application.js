    const applicationForm = document.getElementById("application-form");
    const addressInput = document.getElementById("address");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const imageInput = document.getElementById("images");
    const otherAmenityToggle = document.getElementById("other-amenity-toggle");
    const otherAmenityField = document.getElementById("other-amenity-field");
    const otherAmenityInput = document.getElementById("other-amenity");
    const submitButton = applicationForm.querySelector('button[type="submit"]');
    const formMessage = document.getElementById("form-message");

    otherAmenityToggle.addEventListener("change", () => {
      otherAmenityField.hidden = !otherAmenityToggle.checked;
      otherAmenityInput.required = otherAmenityToggle.checked;
      if (!otherAmenityToggle.checked) otherAmenityInput.value = "";
    });

    [addressInput, latitudeInput, longitudeInput].forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });
    imageInput.addEventListener("change", () => imageInput.setCustomValidity(""));

    applicationForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const hasAddress = addressInput.value.trim().length > 0;
      const hasLatitude = latitudeInput.value.trim().length > 0;
      const hasLongitude = longitudeInput.value.trim().length > 0;

      addressInput.setCustomValidity("");
      latitudeInput.setCustomValidity("");
      longitudeInput.setCustomValidity("");

      if (hasLatitude !== hasLongitude) {
        if (hasLatitude && !hasLongitude) {
          longitudeInput.setCustomValidity("Enter longitude to complete the coordinates, or provide an address.");
        } else if (!hasLatitude && hasLongitude) {
          latitudeInput.setCustomValidity("Enter latitude to complete the coordinates, or provide an address.");
        }
      } else if (!hasAddress && !hasLatitude && !hasLongitude) {
        addressInput.setCustomValidity("Enter a street address or both latitude and longitude.");
      }

      if (!applicationForm.reportValidity()) return;

      if (imageInput.files.length > 5) {
        imageInput.setCustomValidity("Select no more than 5 images.");
        imageInput.reportValidity();
        return;
      }

      imageInput.setCustomValidity("");
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const selectedImages = Array.from(imageInput.files);
      const totalImageSize = selectedImages.reduce((total, image) => total + image.size, 0);
      if (selectedImages.some((image) => (
        !allowedImageTypes.includes(image.type) || image.size > 4 * 1024 * 1024
      ))) {
        imageInput.setCustomValidity("Each image must be a JPG, PNG, GIF, or WebP file no larger than 4 MB.");
        imageInput.reportValidity();
        return;
      }
      if (totalImageSize > 10 * 1024 * 1024) {
        imageInput.setCustomValidity("The total size of your images must be no more than 10 MB.");
        imageInput.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
      formMessage.hidden = true;
      formMessage.classList.remove("form-message--error");

      try {
        const images = await Promise.all(selectedImages.map((image) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: image.name,
            type: image.type,
            data: String(reader.result).split(",")[1]
          });
          reader.onerror = () => reject(new Error(`Could not read ${image.name}.`));
          reader.readAsDataURL(image);
        })));
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: document.getElementById("email").value.trim(),
            parkName: document.getElementById("park-name").value.trim(),
            address: addressInput.value.trim(),
            latitude: latitudeInput.value.trim(),
            longitude: longitudeInput.value.trim(),
            amenities: Array.from(applicationForm.querySelectorAll('input[name="amenities"]:checked'))
              .map((amenity) => amenity.value),
            otherAmenity: otherAmenityToggle.checked ? otherAmenityInput.value.trim() : "",
            otherAmenitySelected: otherAmenityToggle.checked,
            images
          })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "The application could not be submitted. Please try again.");
        }

        formMessage.textContent = "Application submitted for review. We’ll email you when a decision is made.";
        formMessage.hidden = false;
        applicationForm.reset();
        otherAmenityField.hidden = true;
        otherAmenityInput.required = false;
      } catch (error) {
        formMessage.textContent = error.message || "The application could not be submitted. Please try again.";
        formMessage.classList.add("form-message--error");
        formMessage.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit application";
      }
    });
