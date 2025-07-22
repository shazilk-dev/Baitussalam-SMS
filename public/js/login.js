// Login Page JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const passwordToggle = document.querySelector(".password-toggle");
  const passwordInput = document.querySelector("#password");

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      const icon = passwordToggle.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  }

  // Form validation
  const loginForm = document.querySelector(".login-form");
  const emailInput = document.querySelector("#email");
  const submitBtn = document.querySelector(".sign-in-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      // Debug logging for mobile
      console.log("Form submission attempt:", {
        email: emailInput.value
          ? emailInput.value.substring(0, 3) + "***"
          : "empty",
        password: passwordInput.value ? "***" : "empty",
        emailLength: emailInput.value ? emailInput.value.length : 0,
        passwordLength: passwordInput.value ? passwordInput.value.length : 0,
        isMobile:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ),
        screenWidth: window.innerWidth,
      });

      // Basic validation
      if (!emailInput.value || !passwordInput.value) {
        e.preventDefault();
        console.log("Validation failed: missing fields");
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(emailInput.value)) {
        e.preventDefault();
        console.log("Validation failed: invalid email");
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Trim whitespace from inputs for mobile compatibility
      emailInput.value = emailInput.value.trim();
      passwordInput.value = passwordInput.value.trim();

      // For mobile devices, skip the loading animation and submit directly
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;

      if (isMobile) {
        console.log("Mobile detected - direct form submission");
        // On mobile, let the form submit naturally without preventDefault
        return;
      }

      // Only prevent default and show loading on desktop
      e.preventDefault();

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Signing in...';

      // Submit form after short delay for better UX
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Sign In";

        // Actually submit the form
        loginForm.submit();
      }, 800);
    });
  }

  // Social login handlers
  const socialBtns = document.querySelectorAll(".social-btn");
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const provider = this.classList.contains("google")
        ? "Google"
        : this.classList.contains("github")
        ? "GitHub"
        : "Facebook";
      showNotification(`${provider} login coming soon!`, "info");
    });
  });

  // Input focus effects
  const inputs = document.querySelectorAll(".input-wrapper input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });

    // Add typing animation effect
    input.addEventListener("input", function () {
      if (this.value.length > 0) {
        this.parentElement.classList.add("has-value");
      } else {
        this.parentElement.classList.remove("has-value");
      }
    });
  });

  // Animate elements on load
  animateOnLoad();

  // Handle form errors if they exist
  handleFormErrors();

  // Add new responsive enhancements
  handleResponsiveLayout();
  enhanceKeyboardNavigation();
  enhanceTouchHandling();
});

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInNotification 0.3s ease-out;
        max-width: 400px;
    `;

  document.body.appendChild(notification);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutNotification 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutNotification 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}

function getNotificationColor(type) {
  switch (type) {
    case "success":
      return "#10B981";
    case "error":
      return "#EF4444";
    case "warning":
      return "#F59E0B";
    default:
      return "#3B82F6";
  }
}

// Animation on load
function animateOnLoad() {
  const leftSection = document.querySelector(".login-left");
  const rightSection = document.querySelector(".login-right");

  if (leftSection) {
    leftSection.style.opacity = "0";
    leftSection.style.transform = "translateX(-50px)";
    setTimeout(() => {
      leftSection.style.transition = "all 0.8s ease-out";
      leftSection.style.opacity = "1";
      leftSection.style.transform = "translateX(0)";
    }, 100);
  }

  if (rightSection) {
    rightSection.style.opacity = "0";
    rightSection.style.transform = "translateX(50px)";
    setTimeout(() => {
      rightSection.style.transition = "all 0.8s ease-out";
      rightSection.style.opacity = "1";
      rightSection.style.transform = "translateX(0)";
    }, 200);
  }
}

// Handle form errors from server
function handleFormErrors() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");

  if (error) {
    let message = "An error occurred";
    switch (error) {
      case "invalid_credentials":
        message = "Invalid email or password";
        break;
      case "user_not_found":
        message = "User not found";
        break;
      case "account_disabled":
        message = "Account is disabled";
        break;
      default:
        message = "Login failed. Please try again.";
    }
    showNotification(message, "error");
  }

  const success = urlParams.get("success");
  if (success === "password_reset") {
    showNotification("Password reset email sent successfully", "success");
  }
}

// Enhanced responsive handling
function handleResponsiveLayout() {
  const loginContainer = document.querySelector(".login-container");
  const loginRight = document.querySelector(".login-right");

  function checkScreenSize() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Add mobile class for additional styling if needed
      document.body.classList.add("mobile-view");
      document.body.classList.remove("desktop-view");
    } else {
      document.body.classList.add("desktop-view");
      document.body.classList.remove("mobile-view");
    }
  }

  // Check on load
  checkScreenSize();

  // Check on resize
  window.addEventListener("resize", debounce(checkScreenSize, 250));
}

// Debounce function for performance
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

// Enhanced keyboard navigation
function enhanceKeyboardNavigation() {
  const formElements = document.querySelectorAll("input, button, a");

  formElements.forEach((element, index) => {
    element.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        // Let default behavior handle tab navigation
        return;
      }

      if (e.key === "Enter" && this.tagName === "INPUT") {
        e.preventDefault();
        const nextElement = formElements[index + 1];
        if (nextElement) {
          nextElement.focus();
        } else {
          // If it's the last input, submit the form
          const submitBtn = document.querySelector(".sign-in-btn");
          if (submitBtn) {
            submitBtn.click();
          }
        }
      }
    });
  });
}

// Touch handling for mobile devices
function enhanceTouchHandling() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.body.classList.add("touch-device");

    // Add touch feedback to buttons
    const buttons = document.querySelectorAll(".sign-in-btn, .social-btn");
    buttons.forEach((button) => {
      button.addEventListener("touchstart", function () {
        this.style.transform = "scale(0.98)";
      });

      button.addEventListener("touchend", function () {
        this.style.transform = "";
      });
    });
  }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        border-radius: 4px;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
    
    .input-wrapper.focused {
        transform: translateY(-1px);
    }
    
    .input-wrapper.has-value i {
        color: #4F46E5;
    }
`;

document.head.appendChild(notificationStyles);
