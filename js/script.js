// Sample course data
const courses = [
    { id: 1, title: "Introduction to JavaScript", description: "Learn the basics of JavaScript programming", price: 99, duration: "4 weeks" },
    { id: 2, title: "Advanced CSS Techniques", description: "Master modern CSS layouts and animations", price: 129, duration: "6 weeks" },
    { id: 3, title: "React Fundamentals", description: "Build web applications with React", price: 149, duration: "8 weeks" },
    { id: 4, title: "Node.js Backend Development", description: "Create server-side applications with Node.js", price: 159, duration: "8 weeks" },
    { id: 5, title: "Database Design", description: "Learn relational database concepts and SQL", price: 119, duration: "5 weeks" },
    { id: 6, title: "Web Security Basics", description: "Understand common web vulnerabilities and defenses", price: 139, duration: "6 weeks" }
];

// User state
let currentUser = null;
let selectedCourses = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    const path = window.location.pathname.split('/').pop() || 'index.html';
    
    if (path === 'courses.html') {
        initCoursesPage();
    } else if (path === 'payment.html') {
        initPaymentPage();
    } else if (path === 'dashboard.html') {
        initDashboardPage();
    } else if (path === 'login.html') {
        initLoginPage();
    } else if (path === 'registration.html') {
        initRegistrationPage();
    }
    
    // Initialize logout link if it exists
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    // Check if user is logged in
    checkAuth();
});

// Check authentication status
function checkAuth() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        
        // If on auth pages, redirect to dashboard
        const path = window.location.pathname.split('/').pop() || 'index.html';
        if (path === 'login.html' || path === 'registration.html') {
            window.location.href = 'dashboard.html';
        }
    } else {
        // If on protected pages, redirect to login
        const path = window.location.pathname.split('/').pop() || 'index.html';
        if (path === 'courses.html' || path === 'payment.html' || path === 'dashboard.html') {
            window.location.href = 'login.html';
        }
    }
}

// Initialize Courses Page
function initCoursesPage() {
    displayCourses();
    loadSelectedCourses();
    
    // Load selected courses from localStorage if available
    const savedCourses = localStorage.getItem('selectedCourses');
    if (savedCourses) {
        selectedCourses = JSON.parse(savedCourses);
        updateSelectedCoursesUI();
    }
    
    // Proceed to payment button
    const proceedBtn = document.getElementById('proceedToPayment');
    proceedBtn.addEventListener('click', function() {
        if (selectedCourses.length > 0) {
            localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
            window.location.href = 'payment.html';
        }
    });
}

// Display available courses
function displayCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    
    courses.forEach(course => {
        const isSelected = selectedCourses.some(c => c.id === course.id);
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p class="price"><strong>Price:</strong> $${course.price}</p>
            <button class="btn ${isSelected ? 'selected' : ''}" data-id="${course.id}">
                ${isSelected ? 'Remove' : 'Add to Cart'}
            </button>
        `;
        
        courseList.appendChild(courseCard);
    });
    
    // Add event listeners to all course buttons
    document.querySelectorAll('.course-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = parseInt(this.getAttribute('data-id'));
            toggleCourseSelection(courseId);
        });
    });
}

// Toggle course selection
function toggleCourseSelection(courseId) {
    const course = courses.find(c => c.id === courseId);
    
    const index = selectedCourses.findIndex(c => c.id === courseId);
    if (index === -1) {
        selectedCourses.push(course);
    } else {
        selectedCourses.splice(index, 1);
    }
    
    updateSelectedCoursesUI();
    displayCourses();
}

// Update selected courses UI
function updateSelectedCoursesUI() {
    const selectedCoursesList = document.getElementById('selectedCourses');
    const totalAmountElement = document.getElementById('totalAmount');
    const proceedBtn = document.getElementById('proceedToPayment');
    
    selectedCoursesList.innerHTML = '';
    let total = 0;
    
    selectedCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.title} - $${course.price}`;
        selectedCoursesList.appendChild(li);
        total += course.price;
    });
    
    totalAmountElement.textContent = total;
    proceedBtn.disabled = selectedCourses.length === 0;
}

// Load selected courses
function loadSelectedCourses() {
    const savedCourses = localStorage.getItem('selectedCourses');
    if (savedCourses) {
        selectedCourses = JSON.parse(savedCourses);
        updateSelectedCoursesUI();
    }
}

// Initialize Payment Page
function initPaymentPage() {
    const savedCourses = localStorage.getItem('selectedCourses');
    if (savedCourses) {
        selectedCourses = JSON.parse(savedCourses);
        displayPaymentCourses();
    } else {
        window.location.href = 'courses.html';
    }
    
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', handlePayment);
}

// Display courses for payment
function displayPaymentCourses() {
    const paymentCoursesList = document.getElementById('paymentCourses');
    const paymentTotalElement = document.getElementById('paymentTotal');
    
    paymentCoursesList.innerHTML = '';
    let total = 0;
    
    selectedCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.title} - $${course.price}`;
        paymentCoursesList.appendChild(li);
        total += course.price;
    });
    
    paymentTotalElement.textContent = total;
}

// Handle payment submission
async function handlePayment(e) {
    e.preventDefault();
    
    // Get user data
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        alert('Please login to complete payment');
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    // Get payment form data
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const amount = document.getElementById('paymentTotal').textContent;

    try {
        // Send payment request to backend
        const response = await fetch('http://localhost:3000/api/payment/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                cardName,
                cardNumber,
                expiryDate,
                cvv,
                amount: parseFloat(amount)
            })
        });
        const data = await response.json();

        if (response.ok) {
            // Update enrolled courses
            let enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${user.email}`)) || [];
            selectedCourses.forEach(course => {
                if (!enrolledCourses.some(c => c.id === course.id)) {
                    enrolledCourses.push(course);
                }
            });
            
            // Save enrolled courses
            localStorage.setItem(`enrolledCourses_${user.email}`, JSON.stringify(enrolledCourses));
            
            // Clear selected courses
            localStorage.removeItem('selectedCourses');
            selectedCourses = [];
            
            // Show success message and redirect
            alert('Payment successful! You are now enrolled in the selected courses.');
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during payment. Please try again.');
    }
}

// Initialize Dashboard Page
function initDashboardPage() {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userCoursesList = document.getElementById('userCourses');
    
    // Set user info
    userNameElement.textContent = currentUser.name;
    userEmailElement.textContent = currentUser.email;
    
    // Get enrolled courses
    const enrolledCourses = JSON.parse(localStorage.getItem(`enrolledCourses_${currentUser.email}`)) || [];
    
    // Display enrolled courses
    userCoursesList.innerHTML = '';
    if (enrolledCourses.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'You are not enrolled in any courses yet.';
        userCoursesList.appendChild(li);
    } else {
        enrolledCourses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = `${course.title} (${course.duration})`;
            userCoursesList.appendChild(li);
        });
    }
}

// Initialize Login Page
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Initialize Registration Page
function initRegistrationPage() {
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleRegistration);
}

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        // Register user
        const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });
        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
            alert(registerData.message || 'Registration failed');
            return;
        }

        // Automatically log in the user
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
            currentUser = loginData.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'dashboard.html';
        } else {
            alert('Registration successful, but login failed. Please log in manually.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'login.html';
}