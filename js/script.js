// ===================================
// 프리미엄 사진작가 포트폴리오 JavaScript
// ===================================

'use strict';

// DOM 요소
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section[id]');

// ===================================
// 모바일 네비게이션
// ===================================

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================================
// 스크롤 헤더 효과
// ===================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // 헤더 배경 변경
    if (currentScroll > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// 포트폴리오 필터링 (향상된 애니메이션)
// ===================================

const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 활성 버튼 업데이트
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || category === filterValue;

            if (shouldShow) {
                // 순차적 페이드인
                setTimeout(() => {
                    item.classList.remove('hide');
                    item.style.display = 'block';
                }, index * 80);
            } else {
                item.classList.add('hide');
                setTimeout(() => {
                    if (item.classList.contains('hide')) {
                        item.style.display = 'none';
                    }
                }, 400);
            }
        });
    });
});

// ===================================
// 스크롤 애니메이션 (Intersection Observer)
// ===================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // 한 번만 실행되도록
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// 애니메이션 대상 요소
const animatedElements = document.querySelectorAll(
    '.portfolio-item, .stat-item, .info-item, .section-header'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    fadeInObserver.observe(el);
});

// ===================================
// 부드러운 스크롤
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // 빈 해시는 무시
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = header?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// 현재 섹션 하이라이트
// ===================================

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// 마우스 추적 효과 (히어로 섹션)
// ===================================

const hero = document.querySelector('.hero');

if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;

        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'translate(0, 0)';
        }
    });
}

// ===================================
// 폼 제출 처리
// ===================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.textContent;

        // 로딩 상태
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // 폼 데이터 수집
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // 시뮬레이션 (실제 구현 시 API 호출)
        setTimeout(() => {
            console.log('Form submitted:', data);

            // 성공 메시지
            submitBtn.textContent = 'Sent!';
            submitBtn.style.background = 'var(--accent-gold)';
            submitBtn.style.color = 'var(--bg-dark)';

            // 폼 리셋
            contactForm.reset();

            // 버튼 복원
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
            }, 2000);
        }, 1500);
    });
}

// ===================================
// 커서 효과 (데스크톱만)
// ===================================

if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border: 2px solid var(--accent-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--accent-gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';

        cursorDot.style.left = mouseX - 2 + 'px';
        cursorDot.style.top = mouseY - 2 + 'px';
    });

    // 부드러운 커서 따라가기
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX - 5 + 'px';
        cursor.style.top = cursorY - 5 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 호버 시 커서 확대
    const hoverables = document.querySelectorAll('a, button, .portfolio-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.borderColor = 'rgba(212, 175, 55, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--accent-gold)';
        });
    });
}

// ===================================
// 페이지 로드 애니메이션
// ===================================

window.addEventListener('load', () => {
    // 페이지 로더 제거 (있을 경우)
    document.body.classList.add('loaded');

    // 초기 네비게이션 하이라이트
    highlightNavigation();
});

// ===================================
// 스크롤 진행 표시기
// ===================================

const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-gold), var(--accent-rose));
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ===================================
// 성능 최적화: 디바운스 함수
// ===================================

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

// 리사이즈 이벤트 최적화
window.addEventListener('resize', debounce(() => {
    // 리사이즈 시 필요한 재계산
    highlightNavigation();
}, 250));

console.log('%c웅이작가 포트폴리오', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%c© 2024 All rights reserved', 'color: #666; font-size: 12px;');
