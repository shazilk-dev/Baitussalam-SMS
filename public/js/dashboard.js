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

function initializeAttendanceChart() {
    const canvas = document.getElementById('attendanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sample data for the chart
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Attendance %',
            data: [85, 92, 88, 94, 87, 90, 89],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 4,
        }]
    };
    
    // Simple bar chart implementation
    drawBarChart(ctx, data, canvas.width, canvas.height);
}

function drawBarChart(ctx, data, width, height) {
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    const barWidth = chartWidth / data.labels.length;
    const maxValue = Math.max(...data.datasets[0].data);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set font
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    
    // Draw bars
    data.labels.forEach((label, index) => {
        const value = data.datasets[0].data[index];
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + (index * barWidth) + (barWidth * 0.1);
        const y = height - padding - barHeight;
        const actualBarWidth = barWidth * 0.8;
        
        // Draw bar
        ctx.fillStyle = data.datasets[0].backgroundColor;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + (actualBarWidth / 2), height - padding + 20);
        
        // Draw value
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(value + '%', x + (actualBarWidth / 2), y - 5);
        ctx.font = '12px Inter, sans-serif';
    });
}

function addEventListeners() {
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleQuickAction);
    });
    
    // Chart filter
    const chartFilter = document.querySelector('.chart-filter');
    if (chartFilter) {
        chartFilter.addEventListener('change', handleChartFilter);
    }
    
    // Mobile sidebar toggle (for responsive design)
    addMobileSidebarToggle();
    
    // Notification interactions
    addNotificationInteractions();
}

function handleQuickAction(event) {
    const buttonText = event.currentTarget.querySelector('span:last-child').textContent;
    
    switch(buttonText) {
        case 'Add Student':
            // Navigate to add student page or show modal
            window.location.href = '/students/add';
            break;
        case 'View Attendance':
            // Navigate to attendance page
            window.location.href = '/attendance';
            break;
        case 'Manage Courses':
            // Navigate to courses page
            window.location.href = '/courses';
            break;
        case 'Fee Management':
            // Navigate to fee management page
            window.location.href = '/fees';
            break;
        case 'Generate Reports':
            // Navigate to reports page
            window.location.href = '/reports';
            break;
        case 'Settings':
            // Navigate to settings page
            window.location.href = '/settings';
            break;
        default:
            console.log('Quick action clicked:', buttonText);
    }
}

function handleChartFilter(event) {
    const selectedPeriod = event.target.value;
    
    // Update chart data based on selected period
    let newData;
    switch(selectedPeriod) {
        case 'This Week':
            newData = [85, 92, 88, 94, 87, 90, 89];
            break;
        case 'Last Week':
            newData = [82, 88, 91, 89, 93, 87, 85];
            break;
        case 'This Month':
            newData = [88, 91, 87, 92, 89, 94, 90, 86, 93, 88, 91, 89, 87, 92, 90];
            break;
        default:
            newData = [85, 92, 88, 94, 87, 90, 89];
    }
    
    // Redraw chart with new data
    const canvas = document.getElementById('attendanceChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const data = {
            labels: selectedPeriod === 'This Month' ? 
                Array.from({length: 15}, (_, i) => `Day ${i + 1}`) :
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Attendance %',
                data: newData,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 4,
            }]
        };
        drawBarChart(ctx, data, canvas.width, canvas.height);
    }
}

function addMobileSidebarToggle() {
    // Create mobile menu button if screen is small
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
        
        // Close sidebar when clicking outside
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
    // Add hover effects to cards
    const cards = document.querySelectorAll('.summary-card, .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
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

// Add CSS for ripple animation
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
