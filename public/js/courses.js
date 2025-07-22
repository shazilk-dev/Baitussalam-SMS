// Course Management JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // ===== COURSE FORM ELEMENTS =====
  const courseForm = document.getElementById("courseForm");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const sortFilter = document.getElementById("sortFilter");
  const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");

  // Form inputs for validation
  const titleInput = document.getElementById("title");
  const codeInput = document.getElementById("code");
  const instructorInput = document.getElementById("instructor");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const statusInput = document.getElementById("status");
  const descriptionInput = document.getElementById("description");

  // Preview elements
  const previewTitle = document.getElementById("preview-title");
  const previewCode = document.getElementById("preview-code");
  const previewInstructor = document.getElementById("preview-instructor");
  const previewDuration = document.getElementById("preview-duration");
  const previewStatus = document.getElementById("preview-status");

  // ===== FORM VALIDATION FUNCTIONS =====
  function validateTitle(title) {
    const errors = [];
    if (!title || title.trim().length === 0) {
      errors.push("Course title is required");
    } else if (title.trim().length < 3) {
      errors.push("Course title must be at least 3 characters long");
    } else if (title.trim().length > 100) {
      errors.push("Course title cannot exceed 100 characters");
    }
    return errors;
  }

  function validateCode(code) {
    const errors = [];
    const codeRegex = /^[A-Z0-9\-_]+$/;

    if (!code || code.trim().length === 0) {
      errors.push("Course code is required");
    } else if (!codeRegex.test(code.trim().toUpperCase())) {
      errors.push(
        "Course code can only contain letters, numbers, hyphens, and underscores"
      );
    } else if (code.trim().length < 2) {
      errors.push("Course code must be at least 2 characters long");
    } else if (code.trim().length > 20) {
      errors.push("Course code cannot exceed 20 characters");
    }
    return errors;
  }

  function validateInstructor(instructor) {
    const errors = [];
    if (!instructor || instructor.trim().length === 0) {
      errors.push("Instructor name is required");
    } else if (instructor.trim().length < 2) {
      errors.push("Instructor name must be at least 2 characters long");
    } else if (instructor.trim().length > 100) {
      errors.push("Instructor name cannot exceed 100 characters");
    }
    return errors;
  }

  function validateDates(startDate, endDate) {
    const errors = [];
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate) {
      errors.push("Start date is required");
    }
    if (!endDate) {
      errors.push("End date is required");
    }

    if (startDate && endDate) {
      if (end <= start) {
        errors.push("End date must be after start date");
      }

      const daysDifference = (end - start) / (1000 * 60 * 60 * 24);
      if (daysDifference < 7) {
        errors.push("Course duration must be at least 1 week");
      }

      if (daysDifference > 365) {
        errors.push("Course duration cannot exceed 1 year");
      }
    }

    return errors;
  }

  function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return "Duration will be calculated";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.ceil(daysDiff / 7);
    const monthsDiff = Math.ceil(daysDiff / 30);

    if (daysDiff < 7) {
      return `${daysDiff} days`;
    } else if (daysDiff < 60) {
      return `${weeksDiff} weeks`;
    } else {
      return `${monthsDiff} months`;
    }
  }

  function displayError(elementId, errors) {
    const errorElement = document.getElementById(`${elementId}-error`);
    const inputElement = document.getElementById(elementId);

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

  // ===== FORM REAL-TIME VALIDATION =====
  if (courseForm) {
    // Title validation
    if (titleInput) {
      titleInput.addEventListener("blur", function () {
        const errors = validateTitle(this.value);
        displayError("title", errors);
        updatePreview();
      });

      titleInput.addEventListener("input", function () {
        updatePreview();
      });
    }

    // Code validation
    if (codeInput) {
      codeInput.addEventListener("blur", function () {
        const errors = validateCode(this.value);
        displayError("code", errors);
        updatePreview();
      });

      codeInput.addEventListener("input", function () {
        // Auto-format code to uppercase
        this.value = this.value.toUpperCase();
        updatePreview();
      });
    }

    // Instructor validation
    if (instructorInput) {
      instructorInput.addEventListener("blur", function () {
        const errors = validateInstructor(this.value);
        displayError("instructor", errors);
        updatePreview();
      });

      instructorInput.addEventListener("input", function () {
        updatePreview();
      });
    }

    // Date validation
    if (startDateInput && endDateInput) {
      function validateDatesOnChange() {
        const errors = validateDates(startDateInput.value, endDateInput.value);
        displayError(
          "startDate",
          errors.filter(
            (e) =>
              e.includes("Start") ||
              e.includes("duration") ||
              e.includes("after")
          )
        );
        displayError(
          "endDate",
          errors.filter(
            (e) =>
              e.includes("End") || e.includes("duration") || e.includes("after")
          )
        );
        updatePreview();
      }

      startDateInput.addEventListener("change", validateDatesOnChange);
      endDateInput.addEventListener("change", validateDatesOnChange);
    }

    // Status change
    if (statusInput) {
      statusInput.addEventListener("change", function () {
        updatePreview();
      });
    }

    // Form submission
    courseForm.addEventListener("submit", function (e) {
      let hasErrors = false;

      // Validate all fields
      if (titleInput) {
        const titleErrors = validateTitle(titleInput.value);
        displayError("title", titleErrors);
        if (titleErrors.length > 0) hasErrors = true;
      }

      if (codeInput) {
        const codeErrors = validateCode(codeInput.value);
        displayError("code", codeErrors);
        if (codeErrors.length > 0) hasErrors = true;
      }

      if (instructorInput) {
        const instructorErrors = validateInstructor(instructorInput.value);
        displayError("instructor", instructorErrors);
        if (instructorErrors.length > 0) hasErrors = true;
      }

      if (startDateInput && endDateInput) {
        const dateErrors = validateDates(
          startDateInput.value,
          endDateInput.value
        );
        displayError("startDate", dateErrors);
        displayError("endDate", dateErrors);
        if (dateErrors.length > 0) hasErrors = true;
      }

      if (hasErrors) {
        e.preventDefault();
        showNotification("Please fix the errors before submitting", "error");
        return false;
      }

      // Show loading state
      const submitBtn = document.getElementById("submitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Processing...
        `;
      }
    });

    // Cancel button
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        if (window.location.pathname.includes("/edit")) {
          const courseId = window.location.pathname.split("/")[2];
          window.location.href = `/courses/${courseId}`;
        } else {
          window.location.href = "/courses";
        }
      });
    }
  }

  // ===== PREVIEW UPDATES =====
  function updatePreview() {
    if (!previewTitle) return; // Not on form page

    // Update title
    if (titleInput && previewTitle) {
      previewTitle.textContent =
        titleInput.value || "Course title will appear here";
    }

    // Update code
    if (codeInput && previewCode) {
      previewCode.textContent = codeInput.value.toUpperCase() || "COURSE-CODE";
    }

    // Update instructor
    if (instructorInput && previewInstructor) {
      previewInstructor.textContent =
        instructorInput.value || "Instructor name";
    }

    // Update duration
    if (startDateInput && endDateInput && previewDuration) {
      previewDuration.textContent = calculateDuration(
        startDateInput.value,
        endDateInput.value
      );
    }

    // Update status
    if (statusInput && previewStatus) {
      const status = statusInput.value || "upcoming";
      previewStatus.innerHTML = `<span class="status-badge status-${status}">${
        status.charAt(0).toUpperCase() + status.slice(1)
      }</span>`;
    }
  }

  // ===== COURSES LISTING FUNCTIONALITY =====
  const courseRows = document.querySelectorAll(".course-row");
  const courseCheckboxes = document.querySelectorAll(".course-checkbox");

  // Search functionality
  if (searchInput && courseRows.length > 0) {
    searchInput.addEventListener("input", filterCourses);
  }

  // Filter functionality
  if (statusFilter) {
    statusFilter.addEventListener("change", filterCourses);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", sortCourses);
  }

  // Select all functionality
  if (selectAllCheckbox && courseCheckboxes.length > 0) {
    selectAllCheckbox.addEventListener("change", function () {
      courseCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
      updateBulkDeleteButton();
    });

    // Individual checkbox handling
    courseCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        updateSelectAllState();
        updateBulkDeleteButton();
      });
    });
  }

  // ===== FILTER FUNCTIONS =====
  function filterCourses() {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    const selectedStatus = statusFilter ? statusFilter.value : "";

    let visibleCount = 0;

    courseRows.forEach((row) => {
      const title = row.getAttribute("data-title") || "";
      const code = row.getAttribute("data-code") || "";
      const instructor = row.getAttribute("data-instructor") || "";
      const status = row.getAttribute("data-status") || "";

      // Check search criteria
      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        code.includes(searchTerm) ||
        instructor.includes(searchTerm);

      // Check filter criteria
      const matchesStatus = !selectedStatus || status === selectedStatus;

      // Show/hide row
      const shouldShow = matchesSearch && matchesStatus;

      if (shouldShow) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    updateResultsCount(visibleCount);
  }

  function sortCourses() {
    if (!sortFilter) return;

    const tbody = document.querySelector(".courses-table tbody");
    const rows = Array.from(courseRows);
    const sortBy = sortFilter.value;

    rows.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a
            .getAttribute("data-title")
            .localeCompare(b.getAttribute("data-title"));
        case "title-desc":
          return b
            .getAttribute("data-title")
            .localeCompare(a.getAttribute("data-title"));
        case "status":
          return a
            .getAttribute("data-status")
            .localeCompare(b.getAttribute("data-status"));
        case "oldest":
          // Assume data-start-date attribute exists
          return (
            new Date(a.getAttribute("data-start-date")) -
            new Date(b.getAttribute("data-start-date"))
          );
        case "newest":
        default:
          return (
            new Date(b.getAttribute("data-start-date")) -
            new Date(a.getAttribute("data-start-date"))
          );
      }
    });

    // Reorder DOM elements
    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  }

  function updateResultsCount(count) {
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${count} course${
        count !== 1 ? "s" : ""
      }`;
    }
  }

  function updateSelectAllState() {
    if (!selectAllCheckbox) return;

    const checkedCount = document.querySelectorAll(
      ".course-checkbox:checked"
    ).length;
    const totalCount = courseCheckboxes.length;

    if (checkedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === totalCount) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  function updateBulkDeleteButton() {
    if (!bulkDeleteBtn) return;

    const checkedCount = document.querySelectorAll(
      ".course-checkbox:checked"
    ).length;

    if (checkedCount > 0) {
      bulkDeleteBtn.style.display = "inline-flex";
      bulkDeleteBtn.textContent = `Delete Selected (${checkedCount})`;
    } else {
      bulkDeleteBtn.style.display = "none";
    }
  }

  // ===== BULK DELETE FUNCTIONALITY =====
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener("click", function () {
      const selectedCourses = Array.from(
        document.querySelectorAll(".course-checkbox:checked")
      );
      const courseIds = selectedCourses.map((cb) => cb.value);

      if (courseIds.length === 0) {
        showNotification("No courses selected", "error");
        return;
      }

      if (
        confirm(
          `Are you sure you want to delete ${courseIds.length} selected course(s)?`
        )
      ) {
        performBulkDelete(courseIds);
      }
    });
  }

  async function performBulkDelete(courseIds) {
    try {
      const response = await fetch("/courses/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseIds }),
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message, "success");
        // Remove deleted rows from DOM
        courseIds.forEach((id) => {
          const checkbox = document.querySelector(
            `.course-checkbox[value="${id}"]`
          );
          if (checkbox) {
            const row = checkbox.closest(".course-row");
            if (row) row.remove();
          }
        });

        // Update UI
        updateBulkDeleteButton();
        updateResultsCount(document.querySelectorAll(".course-row").length);
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Error deleting courses:", error);
      showNotification("Failed to delete courses. Please try again.", "error");
    }
  }

  // ===== MODAL FUNCTIONALITY =====
  const statusModal = document.getElementById("statusModal");
  const deleteModal = document.getElementById("deleteModal");
  let currentCourseId = null;

  // Status change modal
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("status-toggle") ||
      e.target.closest(".status-toggle")
    ) {
      const button = e.target.classList.contains("status-toggle")
        ? e.target
        : e.target.closest(".status-toggle");
      currentCourseId = button.getAttribute("data-course-id");
      const currentStatus = button.getAttribute("data-current-status");

      // Pre-select current status
      const radio = document.querySelector(
        `input[name="newStatus"][value="${currentStatus}"]`
      );
      if (radio) radio.checked = true;

      if (statusModal) statusModal.style.display = "flex";
    }

    // Delete course modal
    if (
      e.target.classList.contains("delete-course") ||
      e.target.closest(".delete-course")
    ) {
      const button = e.target.classList.contains("delete-course")
        ? e.target
        : e.target.closest(".delete-course");
      currentCourseId = button.getAttribute("data-course-id");

      if (deleteModal) deleteModal.style.display = "flex";
    }
  });

  // Modal close functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal")
    ) {
      if (statusModal) statusModal.style.display = "none";
      if (deleteModal) deleteModal.style.display = "none";
    }
  });

  // Status change confirmation
  const confirmStatusChange = document.getElementById("confirmStatusChange");
  if (confirmStatusChange) {
    confirmStatusChange.addEventListener("click", async function () {
      const newStatus = document.querySelector(
        'input[name="newStatus"]:checked'
      );
      if (!newStatus) {
        showNotification("Please select a status", "error");
        return;
      }

      try {
        const response = await fetch(
          `/courses/${currentCourseId}/toggle-status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newStatus: newStatus.value }),
          }
        );

        const result = await response.json();

        if (result.success) {
          showNotification(result.message, "success");
          // Update status badge in UI
          const row = document
            .querySelector(`[data-course-id="${currentCourseId}"]`)
            .closest(".course-row");
          if (row) {
            const statusBadge = row.querySelector(".status-badge");
            if (statusBadge) {
              statusBadge.className = `status-badge status-${result.status}`;
              statusBadge.textContent =
                result.status.charAt(0).toUpperCase() + result.status.slice(1);
            }
            row.setAttribute("data-status", result.status);
          }

          if (statusModal) statusModal.style.display = "none";
        } else {
          showNotification(result.message, "error");
        }
      } catch (error) {
        console.error("Error updating course status:", error);
        showNotification("Failed to update course status", "error");
      }
    });
  }

  // Cancel status change
  const cancelStatusChange = document.getElementById("cancelStatusChange");
  if (cancelStatusChange) {
    cancelStatusChange.addEventListener("click", function () {
      if (statusModal) statusModal.style.display = "none";
    });
  }

  // Delete confirmation
  const confirmDelete = document.getElementById("confirmDelete");
  if (confirmDelete) {
    confirmDelete.addEventListener("click", async function () {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/courses/${currentCourseId}/delete`;
      form.style.display = "none";
      document.body.appendChild(form);
      form.submit();
    });
  }

  // Cancel delete
  const cancelDelete = document.getElementById("cancelDelete");
  if (cancelDelete) {
    cancelDelete.addEventListener("click", function () {
      if (deleteModal) deleteModal.style.display = "none";
    });
  }

  // ===== DROPDOWN FUNCTIONALITY =====
  document.addEventListener("click", function (e) {
    // Close all dropdowns when clicking outside
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }

    // Toggle dropdown
    if (
      e.target.classList.contains("dropdown-toggle") ||
      e.target.closest(".dropdown-toggle")
    ) {
      const dropdown = e.target.closest(".dropdown");
      const menu = dropdown.querySelector(".dropdown-menu");

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((otherMenu) => {
        if (otherMenu !== menu) otherMenu.style.display = "none";
      });

      // Toggle current dropdown
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
  });

  // ===== NOTIFICATION SYSTEM =====
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

  // ===== PROGRESS BAR INITIALIZATION =====
  const progressFills = document.querySelectorAll(
    ".progress-fill[data-progress]"
  );
  progressFills.forEach((fill) => {
    const progress = fill.getAttribute("data-progress");
    fill.style.width = `${progress}%`;
  });

  // Initialize filters and preview on page load
  if (courseForm) {
    updatePreview();
  }

  if (courseRows.length > 0) {
    updateResultsCount(courseRows.length);
  }
});
