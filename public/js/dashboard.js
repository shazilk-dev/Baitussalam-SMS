// Dashboard JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Set current date
    setCurrentDate();
    
    // Initialize chart
    initializeAttendanceChart();
    
    // Add event listeners
    addEventListeners();
});

function initializeDashboard() {
    // Add dashboard-page class to body for styling
    document.body.classList.add('dashboard-page');
    
    // Animate summary cards on load
    animateSummaryCards();
    
    // Initialize tooltips or other interactive elements
    initializeInteractiveElements();
}

function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function animateSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}


function addEventListeners() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleQuickAction);
    });
    
   
    addMobileSidebarToggle();
    
    addNotificationInteractions();
}

function handleQuickAction(event) {
    const buttonText = event.currentTarget.querySelector('span:last-child').textContent;
    
    switch(buttonText) {
        case 'Add Student':
            window.location.href = '/students/add';
            break;
        case 'View Attendance':
            window.location.href = '/attendance';
            break;
        case 'Manage Courses':
            window.location.href = '/courses';
            break;
        case 'Fee Management':
            window.location.href = '/fees';
            break;
        case 'Generate Reports':
            window.location.href = '/reports';
            break;
        case 'Settings':
            window.location.href = '/settings';
            break;
        default:
            console.log('Quick action clicked:', buttonText);
    }
}


function addMobileSidebarToggle() {
    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            font-size: 1.25rem;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(menuButton);
        
        menuButton.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('mobile-open');
        });
        
        document.addEventListener('click', (event) => {
            const sidebar = document.querySelector('.sidebar');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }
}

function addNotificationInteractions() {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        notification.addEventListener('click', () => {
            notification.style.opacity = '0.7';
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 200);
        });
    });
}

function initializeInteractiveElements() {
    const cards = document.querySelectorAll('.summary-card, .card');
    cards.forEach(card => {
        // card.addEventListener('mouseenter', () => {
        //     card.style.transform = 'translateY(-1px)';
        // });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
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
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .mobile-menu-btn {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block !important;
        }
        
        .main-content {
            padding-top: 4rem;
        }
    }
`;
document.head.appendChild(style);

// Auto-refresh data every 5 minutes
setInterval(() => {
    // In a real application, you would fetch new data from the server
    console.log('Auto-refreshing dashboard data...');
    // refreshDashboardData();
}, 300000); // 5 minutes

// Update time every minute
setInterval(() => {
    setCurrentDate();
}, 60000); // 1 minute
