// Course Profile JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // ===== MODAL FUNCTIONALITY =====
  const deleteModal = document.getElementById("deleteModal");
  let currentCourseId = null;

  // Delete course functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("delete-course") ||
      e.target.closest(".delete-course")
    ) {
      const button = e.target.classList.contains("delete-course")
        ? e.target
        : e.target.closest(".delete-course");
      currentCourseId = button.getAttribute("data-course-id");

      if (deleteModal) {
        deleteModal.style.display = "flex";
      }
    }
  });

  // Modal close functionality
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal") ||
      e.target.id === "cancelDelete"
    ) {
      if (deleteModal) {
        deleteModal.style.display = "none";
      }
    }
  });

  // Delete confirmation
  const confirmDelete = document.getElementById("confirmDelete");
  if (confirmDelete) {
    confirmDelete.addEventListener("click", function () {
      if (currentCourseId) {
        // Create form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `/courses/${currentCourseId}/delete`;
        form.style.display = "none";
        document.body.appendChild(form);
        form.submit();
      }
    });
  }

  // ===== PROGRESS BAR ANIMATION =====
  const progressFills = document.querySelectorAll(
    ".progress-fill[data-progress]"
  );
  progressFills.forEach((fill, index) => {
    const progress = parseInt(fill.getAttribute("data-progress"));

    // Animate progress bar on page load
    setTimeout(() => {
      fill.style.width = `${progress}%`;
      fill.style.transition = "width 1s ease-in-out";
    }, 200 + index * 100);
  });

  // ===== QUICK ACTIONS =====
  const quickActionButtons = document.querySelectorAll(".action-btn");

  quickActionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.classList[1]; // Get second class (attendance-action, reports-action, etc.)

      switch (action) {
        case "attendance-action":
          handleAttendanceAction();
          break;
        case "reports-action":
          handleReportsAction();
          break;
        case "schedule-action":
          handleScheduleAction();
          break;
        case "communication-action":
          handleCommunicationAction();
          break;
        default:
          showNotification("This feature will be available soon!", "info");
      }
    });
  });

  function handleAttendanceAction() {
    // Get current course ID from URL
    const courseId = window.location.pathname.split("/")[2];

    // For now, show notification. Later can redirect to attendance page
    showNotification("Attendance tracking feature coming soon!", "info");

    // Future implementation:
    // window.location.href = `/attendance/course/${courseId}`;
  }

  function handleReportsAction() {
    const courseId = window.location.pathname.split("/")[2];
    showNotification("Course reports feature coming soon!", "info");

    // Future implementation:
    // window.location.href = `/reports/course/${courseId}`;
  }

  function handleScheduleAction() {
    const courseId = window.location.pathname.split("/")[2];
    showNotification("Course schedule management coming soon!", "info");

    // Future implementation:
    // window.location.href = `/schedule/course/${courseId}`;
  }

  function handleCommunicationAction() {
    showNotification("Student communication feature coming soon!", "info");

    // Future implementation: Open communication modal or redirect
  }

  // ===== ENROLLMENT MANAGEMENT =====
  const manageEnrollmentsBtn = document.getElementById("manageEnrollments");
  const addStudentsBtn = document.getElementById("addStudentsBtn");

  if (manageEnrollmentsBtn) {
    manageEnrollmentsBtn.addEventListener("click", function () {
      showNotification("Student enrollment management coming soon!", "info");

      // Future implementation:
      // openEnrollmentModal();
    });
  }

  if (addStudentsBtn) {
    addStudentsBtn.addEventListener("click", function () {
      showNotification("Add students to course feature coming soon!", "info");

      // Future implementation:
      // openAddStudentsModal();
    });
  }

  // ===== STUDENT CARDS INTERACTION =====
  const studentCards = document.querySelectorAll(".student-card");

  studentCards.forEach((card) => {
    // Add hover effect
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "";
    });

    // Make entire card clickable (excluding action buttons)
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".student-actions")) {
        const studentLink = this.querySelector(".student-name a");
        if (studentLink) {
          window.location.href = studentLink.href;
        }
      }
    });
  });

  // ===== OVERVIEW CARDS ANIMATION =====
  const overviewCards = document.querySelectorAll(".overview-card");

  // Animate stats on page load
  overviewCards.forEach((card, index) => {
    const statNumber = card.querySelector(".stat-number");
    if (statNumber) {
      const finalValue = parseInt(statNumber.textContent.replace(/[^\d]/g, ""));
      if (!isNaN(finalValue)) {
        animateValue(statNumber, 0, finalValue, 1000 + index * 200);
      }
    }
  });

  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);

      // Preserve any non-numeric characters (like %)
      const originalText = element.textContent;
      const suffix = originalText.replace(/[\d]/g, "");
      element.textContent = currentValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ===== RESPONSIVE ACTIONS =====
  function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    const actionsPanel = document.querySelector(".quick-actions-panel");

    if (actionsPanel) {
      if (isMobile) {
        actionsPanel.classList.add("mobile-layout");
      } else {
        actionsPanel.classList.remove("mobile-layout");
      }
    }
  }

  // Listen for window resize
  window.addEventListener("resize", handleResponsiveLayout);
  handleResponsiveLayout(); // Initial call

  // ===== STATUS BADGE INTERACTION =====
  const statusBadges = document.querySelectorAll(".status-badge");

  statusBadges.forEach((badge) => {
    // Add tooltip showing status meaning
    const status = badge.textContent.toLowerCase().trim();
    let tooltip = "";

    switch (status) {
      case "active":
        tooltip = "Course is currently running";
        break;
      case "upcoming":
        tooltip = "Course hasn't started yet";
        break;
      case "completed":
        tooltip = "Course has finished";
        break;
    }

    if (tooltip) {
      badge.setAttribute("title", tooltip);
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

    // Choose appropriate icon
    let icon = "";
    switch (type) {
      case "success":
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>
               </svg>`;
        break;
      case "error":
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/>
               </svg>`;
        break;
      case "warning":
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                 <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
               </svg>`;
        break;
      default: // info
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
               </svg>`;
    }

    notification.innerHTML = `
      <div class="notification-content">
        ${icon}
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
    // Escape to close modals
    if (e.key === "Escape") {
      if (deleteModal && deleteModal.style.display === "flex") {
        deleteModal.style.display = "none";
      }
    }

    // E to edit course
    if (
      e.key === "e" &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.target.matches("input, textarea")
    ) {
      const editLink = document.querySelector('a[href*="/edit"]');
      if (editLink) {
        window.location.href = editLink.href;
      }
    }
  });

  // ===== DATA REFRESH =====
  let refreshInterval;

  function startDataRefresh() {
    // Refresh course data every 30 seconds (for real-time updates)
    refreshInterval = setInterval(() => {
      refreshCourseStats();
    }, 30000);
  }

  function stopDataRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  }

  async function refreshCourseStats() {
    try {
      const courseId = window.location.pathname.split("/")[2];
      const response = await fetch(`/api/courses/${courseId}/stats`);

      if (response.ok) {
        const data = await response.json();
        updateStatsDisplay(data);
      }
    } catch (error) {
      console.log("Stats refresh failed:", error);
      // Fail silently - not critical functionality
    }
  }

  function updateStatsDisplay(data) {
    // Update enrollment count
    const enrollmentStat = document.querySelector(
      ".enrollment-card .stat-number"
    );
    if (enrollmentStat && data.enrollmentCount !== undefined) {
      animateValue(
        enrollmentStat,
        parseInt(enrollmentStat.textContent),
        data.enrollmentCount,
        500
      );
    }

    // Update attendance percentage
    const attendanceStat = document.querySelector(
      ".attendance-card .stat-number"
    );
    if (attendanceStat && data.averageAttendance !== undefined) {
      const currentValue = parseInt(
        attendanceStat.textContent.replace("%", "")
      );
      animateValue(attendanceStat, currentValue, data.averageAttendance, 500);
    }
  }

  // Start background refresh if page is visible
  if (document.visibilityState === "visible") {
    startDataRefresh();
  }

  // Handle page visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      startDataRefresh();
    } else {
      stopDataRefresh();
    }
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    stopDataRefresh();
  });

  // ===== INITIAL SETUP =====
  console.log("Course profile page loaded successfully");

  // Add custom styles for interactions
  const style = document.createElement("style");
  style.textContent = `
    .student-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    
    .quick-actions-panel.mobile-layout .actions-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      z-index: 1000;
      max-width: 400px;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification-message {
      flex: 1;
      font-size: 14px;
      color: var(--text-primary);
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--text-tertiary);
      padding: 0;
      line-height: 1;
    }
    
    .notification-close:hover {
      color: var(--text-primary);
    }
    
    .notification-success { border-left: 4px solid var(--success-500); }
    .notification-error { border-left: 4px solid var(--error-500); }
    .notification-warning { border-left: 4px solid var(--warning-500); }
    .notification-info { border-left: 4px solid var(--primary-500); }
    
    .status-badge {
      cursor: help;
    }
  `;
  document.head.appendChild(style);
});
