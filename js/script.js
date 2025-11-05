// ============================================
// ULTRA PREMIUM PORTFOLIO - JAVASCRIPT
// ============================================

'use strict';

// Page Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Sidebar Toggle (Mobile)
const mobileToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Close sidebar when link clicked (mobile)
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
            mobileToggle?.classList.remove('active');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation based on Scroll
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-modern');
const masonryItems = document.querySelectorAll('.masonry-item');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            masonryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    setTimeout(() => {
                        item.classList.remove('hide');
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.5s ease';
                            item.style.opacity = '1';
                        }, 50);
                    }, index * 50);
                } else {
                    item.style.transition = 'opacity 0.3s ease';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 300);
                }
            });
        });
    });
}

// Form Handling
const contactForm = document.querySelector('.contact-form-modern');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;

        // Loading state
        submitBtn.textContent = '전송 중...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Save to localStorage
        setTimeout(() => {
            // Get existing inquiries
            let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');

            // Create new inquiry
            const inquiry = {
                id: Date.now(),
                name: data.name,
                email: data.email,
                phone: data.phone,  // 전화번호 추가
                subject: data.subject,
                message: data.message,
                date: new Date().toISOString(),
                read: false,
                status: 'pending',  // 대기, 진행중, 완료, 부재
                memo: ''  // 특이사항 메모
            };

            // Add to beginning of array
            inquiries.unshift(inquiry);

            // Save to localStorage
            localStorage.setItem('inquiries', JSON.stringify(inquiries));

            console.log('Form submitted and saved:', inquiry);

            // Success state
            submitBtn.textContent = '전송 완료!';
            submitBtn.style.background = 'var(--gold)';
            submitBtn.style.color = 'var(--darker)';

            // Reset form
            contactForm.reset();

            // Reset button
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
            }, 2000);
        }, 1500);
    });
}

// Parallax Effect for Hero
const hero = document.querySelector('.hero-section');

if (hero) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 30;
        const yPos = (clientY / innerHeight - 0.5) * 30;

        const heroText = hero.querySelector('.hero-text');
        if (heroText) {
            heroText.style.transform = `translate(${xPos}px, ${yPos}px)`;
            heroText.style.transition = 'transform 0.5s ease-out';
        }
    });
}

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
const animateElements = document.querySelectorAll('.masonry-item, .about-content, .contact-intro');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeInObserver.observe(el);
});

// Typing Animation for Hero
const heroLines = document.querySelectorAll('.hero-line');
heroLines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(50px)';

    setTimeout(() => {
        line.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
    }, 1200 + (index * 200));
});

// Cursor Effect (Desktop only)
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid #C9A668;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s, transform 0.2s;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = cursorX - 20 + 'px';
        cursor.style.top = cursorY - 20 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .masonry-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderWidth = '2px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderWidth = '1px';
        });
    });
}

// Progress Bar
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #C9A668, #E8D4A0);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Resize handler
window.addEventListener('resize', debounce(() => {
    highlightNav();
}, 250));

// Console styling
console.log(
    '%c사진작가 포트폴리오',
    'font-size: 24px; font-weight: bold; color: #C9A668; font-family: serif;'
);
console.log(
    '%c© 2024 All Rights Reserved',
    'font-size: 12px; color: #8A8A8A;'
);
