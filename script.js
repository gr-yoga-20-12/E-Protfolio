// Global Variables
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Particles Animation
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = this.getRandomColor();
        this.life = Math.random() * 200 + 50;
        this.maxLife = this.life;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(59, 130, 246, 0.5)',    // Blue
            'rgba(20, 184, 166, 0.5)',     // Teal
            'rgba(249, 115, 22, 0.5)',     // Orange
            'rgba(139, 92, 246, 0.5)',     // Purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.01;
        this.life--;
        
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.speedX -= Math.cos(angle) * force * 0.5;
                this.speedY -= Math.sin(angle) * force * 0.5;
            }
        }
    }
    
    draw(ctx) {
        const opacity = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        if (particles.length < 100) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            
            if (particle.life <= 0 || particle.size <= 0.2) {
                particles.splice(index, 1);
            }
        });
        
        createParticles();
        requestAnimationFrame(animateParticles);
    }
    
    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
}

// Typing Animation
function initTypingAnimation() {
    const textArray = [
        'Embedded Systems Engineer',
        'IOT Developer',
        'Problem Solver',
        'Creative Thinker',
    ];
    
    const typedTextSpan = document.getElementById('typed-text');
    const cursor = document.querySelector('.cursor');
    
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = textArray[textArrayIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) {
                textArrayIndex = 0;
            }
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

// Navigation Management
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = getComputedStyle(document.documentElement)
                .getPropertyValue('--bg-secondary').trim() + 'ee';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.body.getAttribute('data-theme') === 'dark') {
                navbar.style.background = 'rgba(31, 41, 55, 0.95)';
            }
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations (AOS-like)
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(entry.target.getAttribute('data-aos-delay')) || 0);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => observer.observe(element));
}

// Projects Management
async function initProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsLoading = document.getElementById('projects-loading');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let allProjects = [];
    
    try {
        // First seed the database with sample projects
        await fetch('/api/seed-projects', { method: 'POST' });
        
        // Then fetch the projects
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        allProjects = await response.json();
        displayProjects(allProjects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    } finally {
        projectsLoading.style.display = 'none';
    }
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filter = button.getAttribute('data-filter');
            const filteredProjects = filter === 'all' 
                ? allProjects 
                : allProjects.filter(project => project.category.toLowerCase() === filter);
            
            displayProjects(filteredProjects);
        });
    });
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects found.</p>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" target="_blank" class="project-link">
                                <i class="fab fa-github"></i>
                            </a>
                        ` : ''}
                        ${project.demoUrl ? `
                            <a href="${project.demoUrl}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('contact-success');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                contactForm.reset();
                showSuccessMessage();
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
}

function showSuccessMessage() {
    const successMessage = document.getElementById('contact-success');
    successMessage.classList.add('show');
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeSuccessMessage();
    }, 5000);
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('contact-success');
    successMessage.classList.remove('show');
}

// Resume Modal
function openResumeModal() {
    const modal = document.getElementById('resume-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
    const modal = document.getElementById('resume-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopButton = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });
    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Smooth Animations on Scroll
function initSmoothAnimations() {
    // Add stagger animation to project cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        staggerObserver.observe(projectsSection);
    }
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor FPS
    let fps = 0;
    let lastTime = Date.now();
    
    function updateFPS() {
        const now = Date.now();
        fps = 1000 / (now - lastTime);
        lastTime = now;
        
        // Reduce particle count if FPS is too low
        if (fps < 30 && particles.length > 50) {
            particles = particles.slice(0, 30);
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send error reports to a logging service here
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initTheme();
    initParticles();
    initTypingAnimation();
    initNavigation();
    initScrollAnimations();
    initScrollToTop();
    initLazyLoading();
    initSmoothAnimations();
    initPerformanceMonitoring();
    
    // Initialize async features
    initProjects();
    initContactForm();
    
    // Event listeners for theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeResumeModal();
            closeSuccessMessage();
        }
    });
    
    // Close modals on outside click
    document.getElementById('resume-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeResumeModal();
        }
    });
});

// Export functions for global access
window.openResumeModal = openResumeModal;
window.closeResumeModal = closeResumeModal;
window.closeSuccessMessage = closeSuccessMessage;

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics (placeholder for Google Analytics or similar)
function initAnalytics() {
    // Add your analytics initialization code here
    // Example: gtag('config', 'GA_MEASUREMENT_ID');
}

// Call analytics initialization if needed
// initAnalytics();

// Modal functionality
const modalTriggers = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal-overlay');
const closeBtns = document.querySelectorAll('.close-btn');

// Open modal on hover
modalTriggers.forEach(trigger => {
    let hoverTimeout;
    
    trigger.addEventListener('mouseenter', () => {
        const modalId = 'modal-' + trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            if (modal) {
                modal.classList.add('active');
            }
        }, 200); // Small delay to prevent accidental triggers
    });

    trigger.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        const modalId = 'modal-' + trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (modal) {
            // Check if mouse is moving to modal
            setTimeout(() => {
                if (!modal.matches(':hover') && !trigger.matches(':hover')) {
                    modal.classList.remove('active');
                }
            }, 100);
        }
    });
});

// Close modal when leaving modal area
modals.forEach(modal => {
    modal.addEventListener('mouseleave', () => {
        modal.classList.remove('active');
    });

    // Prevent modal from closing when hovering over content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('mouseenter', () => {
        modal.classList.add('active');
    });
});

// Close button functionality
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        modal.classList.remove('active');
    });
});

// Close modal on background click
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
});