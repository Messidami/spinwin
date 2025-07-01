// Global state
let currentPage = 'home';
let currentTicket = '';
let userData = {};
let hasSpun = false;
let isSpinning = false;

// Valid ticket IDs
const validTicketIds = [
    'eLUCKY20224-001',
    'uLUCKY20243-002', 
    'LrCKY2024-003',
    'LaCKY2024-014',
    'LUCgj2024-005',
    'ticketidU4-006',
    'LUCutY2025-007',
    'LeiyKY2024-008',
    'LyouY924-009',
    'Lgkj20454-010'
];

// Prize data
const prizes = [

    { name: '$250k', emoji: '💵' },
    { name: '$350k', emoji: '💵' },
    { name: '$700k', emoji: '💵' },
    { name: '$1.5m', emoji: '💵' },
    { name: '$5m', emoji: '💵' },
    { name: '$500k', emoji: '💵' },
    { name: '$100k', emoji: '💵' },
    { name: '1m', emoji: '💵' }
];

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(`${pageId}-page`).classList.add('active');
    currentPage = pageId;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Navigation Functions
function goToHome() {
    showPage('home');
}

function goToForm() {
    if (currentTicket) {
        document.getElementById('current-ticket').textContent = currentTicket;
        showPage('form');
    } else {
        showToast('Please enter a valid ticket ID first', 'error');
        showPage('home');
    }
}

function goToSpin() {
    if (userData.fullName && userData.email && userData.phoneNumber) {
        // Display user data
        document.getElementById('user-name').textContent = userData.fullName;
        document.getElementById('display-name').textContent = userData.fullName;
        document.getElementById('display-email').textContent = userData.email;
        document.getElementById('display-phone').textContent = userData.phoneNumber;
        document.getElementById('display-ticket').textContent = currentTicket;
        
        showPage('spin');
    } else {
        showToast('Please complete the registration form first', 'error');
        goToForm();
    }
}

// Ticket Validation
function validateTicket() {
    const ticketInput = document.getElementById('ticket-input');
    const ticketId = ticketInput.value.trim();
    
    if (!ticketId) {
        showToast('Please enter your Ticket ID', 'error');
        return;
    }

    if (validTicketIds.includes(ticketId)) {
        currentTicket = ticketId;
        showToast('Valid ticket! Redirecting to registration...');
        
        setTimeout(() => {
            goToForm();
        }, 1500);
    } else {
        showToast('Invalid Ticket ID. Please check your code and try again.', 'error');
    }
}

// Form Submission
function submitForm() {
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();
    
    // Validation
    if (!fullName) {
        showToast('Please enter your full name', 'error');
        return;
    }
    
    if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (!phoneNumber) {
        showToast('Please enter your phone number', 'error');
        return;
    }
    
    // Store user data
    userData = {
        fullName,
        email,
        phoneNumber
    };
    
    showToast('Registration successful! Redirecting to spin...');
    
    setTimeout(() => {
        goToSpin();
    }, 1500);
}

// Spin Wheel Logic
function spinWheel() {
    if (isSpinning || hasSpun) return;
    
    isSpinning = true;
    hasSpun = true;
    
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resetBtn = document.getElementById('reset-btn');
    const instructionsCard = document.getElementById('instructions-card');
    
    // Update button
    spinBtn.innerHTML = '🔄 Spinning...';
    spinBtn.disabled = true;
    
    // Random rotation between 1440 and 2880 degrees (4-8 full rotations)
    const randomRotation = Math.floor(Math.random() * 1440) + 1440;
    const currentRotation = parseInt(wheel.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
    const finalRotation = currentRotation + randomRotation;
    
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // Determine prize based on final position
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[prizeIndex];
    
    setTimeout(() => {
        isSpinning = false;
        
        // Show prize
        document.getElementById('prize-name').textContent = selectedPrize.name;
        document.getElementById('prize-card').style.display = 'block';
        
        // Hide instructions
        instructionsCard.style.display = 'none';
        
        // Update buttons
        spinBtn.style.display = 'none';
        resetBtn.style.display = 'block';
        
        showToast(`🎉 Congratulations! You won ${selectedPrize.name}!`);
    }, 4000);
}

function resetSpin() {
    hasSpun = false;
    isSpinning = false;
    
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const resetBtn = document.getElementById('reset-btn');
    const prizeCard = document.getElementById('prize-card');
    const instructionsCard = document.getElementById('instructions-card');
    
    // Reset wheel rotation
    wheel.style.transform = 'rotate(0deg)';
    
    // Reset buttons
    spinBtn.innerHTML = '🏆 SPIN NOW!';
    spinBtn.disabled = false;
    spinBtn.style.display = 'block';
    resetBtn.style.display = 'none';
    
    // Hide prize card and show instructions
    prizeCard.style.display = 'none';
    instructionsCard.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Enter key support for ticket input
    document.getElementById('ticket-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateTicket();
        }
    });
    
    // Enter key support for form inputs
    document.querySelectorAll('#form-page input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitForm();
            }
        });
    });
});

// Initialize app
showPage('home');
