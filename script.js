// Smooth scrolling voor navigatie links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling voor alle interne links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simpele validatie
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                alert('Vul alle velden in voordat je het formulier verstuurt.');
                return;
            }
            
            // Simuleer formulier verzending
            alert('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.');
            
            // Reset formulier
            contactForm.reset();
        });
    }

    // Progress bars animatie
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };

    // Animate progress bars when e-learning section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    });

    const elearningSection = document.querySelector('#elearning');
    if (elearningSection) {
        observer.observe(elearningSection);
    }

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Call once on load
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        background-color: rgba(255,255,255,0.2) !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
