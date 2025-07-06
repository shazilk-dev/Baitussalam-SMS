// Student Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    console.log('Student Profile page loaded');
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add smooth animations to progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
});

// Action Button Handlers
function handleEditProfile() {
    // Show edit profile modal or redirect to edit page
    console.log('Edit Profile clicked');
    // You can implement modal or redirect logic here
    alert('Edit Profile functionality would be implemented here');
}

function handleDownloadReport() {
    // Generate and download student report
    console.log('Download Report clicked');
    // Implement report generation logic
    alert('Downloading student report...');
}

function handleViewTranscript() {
    // View or download academic transcript
    console.log('View Transcript clicked');
    alert('Viewing student transcript...');
}

function handleSendMessage() {
    // Open messaging interface
    console.log('Send Message clicked');
    alert('Opening message interface...');
}

function handleScheduleMeeting() {
    // Open meeting scheduling interface
    console.log('Schedule Meeting clicked');
    alert('Opening meeting scheduler...');
}

function handleUpdateStatus() {
    // Open status update interface
    console.log('Update Status clicked');
    alert('Opening status update interface...');
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateDaysEnrolled(enrollmentDate) {
    const enrolled = new Date(enrollmentDate);
    const today = new Date();
    const timeDiff = today.getTime() - enrolled.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add click ripple effect to action buttons
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
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
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to all action buttons
document.querySelectorAll('.action-btn').forEach(addRippleEffect);

// Add the CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
