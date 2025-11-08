
// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const getStartedBtn = document.getElementById('getStartedBtn');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Get Started button event
getStartedBtn.addEventListener('click', () => {
    alert('Salamat sa pagtitiwala sa Lenna AI! Magsisimula na tayo sa iyong journey sa Startcope Beta! 🚀');
    // You can add more functionality here like redirecting to another page
    // window.location.href = '/dashboard';
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
