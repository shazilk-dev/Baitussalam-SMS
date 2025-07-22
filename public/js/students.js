// ===== STUDENTS PAGE FUNCTIONALITY =====

document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const searchInput = document.getElementById("searchInput");
  const courseFilter = document.getElementById("courseFilter");
  const statusFilter = document.getElementById("statusFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const studentsTable = document.getElementById("studentsTable");
  const studentsTableBody = document.getElementById("studentsTableBody");
  const noResults = document.getElementById("noResults");
  const showingCount = document.getElementById("showingCount");
  const totalCount = document.getElementById("totalCount");
  const totalStudentsCounter = document.getElementById("totalStudents");
  const activeStudentsCounter = document.getElementById("activeStudents");

  // Bulk operations elements
  const selectAllCheckbox = document.getElementById("selectAll");
  const bulkOperations = document.getElementById("bulkOperations");
  const selectedCount = document.getElementById("selectedCount");
  const bulkActivateBtn = document.getElementById("bulkActivateBtn");
  const bulkDeactivateBtn = document.getElementById("bulkDeactivateBtn");
  const bulkDeleteBtn = document.getElementById("bulkDeleteBtn");

  // Get all student rows
  const studentRows = Array.from(
    studentsTableBody.querySelectorAll(".student-row")
  );
  const originalStudentCount = studentRows.length;
  const originalActiveCount = studentRows.filter(
    (row) => row.getAttribute("data-status") === "active"
  ).length;

  // Initialize page
  initializePage();

  function initializePage() {
    // Handle URL parameters for success/error messages
    handleUrlMessages();

    // Initialize bulk operations if admin
    if (selectAllCheckbox) {
      initializeBulkOperations();
    }

    // Initialize delete buttons
    initializeDeleteButtons();
  }

  // Handle URL parameters
  function handleUrlMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const error = urlParams.get("error");

    if (success) {
      showNotification(success, "success");
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    if (error) {
      showNotification(error, "error");
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }

  // Initialize bulk operations
  function initializeBulkOperations() {
    // Select all checkbox
    selectAllCheckbox.addEventListener("change", function () {
      const studentCheckboxes = document.querySelectorAll(".student-checkbox");
      studentCheckboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
      });
      updateBulkOperations();
    });

    // Individual checkboxes
    document.addEventListener("change", function (e) {
      if (e.target.classList.contains("student-checkbox")) {
        updateBulkOperations();
        updateSelectAllState();
      }
    });

    // Bulk action buttons
    if (bulkActivateBtn) {
      bulkActivateBtn.addEventListener("click", () =>
        handleBulkStatusUpdate("active")
      );
    }
    if (bulkDeactivateBtn) {
      bulkDeactivateBtn.addEventListener("click", () =>
        handleBulkStatusUpdate("inactive")
      );
    }
    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener("click", handleBulkDelete);
    }
  }

  // Update bulk operations visibility and count
  function updateBulkOperations() {
    const selectedCheckboxes = document.querySelectorAll(
      ".student-checkbox:checked"
    );
    const count = selectedCheckboxes.length;

    if (selectedCount) {
      selectedCount.textContent = count;
    }

    if (bulkOperations) {
      bulkOperations.style.display = count > 0 ? "flex" : "none";
    }
  }

  // Update select all checkbox state
  function updateSelectAllState() {
    const studentCheckboxes = document.querySelectorAll(".student-checkbox");
    const checkedCheckboxes = document.querySelectorAll(
      ".student-checkbox:checked"
    );

    if (checkedCheckboxes.length === 0) {
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = false;
    } else if (checkedCheckboxes.length === studentCheckboxes.length) {
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = true;
    } else {
      selectAllCheckbox.indeterminate = true;
      selectAllCheckbox.checked = false;
    }
  }

  // Handle bulk status update
  async function handleBulkStatusUpdate(status) {
    const selectedCheckboxes = document.querySelectorAll(
      ".student-checkbox:checked"
    );
    const studentIds = Array.from(selectedCheckboxes).map((cb) => cb.value);

    if (studentIds.length === 0) {
      showNotification("No students selected", "error");
      return;
    }

    const statusText = status === "active" ? "activate" : "deactivate";
    if (
      !confirm(
        `Are you sure you want to ${statusText} ${studentIds.length} student(s)?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/students/bulk/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: studentIds,
          status: status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message, "success");
        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Bulk status update error:", error);
      showNotification("Failed to update student status", "error");
    }
  }

  // Handle bulk delete
  async function handleBulkDelete() {
    const selectedCheckboxes = document.querySelectorAll(
      ".student-checkbox:checked"
    );
    const studentIds = Array.from(selectedCheckboxes).map((cb) => cb.value);

    if (studentIds.length === 0) {
      showNotification("No students selected", "error");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${studentIds.length} student(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/students/bulk/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: studentIds,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message, "success");
        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      showNotification("Failed to delete students", "error");
    }
  }

  // Initialize delete buttons
  function initializeDeleteButtons() {
    document.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("delete-student-btn") ||
        e.target.closest(".delete-student-btn")
      ) {
        const btn = e.target.classList.contains("delete-student-btn")
          ? e.target
          : e.target.closest(".delete-student-btn");

        const studentId = btn.dataset.studentId;
        const studentName = btn.dataset.studentName;

        handleDeleteStudent(studentId, studentName);
      }
    });
  }

  // Handle individual delete
  async function handleDeleteStudent(studentId, studentName) {
    if (
      !confirm(
        `Are you sure you want to delete "${studentName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/students/${studentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message, "success");
        // Remove row from table
        const row = document.querySelector(`[data-student-id="${studentId}"]`);
        if (row) {
          row.remove();
        }
        // Update counters
        updateCountersAfterDelete();
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Failed to delete student", "error");
    }
  }

  // Update counters after delete
  function updateCountersAfterDelete() {
    const remainingRows = document.querySelectorAll(".student-row");
    const activeRows = Array.from(remainingRows).filter(
      (row) => row.getAttribute("data-status") === "active"
    );

    if (showingCount) showingCount.textContent = remainingRows.length;
    if (totalCount) totalCount.textContent = remainingRows.length;
    if (totalStudentsCounter)
      totalStudentsCounter.textContent = remainingRows.length;
    if (activeStudentsCounter)
      activeStudentsCounter.textContent = activeRows.length;
  }

  // Show notification
  function showNotification(message, type = "success") {
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
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // Debounce function for search
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Filter students function
  function filterStudents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCourse = courseFilter.value;
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;
    let activeCount = 0;

    studentRows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const email = row.getAttribute("data-email");
      const course = row.getAttribute("data-course");
      const status = row.getAttribute("data-status");

      // Check search criteria
      const matchesSearch =
        !searchTerm || name.includes(searchTerm) || email.includes(searchTerm);

      // Check filter criteria
      const matchesCourse = !selectedCourse || course === selectedCourse;
      const matchesStatus = !selectedStatus || status === selectedStatus;

      // Show/hide row based on all criteria
      const shouldShow = matchesSearch && matchesCourse && matchesStatus;

      if (shouldShow) {
        row.style.display = "";
        visibleCount++;
        if (status === "active") {
          activeCount++;
        }
      } else {
        row.style.display = "none";
      }
    });

    // Update counters
    updateCounters(visibleCount, activeCount);

    // Show/hide no results message
    if (visibleCount === 0) {
      studentsTable.style.display = "none";
      noResults.style.display = "block";
    } else {
      studentsTable.style.display = "table";
      noResults.style.display = "none";
    }
  }

  // Update counter displays
  function updateCounters(visible, active) {
    if (showingCount) showingCount.textContent = visible;
    if (totalStudentsCounter) totalStudentsCounter.textContent = visible;
    if (activeStudentsCounter) activeStudentsCounter.textContent = active;
  }

  // Clear all filters
  function clearAllFilters() {
    searchInput.value = "";
    courseFilter.value = "";
    statusFilter.value = "";
    filterStudents();
  }

  // Make clearAllFilters globally available
  window.clearAllFilters = clearAllFilters;

  // Sorting functionality
  let currentSort = { column: null, direction: "asc" };

  function sortTable(column) {
    const direction =
      currentSort.column === column && currentSort.direction === "asc"
        ? "desc"
        : "asc";
    currentSort = { column, direction };

    // Get visible rows only
    const visibleRows = studentRows.filter(
      (row) => row.style.display !== "none"
    );

    visibleRows.sort((a, b) => {
      let aValue, bValue;

      switch (column) {
        case "name":
          aValue = a.getAttribute("data-name");
          bValue = b.getAttribute("data-name");
          break;
        case "id":
          aValue = parseInt(
            a.querySelector(".student-id").textContent.replace("#", "")
          );
          bValue = parseInt(
            b.querySelector(".student-id").textContent.replace("#", "")
          );
          break;
        case "email":
          aValue = a.getAttribute("data-email");
          bValue = b.getAttribute("data-email");
          break;
        case "course":
          aValue = a.getAttribute("data-course");
          bValue = b.getAttribute("data-course");
          break;
        case "status":
          aValue = a.getAttribute("data-status");
          bValue = b.getAttribute("data-status");
          break;
        default:
          return 0;
      }

      // Handle numeric sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    // Clear tbody and re-append sorted rows
    studentsTableBody.innerHTML = "";

    // First append all hidden rows (to maintain original order for hidden items)
    studentRows.forEach((row) => {
      if (row.style.display === "none") {
        studentsTableBody.appendChild(row);
      }
    });

    // Then append visible sorted rows
    visibleRows.forEach((row) => {
      studentsTableBody.appendChild(row);
    });

    // Update sort icons
    updateSortIcons(column, direction);
  }

  function updateSortIcons(column, direction) {
    // Reset all sort icons
    document.querySelectorAll(".sort-icon").forEach((icon) => {
      icon.style.opacity = "0.4";
      icon.style.transform = "rotate(0deg)";
    });

    // Update active sort icon
    const activeHeader = document.querySelector(`[data-sort="${column}"]`);
    if (activeHeader) {
      const sortIcon = activeHeader.querySelector(".sort-icon");
      if (sortIcon) {
        sortIcon.style.opacity = "1";
        sortIcon.style.transform =
          direction === "desc" ? "rotate(180deg)" : "rotate(0deg)";
      }
    }
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterStudents, 300));
  }

  if (courseFilter) {
    courseFilter.addEventListener("change", filterStudents);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterStudents);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }

  // Add sorting event listeners to sortable headers
  document.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", () => {
      const column = header.getAttribute("data-sort");
      sortTable(column);
    });
  });

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Escape to clear search when focused
    if (e.key === "Escape" && document.activeElement === searchInput) {
      clearAllFilters();
      searchInput.blur();
    }
  });

  // Add smooth scroll to top when sorting
  function smoothScrollToTop() {
    const tableContainer = document.querySelector(".table-container");
    if (tableContainer) {
      tableContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // Enhanced sorting with scroll
  const originalSortTable = sortTable;
  sortTable = function (column) {
    originalSortTable(column);
    setTimeout(smoothScrollToTop, 100);
  };

  // Add loading state for better UX
  function showLoadingState() {
    studentsTableBody.style.opacity = "0.6";
    studentsTableBody.style.pointerEvents = "none";
  }

  function hideLoadingState() {
    studentsTableBody.style.opacity = "1";
    studentsTableBody.style.pointerEvents = "auto";
  }

  // Enhanced filter function with loading state
  const originalFilterStudents = filterStudents;
  filterStudents = function () {
    showLoadingState();
    setTimeout(() => {
      originalFilterStudents();
      hideLoadingState();
    }, 50);
  };

  // Add search input enhancements
  if (searchInput) {
    // Add search keyboard navigation
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        // Focus first visible student row's view button
        const firstVisibleRow = studentsTableBody.querySelector(
          '.student-row:not([style*="display: none"])'
        );
        if (firstVisibleRow) {
          const viewButton = firstVisibleRow.querySelector(".btn");
          if (viewButton) {
            viewButton.focus();
          }
        }
      }
    });

    // Add placeholder animation
    const originalPlaceholder = searchInput.placeholder;
    const placeholders = [
      "Search by student name...",
      "Search by email address...",
      "Type to find students...",
      originalPlaceholder,
    ];

    let placeholderIndex = 0;
    setInterval(() => {
      if (document.activeElement !== searchInput && !searchInput.value) {
        searchInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
      }
    }, 3000);
  }

  // Initialize with all data visible
  updateCounters(originalStudentCount, originalActiveCount);

  console.log("Students page initialized successfully");
});
