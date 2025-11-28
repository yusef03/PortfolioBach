// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '🌙';
        localStorage.setItem('theme', 'dark');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '🌙';
}

// Calculate RGB value for background color
const style = getComputedStyle(document.body);
const bgColor = style.getPropertyValue('--background-color').trim();
document.documentElement.style.setProperty('--background-color-rgb', hexToRgb(bgColor) || '255, 255, 255');

function hexToRgb(hex) {
    if (!hex || hex === '#ffffff') return '255, 255, 255';
    if (hex === '#000000') return '0, 0, 0';

    // Default fallback
    return '255, 255, 255';
}

// Parallax Effect
const parallaxBg = document.getElementById('parallax-bg');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const parallaxSection = document.querySelector('.parallax-container');
    const sectionPosition = parallaxSection.offsetTop;
    const sectionHeight = parallaxSection.offsetHeight;

    if (scrollPosition >= sectionPosition - window.innerHeight &&
        scrollPosition <= sectionPosition + sectionHeight) {
        const yPos = (scrollPosition - sectionPosition) * 0.5;
        parallaxBg.style.transform = `translateY(${yPos}px)`;
    }
});

// Scroll animations
const fadeElements = document.querySelectorAll('.fade-in');
const staggerItems = document.querySelectorAll('.stagger-item');

const fadeInOptions = {
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, fadeInOptions);

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, fadeInOptions);

staggerItems.forEach(item => {
    staggerObserver.observe(item);
});

// Theme showcase toggle button
const themeToggleButtons = document.querySelectorAll('.theme-toggle-button');
themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const themeCard = this.closest('.theme-card');
        if (themeCard.classList.contains('light-theme')) {
            themeCard.classList.remove('light-theme');
            themeCard.classList.add('dark-theme');
            this.textContent = 'Light Mode';
        } else {
            themeCard.classList.remove('dark-theme');
            themeCard.classList.add('light-theme');
            this.textContent = 'Dark Mode';
        }
    });
});