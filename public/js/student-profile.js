// Student Profile Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize page
  console.log("Student Profile page loaded");

  // Handle URL parameters for success/error messages
  handleUrlMessages();

  // Add hover effects to stat cards
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add smooth animations to progress bars
  const progressBars = document.querySelectorAll(".progress-fill");

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
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.style.width;
        progressBar.style.width = "0%";
        setTimeout(() => {
          progressBar.style.width = width;
        }, 100);
      }
    });
  }, observerOptions);

  progressBars.forEach((bar) => {
    progressObserver.observe(bar);
  });
});

// Action Button Handlers
function handleEditProfile() {
  // Show edit profile modal or redirect to edit page
  console.log("Edit Profile clicked");
  // You can implement modal or redirect logic here
  alert("Edit Profile functionality would be implemented here");
}

function handleDownloadReport() {
  // Generate and download student report
  console.log("Download Report clicked");
  // Implement report generation logic
  alert("Downloading student report...");
}

function handleViewTranscript() {
  // View or download academic transcript
  console.log("View Transcript clicked");
  alert("Viewing student transcript...");
}

function handleSendMessage() {
  // Open messaging interface
  console.log("Send Message clicked");
  alert("Opening message interface...");
}

function handleScheduleMeeting() {
  // Open meeting scheduling interface
  console.log("Schedule Meeting clicked");
  alert("Opening meeting scheduler...");
}

function handleUpdateStatus() {
  // Open status update interface
  console.log("Update Status clicked");
  alert("Opening status update interface...");
}

// Utility Functions
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function calculateDaysEnrolled(enrollmentDate) {
  const enrolled = new Date(enrollmentDate);
  const today = new Date();
  const timeDiff = today.getTime() - enrolled.getTime();
  return Math.floor(timeDiff / (1000 * 3600 * 24));
}

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add click ripple effect to action buttons
function addRippleEffect(button) {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// Add ripple effect to all action buttons
document.querySelectorAll(".action-btn").forEach(addRippleEffect);

// Add the CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== DELETE STUDENT HANDLER =====
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
      // Redirect to students list after successful deletion
      setTimeout(() => {
        window.location.href = "/students?success=Student deleted successfully";
      }, 1500);
    } else {
      showNotification(result.message, "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showNotification("Failed to delete student", "error");
  }
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

// Make function globally available
window.handleDeleteStudent = handleDeleteStudent;
