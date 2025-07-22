// ===== STUDENT FORM FUNCTIONALITY =====

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".student-form");
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form) return;

  // Form validation
  function validateForm() {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    let isValid = true;

    // Clear previous errors
    clearValidationErrors();

    // Validate full name
    if (!fullName.value.trim()) {
      showFieldError(fullName, "Full name is required");
      isValid = false;
    } else if (fullName.value.trim().length < 2) {
      showFieldError(fullName, "Full name must be at least 2 characters");
      isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
      showFieldError(email, "Email address is required");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showFieldError(email, "Please enter a valid email address");
      isValid = false;
    }

    // Validate phone if provided
    const phone = document.getElementById("phone");
    if (phone.value.trim() && !isValidPhone(phone.value.trim())) {
      showFieldError(phone, "Please enter a valid phone number");
      isValid = false;
    }

    return isValid;
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation (basic)
  function isValidPhone(phone) {
    // Allow various phone formats
    const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Show field error
  function showFieldError(field, message) {
    field.classList.add("error");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  // Clear validation errors
  function clearValidationErrors() {
    const errorFields = form.querySelectorAll(".form-input.error");
    errorFields.forEach((field) => field.classList.remove("error"));

    const errorMessages = form.querySelectorAll(".field-error");
    errorMessages.forEach((error) => error.remove());
  }

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show loading state
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
                <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                Saving...
            `;

      // Reset button after 10 seconds if form doesn't submit
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 10000);
    }

    // Submit the form
    form.submit();
  });

  // Real-time validation
  const inputs = form.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      // Clear previous error for this field
      this.classList.remove("error");
      const existingError = this.parentNode.querySelector(".field-error");
      if (existingError) {
        existingError.remove();
      }

      // Validate this field
      if (this.id === "fullName" && !this.value.trim()) {
        showFieldError(this, "Full name is required");
      } else if (this.id === "email" && !this.value.trim()) {
        showFieldError(this, "Email address is required");
      } else if (
        this.id === "email" &&
        this.value.trim() &&
        !isValidEmail(this.value.trim())
      ) {
        showFieldError(this, "Please enter a valid email address");
      } else if (
        this.id === "phone" &&
        this.value.trim() &&
        !isValidPhone(this.value.trim())
      ) {
        showFieldError(this, "Please enter a valid phone number");
      }
    });
  });

  // Auto-format phone number
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, ""); // Remove non-digits

      if (value.length > 0) {
        if (value.startsWith("92")) {
          // Pakistani format
          value = "+92-" + value.substring(2);
        } else if (value.startsWith("0")) {
          // Local format, convert to international
          value = "+92-" + value.substring(1);
        }

        // Add formatting
        if (value.includes("+92-")) {
          const number = value.replace("+92-", "");
          if (number.length >= 3) {
            value = "+92-" + number.substring(0, 3) + "-" + number.substring(3);
          }
        }
      }

      this.value = value;
    });
  }

  // Auto-capitalize full name
  const nameInput = document.getElementById("fullName");
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      const words = this.value.split(" ");
      const capitalizedWords = words.map((word) => {
        if (word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      });
      this.value = capitalizedWords.join(" ");
    });
  }

  // Handle course selection info
  const courseSelect = document.getElementById("courseId");
  if (courseSelect) {
    courseSelect.addEventListener("change", function () {
      const infoBox = form.querySelector(".info-box");
      if (this.value) {
        if (infoBox) {
          const content = infoBox.querySelector(".info-content p");
          if (content) {
            content.textContent =
              "The student will be automatically enrolled in the selected course with today's date.";
          }
        }
      }
    });
  }
});

// ===== UTILITY FUNCTIONS =====

// Show notification (if global notification system exists)
function showNotification(message, type = "success") {
  // Create notification if global system doesn't exist
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} notification-toast`;
  notification.innerHTML = `
        <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${
              type === "success"
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
                : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
            }
        </svg>
        ${message}
    `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Auto-dismiss alerts after 5 seconds
document.addEventListener("DOMContentLoaded", function () {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-10px)";
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 5000);
  });
});
