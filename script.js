// Scroll progress bar
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById('scrollProgress').style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scrolling for navigation links
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

// Document preview interaction
const docPreview = document.getElementById('docPreview');
const docContent = document.getElementById('docContent');
const placeholderText = docPreview.querySelector('.placeholder-text');

docPreview.addEventListener('click', function() {
  docPreview.classList.add('active');
  placeholderText.style.display = 'none';
  docContent.classList.add('active');
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    docPreview.classList.remove('active');
    placeholderText.style.display = 'flex';
    docContent.classList.remove('active');
  }, 10000);
});

// Modal functionality
const demoModal = document.getElementById('demoModal');
const betaModal = document.getElementById('betaModal');
const demoButtons = document.querySelectorAll('#demoBtn, #navDemoBtn, #requestDemoBtn');
const betaButton = document.getElementById('betaBtn');
const closeDemoModal = document.getElementById('closeDemoModal');
const closeBetaModal = document.getElementById('closeBetaModal');

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

demoButtons.forEach(button => {
  button.addEventListener('click', () => openModal(demoModal));
});

betaButton.addEventListener('click', () => openModal(betaModal));
closeDemoModal.addEventListener('click', () => closeModal(demoModal));
closeBetaModal.addEventListener('click', () => closeModal(betaModal));

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  if (e.target === demoModal) closeModal(demoModal);
  if (e.target === betaModal) closeModal(betaModal);
});

// Form submissions
document.getElementById('demoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Demo request submitted! We\'ll contact you within 24 hours.');
  closeModal(demoModal);
  this.reset();
});

document.getElementById('betaForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Beta access request submitted! You\'ll receive an invitation soon.');
  closeModal(betaModal);
  this.reset();
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
  observer.observe(el);
});

// Pricing card interactions
document.querySelectorAll('.pricing-btn').forEach(button => {
  button.addEventListener('click', function() {
    const plan = this.closest('.pricing-card').querySelector('.pricing-plan').textContent;
    if (plan === 'Enterprise') {
      alert('Enterprise sales team will contact you within 24 hours!');
    } else {
      alert(`${plan} plan selected! Redirecting to checkout...`);
    }
  });
});

// Use cases button
document.getElementById('useCasesBtn').addEventListener('click', function() {
  alert('Use cases documentation will be available soon!');
});

// Mobile menu toggle (basic functionality)
document.getElementById('mobileMenuToggle').addEventListener('click', function() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Testimonial rotation (optional enhancement)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function rotateTestimonials() {
  testimonials.forEach((testimonial, index) => {
    testimonial.style.opacity = index === currentTestimonial ? '1' : '0.7';
    testimonial.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(1)';
  });
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}

// Rotate testimonials every 5 seconds
setInterval(rotateTestimonials, 5000);

// Add some interactive features for cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Typing effect for hero subtitle
const heroSubtitle = document.querySelector('.hero p');
const originalText = heroSubtitle.textContent;
let index = 0;

function typeWriter() {
  if (index < originalText.length) {
    heroSubtitle.textContent = originalText.substring(0, index + 1);
    index++;
    setTimeout(typeWriter, 50);
  }
}

// Start typing effect after page load
window.addEventListener('load', function() {
  setTimeout(() => {
    heroSubtitle.textContent = '';
    typeWriter();
  }, 1000);
});

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
  konamiCode.push(e.keyCode);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 3000);
  }
});

// Performance optimization - lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Dark mode toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function setTheme(dark) {
  if (dark) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

themeToggle.addEventListener('click', function() {
  setTheme(!document.body.classList.contains('dark-mode'));
});

// On page load, set theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  setTheme(true);
} else {
  setTheme(false);
}

// Staggered fade-slide-up for feature items
const featureItems = document.querySelectorAll('.feature-item');
const featureObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 180);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
featureItems.forEach((item, idx) => {
  featureObserver.observe(item);
});