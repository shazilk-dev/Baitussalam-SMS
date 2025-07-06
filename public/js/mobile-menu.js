// ===== SHARED MOBILE MENU FUNCTIONALITY =====
// This file contains mobile menu functionality that can be used across all dashboard pages

/**
 * Initializes the mobile menu functionality
 * Should be called on every dashboard page
 */
function initializeMobileMenu() {
    console.log('Initializing mobile menu...');
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebar = document.querySelector('.sidebar');
    
    console.log('Mobile menu elements found:', {
        toggle: !!mobileMenuToggle,
        overlay: !!mobileOverlay,
        sidebar: !!sidebar
    });
    
    if (!mobileMenuToggle || !mobileOverlay || !sidebar) {
        console.warn('Mobile menu elements not found');
        console.log('Missing elements:', {
            toggle: !mobileMenuToggle ? 'mobileMenuToggle' : null,
            overlay: !mobileOverlay ? 'mobileOverlay' : null,
            sidebar: !sidebar ? 'sidebar' : null
        });
        return;
    }
    
    // Toggle mobile menu
    function toggleMobileMenu(event) {
        console.log('Toggle mobile menu called');
        event.preventDefault();
        event.stopPropagation();
        
        const isOpen = sidebar.classList.contains('mobile-open');
        console.log('Current state - isOpen:', isOpen);
        
        if (isOpen) {
            console.log('Closing mobile menu');
            closeMobileMenu();
        } else {
            console.log('Opening mobile menu');
            openMobileMenu();
        }
    }
    
    // Handle overlay click to close menu
    function handleOverlayClick(event) {
        event.preventDefault();
        event.stopPropagation();
        closeMobileMenu();
    }
    
    // Open mobile menu
    function openMobileMenu() {
        console.log('Opening mobile menu - adding classes');
        sidebar.classList.add('mobile-open');
        mobileOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add accessibility attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        const firstNavLink = sidebar.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 300);
        }
        
        console.log('Mobile menu opened successfully');
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        console.log('Closing mobile menu - removing classes');
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Update accessibility attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
        
        // Return focus to toggle button
        mobileMenuToggle.focus();
        
        console.log('Mobile menu closed successfully');
    }
    
    // Event listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', handleOverlayClick);
    
    // Add specific touch event listeners for mobile
    mobileMenuToggle.addEventListener('touchstart', (e) => {
        // Prevent default to avoid click delay on mobile
        e.preventDefault();
    }, { passive: false });
    
    mobileMenuToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Trigger the toggle on touchend for better mobile response
        toggleMobileMenu(e);
    }, { passive: false });
    
    // Also handle overlay touch events
    mobileOverlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOverlayClick(e);
    }, { passive: false });
    
    // Close menu when clicking on navigation links (for better UX)
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't stop propagation here, let the navigation work
            // Just close the menu after a short delay
            setTimeout(closeMobileMenu, 150);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu if window is resized to desktop size
            if (window.innerWidth > 768 && sidebar.classList.contains('mobile-open')) {
                closeMobileMenu();
            }
        }, 100);
    });
    
    // Prevent clicks inside sidebar from closing menu
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Prevent touch events inside sidebar from closing menu
    sidebar.addEventListener('touchend', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    // Handle touch events for better mobile experience
    let touchStartY = 0;
    let touchEndY = 0;
    
    sidebar.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    sidebar.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const yDiff = touchStartY - touchEndY;
        
        // If user swipes up or down significantly while menu is open, don't close
        if (Math.abs(yDiff) > swipeThreshold) {
            return;
        }
    }
    
    // Initialize accessibility attributes
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'sidebar');
    sidebar.setAttribute('aria-hidden', 'true');
    sidebar.setAttribute('id', 'sidebar');
    
    console.log('Mobile menu initialized successfully');
}

// Auto-initialize when DOM is loaded if not already initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure all elements are rendered
        setTimeout(initializeMobileMenu, 100);
    });
} else {
    // Document is already loaded
    setTimeout(initializeMobileMenu, 100);
}
