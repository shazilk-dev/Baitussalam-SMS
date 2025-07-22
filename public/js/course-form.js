// Course Form JavaScript - Specialized for Add/Edit Forms
document.addEventListener("DOMContentLoaded", function () {
  // ===== FORM ELEMENTS =====
  const courseForm = document.getElementById("courseForm");
  const titleInput = document.getElementById("title");
  const codeInput = document.getElementById("code");
  const descriptionInput = document.getElementById("description");
  const instructorInput = document.getElementById("instructor");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const statusInput = document.getElementById("status");

  // Preview elements
  const previewTitle = document.getElementById("preview-title");
  const previewCode = document.getElementById("preview-code");
  const previewInstructor = document.getElementById("preview-instructor");
  const previewDuration = document.getElementById("preview-duration");
  const previewStatus = document.getElementById("preview-status");

  // ===== ENHANCED VALIDATION FUNCTIONS =====
  const validation = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-&().]+$/,
      validate: function (value) {
        const errors = [];
        const trimmedValue = value.trim();

        if (!trimmedValue) {
          errors.push("Course title is required");
        } else if (trimmedValue.length < this.minLength) {
          errors.push(
            `Course title must be at least ${this.minLength} characters long`
          );
        } else if (trimmedValue.length > this.maxLength) {
          errors.push(
            `Course title cannot exceed ${this.maxLength} characters`
          );
        } else if (!this.pattern.test(trimmedValue)) {
          errors.push("Course title contains invalid characters");
        }

        return errors;
      },
    },

    code: {
      required: true,
      minLength: 2,
      maxLength: 20,
      pattern: /^[A-Z0-9\-_]+$/,
      validate: function (value) {
        const errors = [];
        const trimmedValue = value.trim().toUpperCase();

        if (!trimmedValue) {
          errors.push("Course code is required");
        } else if (trimmedValue.length < this.minLength) {
          errors.push(
            `Course code must be at least ${this.minLength} characters long`
          );
        } else if (trimmedValue.length > this.maxLength) {
          errors.push(`Course code cannot exceed ${this.maxLength} characters`);
        } else if (!this.pattern.test(trimmedValue)) {
          errors.push(
            "Course code can only contain uppercase letters, numbers, hyphens, and underscores"
          );
        }

        return errors;
      },
    },

    instructor: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-.]+$/,
      validate: function (value) {
        const errors = [];
        const trimmedValue = value.trim();

        if (!trimmedValue) {
          errors.push("Instructor name is required");
        } else if (trimmedValue.length < this.minLength) {
          errors.push(
            `Instructor name must be at least ${this.minLength} characters long`
          );
        } else if (trimmedValue.length > this.maxLength) {
          errors.push(
            `Instructor name cannot exceed ${this.maxLength} characters`
          );
        } else if (!this.pattern.test(trimmedValue)) {
          errors.push("Instructor name contains invalid characters");
        }

        return errors;
      },
    },

    dates: {
      validate: function (startDate, endDate) {
        const errors = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!startDate) {
          errors.push("Start date is required");
        }
        if (!endDate) {
          errors.push("End date is required");
        }

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);

          if (end <= start) {
            errors.push("End date must be after start date");
          }

          const daysDifference = (end - start) / (1000 * 60 * 60 * 24);

          if (daysDifference < 7) {
            errors.push("Course duration must be at least 1 week");
          }

          if (daysDifference > 730) {
            // 2 years
            errors.push("Course duration cannot exceed 2 years");
          }

          // Check if start date is too far in the past (for new courses)
          const isNewCourse = !window.location.pathname.includes("/edit");
          if (isNewCourse && start < today) {
            const daysPast = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
            if (daysPast > 30) {
              errors.push("Start date cannot be more than 30 days in the past");
            }
          }
        }

        return errors;
      },
    },

    description: {
      required: false,
      maxLength: 1000,
      validate: function (value) {
        const errors = [];
        const trimmedValue = value.trim();

        if (trimmedValue && trimmedValue.length > this.maxLength) {
          errors.push(`Description cannot exceed ${this.maxLength} characters`);
        }

        return errors;
      },
    },
  };

  // ===== UTILITY FUNCTIONS =====
  function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return "Duration will be calculated";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.ceil(daysDiff / 7);
    const monthsDiff = Math.ceil(daysDiff / 30);

    if (daysDiff <= 0) {
      return "Invalid duration";
    } else if (daysDiff < 7) {
      return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
    } else if (daysDiff < 60) {
      return `${weeksDiff} week${
        weeksDiff !== 1 ? "s" : ""
      } (${daysDiff} days)`;
    } else {
      return `${monthsDiff} month${
        monthsDiff !== 1 ? "s" : ""
      } (${weeksDiff} weeks)`;
    }
  }

  function formatCourseName(title) {
    return title
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function suggestCourseCode(title) {
    if (!title || title.trim().length === 0) return "";

    // Extract meaningful words and create acronym
    const words = title
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2); // Only words longer than 2 chars

    if (words.length === 0) return "";

    // Create code from first letters + current year
    const currentYear = new Date().getFullYear();
    const acronym = words
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 4);

    return `${acronym}-${currentYear}`;
  }

  function displayFieldError(fieldName, errors) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement && inputElement) {
      if (errors.length > 0) {
        errorElement.textContent = errors[0];
        errorElement.style.display = "block";
        inputElement.classList.add("error");
      } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
        inputElement.classList.remove("error");
      }
    }
  }

  function updatePreview() {
    if (!previewTitle) return; // Not on form page

    // Update title
    const titleValue = titleInput ? titleInput.value.trim() : "";
    if (previewTitle) {
      previewTitle.textContent = titleValue || "Course title will appear here";
    }

    // Update code
    const codeValue = codeInput ? codeInput.value.trim().toUpperCase() : "";
    if (previewCode) {
      previewCode.textContent = codeValue || "COURSE-CODE";
    }

    // Update instructor
    const instructorValue = instructorInput ? instructorInput.value.trim() : "";
    if (previewInstructor) {
      previewInstructor.textContent = instructorValue || "Instructor name";
    }

    // Update duration
    if (previewDuration) {
      const startDate = startDateInput ? startDateInput.value : "";
      const endDate = endDateInput ? endDateInput.value : "";
      previewDuration.textContent = calculateDuration(startDate, endDate);
    }

    // Update status
    if (previewStatus && statusInput) {
      const status = statusInput.value || "upcoming";
      previewStatus.innerHTML = `<span class="status-badge status-${status}">${
        status.charAt(0).toUpperCase() + status.slice(1)
      }</span>`;
    }
  }

  // ===== ENHANCED FORM INTERACTIONS =====
  if (courseForm) {
    // Title input enhancements
    if (titleInput) {
      let titleTimeout;

      titleInput.addEventListener("input", function () {
        const formattedTitle = formatCourseName(this.value);
        if (this.value !== formattedTitle) {
          const cursorPos = this.selectionStart;
          this.value = formattedTitle;
          this.setSelectionRange(cursorPos, cursorPos);
        }

        // Auto-suggest course code based on title
        if (codeInput && !codeInput.value.trim()) {
          clearTimeout(titleTimeout);
          titleTimeout = setTimeout(() => {
            const suggestedCode = suggestCourseCode(this.value);
            if (suggestedCode) {
              codeInput.value = suggestedCode;
              updatePreview();
            }
          }, 1000); // Wait 1 second after user stops typing
        }

        updatePreview();
      });

      titleInput.addEventListener("blur", function () {
        const errors = validation.title.validate(this.value);
        displayFieldError("title", errors);
      });
    }

    // Code input enhancements
    if (codeInput) {
      codeInput.addEventListener("input", function () {
        // Auto-format to uppercase and remove invalid chars
        const cleaned = this.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, "");
        if (this.value !== cleaned) {
          const cursorPos = this.selectionStart;
          this.value = cleaned;
          this.setSelectionRange(cursorPos, cursorPos);
        }
        updatePreview();
      });

      codeInput.addEventListener("blur", function () {
        const errors = validation.code.validate(this.value);
        displayFieldError("code", errors);
      });
    }

    // Instructor input enhancements
    if (instructorInput) {
      instructorInput.addEventListener("input", function () {
        // Capitalize first letter of each word
        const words = this.value.split(" ");
        const capitalizedWords = words.map((word) => {
          if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word;
        });
        const formatted = capitalizedWords.join(" ");

        if (this.value !== formatted) {
          const cursorPos = this.selectionStart;
          this.value = formatted;
          this.setSelectionRange(cursorPos, cursorPos);
        }

        updatePreview();
      });

      instructorInput.addEventListener("blur", function () {
        const errors = validation.instructor.validate(this.value);
        displayFieldError("instructor", errors);
      });
    }

    // Description textarea enhancements
    if (descriptionInput) {
      const charCounter = document.createElement("div");
      charCounter.className = "char-counter";
      descriptionInput.parentNode.appendChild(charCounter);

      function updateCharCount() {
        const current = descriptionInput.value.length;
        const max = validation.description.maxLength;
        charCounter.textContent = `${current}/${max} characters`;
        charCounter.className = `char-counter ${
          current > max * 0.9 ? "warning" : ""
        }`;
      }

      descriptionInput.addEventListener("input", updateCharCount);
      descriptionInput.addEventListener("blur", function () {
        const errors = validation.description.validate(this.value);
        displayFieldError("description", errors);
      });

      updateCharCount();
    }

    // Date input enhancements
    function setupDateValidation() {
      if (startDateInput && endDateInput) {
        const validateDates = () => {
          const errors = validation.dates.validate(
            startDateInput.value,
            endDateInput.value
          );
          displayFieldError("startDate", errors);
          displayFieldError("endDate", errors);
          updatePreview();
        };

        startDateInput.addEventListener("change", validateDates);
        endDateInput.addEventListener("change", validateDates);

        // Set minimum date to today for new courses
        if (!window.location.pathname.includes("/edit")) {
          const today = new Date().toISOString().split("T")[0];
          startDateInput.setAttribute("min", today);

          startDateInput.addEventListener("change", function () {
            // Set end date minimum to start date
            endDateInput.setAttribute("min", this.value);
            if (endDateInput.value && endDateInput.value <= this.value) {
              endDateInput.value = "";
            }
          });
        }
      }
    }

    setupDateValidation();

    // Status change handling
    if (statusInput) {
      statusInput.addEventListener("change", function () {
        updatePreview();

        // Show warning for status changes
        const isEdit = window.location.pathname.includes("/edit");
        if (isEdit && this.value === "completed") {
          showStatusWarning(
            "Setting course to completed will affect student enrollments and attendance tracking."
          );
        }
      });
    }

    // ===== FORM SUBMISSION =====
    courseForm.addEventListener("submit", function (e) {
      let hasErrors = false;
      const errors = {};

      // Validate all fields
      if (titleInput) {
        errors.title = validation.title.validate(titleInput.value);
        displayFieldError("title", errors.title);
        if (errors.title.length > 0) hasErrors = true;
      }

      if (codeInput) {
        errors.code = validation.code.validate(codeInput.value);
        displayFieldError("code", errors.code);
        if (errors.code.length > 0) hasErrors = true;
      }

      if (instructorInput) {
        errors.instructor = validation.instructor.validate(
          instructorInput.value
        );
        displayFieldError("instructor", errors.instructor);
        if (errors.instructor.length > 0) hasErrors = true;
      }

      if (startDateInput && endDateInput) {
        errors.dates = validation.dates.validate(
          startDateInput.value,
          endDateInput.value
        );
        displayFieldError("startDate", errors.dates);
        displayFieldError("endDate", errors.dates);
        if (errors.dates.length > 0) hasErrors = true;
      }

      if (descriptionInput) {
        errors.description = validation.description.validate(
          descriptionInput.value
        );
        displayFieldError("description", errors.description);
        if (errors.description.length > 0) hasErrors = true;
      }

      if (hasErrors) {
        e.preventDefault();

        // Focus on first error field
        const errorFields = [
          "title",
          "code",
          "instructor",
          "startDate",
          "endDate",
          "description",
        ];
        for (const field of errorFields) {
          if (errors[field] && errors[field].length > 0) {
            const element = document.getElementById(field);
            if (element) {
              element.focus();
              break;
            }
          }
        }

        showNotification("Please fix the errors before submitting", "error");
        return false;
      }

      // Show loading state
      const submitBtn = document.getElementById("submitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        const isEdit = window.location.pathname.includes("/edit");
        submitBtn.innerHTML = `
          <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          ${isEdit ? "Updating..." : "Creating..."}
        `;
      }

      // Final validation on server side will catch any remaining issues
      return true;
    });

    // ===== CANCEL BUTTON =====
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        const hasChanges = checkForChanges();

        if (hasChanges) {
          if (
            confirm(
              "You have unsaved changes. Are you sure you want to cancel?"
            )
          ) {
            navigateBack();
          }
        } else {
          navigateBack();
        }
      });
    }

    function checkForChanges() {
      // Check if form has been modified from initial state
      const inputs = courseForm.querySelectorAll("input, textarea, select");
      return Array.from(inputs).some((input) => {
        return input.defaultValue !== input.value;
      });
    }

    function navigateBack() {
      if (window.location.pathname.includes("/edit")) {
        const courseId = window.location.pathname.split("/")[2];
        window.location.href = `/courses/${courseId}`;
      } else {
        window.location.href = "/courses";
      }
    }
  }

  // ===== UTILITY FUNCTIONS =====
  function showStatusWarning(message) {
    const warningDiv = document.createElement("div");
    warningDiv.className = "form-warning";
    warningDiv.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>${message}</span>
    `;

    const statusGroup = statusInput.closest(".form-group");
    const existingWarning = statusGroup.querySelector(".form-warning");
    if (existingWarning) {
      existingWarning.remove();
    }

    statusGroup.appendChild(warningDiv);

    setTimeout(() => {
      warningDiv.remove();
    }, 5000);
  }

  function showNotification(message, type = "info") {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification(notification);
    }, 5000);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        hideNotification(notification);
      });
  }

  function hideNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener("keydown", function (e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      if (courseForm) {
        courseForm.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    }

    // Escape to cancel
    if (e.key === "Escape") {
      const cancelBtn = document.getElementById("cancelBtn");
      if (cancelBtn) {
        cancelBtn.click();
      }
    }
  });

  // ===== INITIALIZE =====
  // Set up initial preview
  updatePreview();

  // Add CSS for spinner animation
  const style = document.createElement("style");
  style.textContent = `
    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .char-counter {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      margin-top: 0.25rem;
      text-align: right;
    }
    
    .char-counter.warning {
      color: var(--warning-600);
    }
    
    .form-warning {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.75rem;
      background-color: var(--warning-50);
      border: 1px solid var(--warning-200);
      border-radius: 6px;
      color: var(--warning-800);
      font-size: 0.875rem;
    }
    
    .form-warning svg {
      color: var(--warning-600);
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);
});
