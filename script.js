const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const typingText = document.getElementById('typing-text');


function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}


function initNavigation() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

function initTypingAnimation() {
    const texts = [
        'Desenvolvedor Full-Stack',
        'Especialista em Java',
        'Expert em Spring Boot',
        'Desenvolvedor Angular',
        'Desenvolvedor React'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    typeText();
}

function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            setTimeout(animateSkillBars, 300);
        });
    });
}

function initCoursesFilter() {
    const filterButtons = document.querySelectorAll('.courses .filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            courseCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            setTimeout(animateProgressBars, 300);
        });
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');

    skillBars.forEach(bar => {
        const parentCard = bar.closest('.skill-card');
        if (!parentCard.classList.contains('hidden')) {
            const level = bar.getAttribute('data-level');
            bar.style.setProperty('--skill-width', level + '%');
            bar.querySelector('::after') || (bar.style.width = level + '%');

            setTimeout(() => {
                bar.style.background = `linear-gradient(90deg, var(--primary-color) 0%, var(--primary-color) ${level}%, var(--border-color) ${level}%, var(--border-color) 100%)`;
            }, 100);
        }
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach(bar => {
        const parentCard = bar.closest('.course-card');
        if (!parentCard.classList.contains('hidden')) {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 100);
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('skills')) {
                    setTimeout(animateSkillBars, 500);
                }
                if (entry.target.classList.contains('courses')) {
                    setTimeout(animateProgressBars, 500);
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`
        .section-title,
        .about-text,
        .about-stats,
        .skill-card,
        .timeline-item,
        .education-card,
        .course-card,
        .contact-item,
        .contact-cta
    `);

    animatedElements.forEach((el, index) => {
        if (el.classList.contains('skill-card') || el.classList.contains('course-card')) {
            el.classList.add('scale-in');
            el.style.animationDelay = `${index * 0.1}s`;
        } else if (el.classList.contains('timeline-item')) {
            if (index % 2 === 0) {
                el.classList.add('slide-in-left');
            } else {
                el.classList.add('slide-in-right');
            }
        } else {
            el.classList.add('fade-in');
        }

        observer.observe(el);
    });
}

function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const parallaxSpeed = scrolled * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const optimizedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

function init() {
    initTheme();
    initNavigation();
    initTypingAnimation();

    initSkillsFilter();
    initCoursesFilter();
    initScrollAnimations();
    initBackToTop();
    initParallax();
    initLazyLoading();

    themeToggle.addEventListener('click', toggleTheme);

    setTimeout(() => {
        animateSkillBars();
        animateProgressBars();
    }, 1000);

    window.addEventListener('scroll', optimizedScrollHandler);

    console.log('🚀 Currículo interativo carregado com sucesso!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
} else {
    init();
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            animateSkillBars();
            animateProgressBars();
        }, 100);
    }
});

window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}, 250));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }

    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
});

function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

window.addEventListener('error', (e) => {
    console.error('Erro no site:', e.error);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Service Worker support detected');
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTheme,
        toggleTheme,
        animateSkillBars,
        animateProgressBars,
        debounce
    };
}

