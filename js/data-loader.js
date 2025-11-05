// 관리자 페이지에서 저장한 데이터 로드

document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
    loadTextData();
    loadContactData();
});

function loadPortfolioData() {
    const saved = localStorage.getItem('portfolioData');
    if (!saved) return;

    const data = JSON.parse(saved);
    const container = document.querySelector('.portfolio-masonry');

    if (container && data.length > 0) {
        container.innerHTML = '';

        data.forEach(item => {
            const sizeClass = item.size ? ` ${item.size}` : '';
            const categoryName = {
                'wedding': '웨딩',
                'dol': '돌잔치',
                'event': '행사현장스케치'
            }[item.category] || item.category;

            const div = document.createElement('div');
            div.className = `masonry-item${sizeClass}`;
            div.setAttribute('data-category', item.category);

            div.innerHTML = `
                <div class="masonry-image">
                    <img src="${item.imageUrl}" alt="${categoryName}">
                    <div class="masonry-overlay">
                        <span class="masonry-category">${categoryName}</span>
                        <h3 class="masonry-title">${item.title}</h3>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });

        // 스타일 적용
        document.querySelectorAll('.masonry-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

function loadTextData() {
    const saved = localStorage.getItem('textData');
    if (!saved) return;

    const data = JSON.parse(saved);

    // About 섹션 업데이트
    const aboutLead = document.querySelector('.about-lead');
    if (aboutLead && data.aboutLead) {
        aboutLead.innerHTML = data.aboutLead.replace(/\n/g, '<br>');
    }

    const aboutTexts = document.querySelectorAll('.about-text > p:not(.about-lead)');
    if (aboutTexts[0] && data.aboutText1) {
        aboutTexts[0].innerHTML = data.aboutText1.replace(/\n/g, '<br>');
    }
    if (aboutTexts[1] && data.aboutText2) {
        aboutTexts[1].innerHTML = data.aboutText2.replace(/\n/g, '<br>');
    }

    // 작가 사진 업데이트
    const artistImage = document.querySelector('.about-image img');
    if (artistImage && data.artistImageUrl) {
        artistImage.src = data.artistImageUrl;
        console.log('✅ 작가 사진 로드 완료:', data.artistImageUrl.substring(0, 50) + '...');
    } else {
        console.log('ℹ️ 작가 사진 없음 또는 요소를 찾을 수 없음');
    }
}

function loadContactData() {
    const saved = localStorage.getItem('contactData');
    if (!saved) return;

    const data = JSON.parse(saved);

    // 이메일
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && data.email) {
        emailLink.href = `mailto:${data.email}`;
        emailLink.textContent = data.email;
    }

    // 전화번호
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink && data.phone) {
        phoneLink.href = `tel:${data.phone.replace(/\s/g, '')}`;
        phoneLink.textContent = data.phone;
    }

    // 위치
    const locationSpan = document.querySelectorAll('.info-value');
    locationSpan.forEach(span => {
        if (span.textContent.includes('Seoul') && data.location) {
            span.textContent = data.location;
        }
    });

    // 소셜 링크
    const socialLinks = document.querySelectorAll('.social-links-modern a');
    if (socialLinks[0] && data.instagram) socialLinks[0].href = data.instagram;
    if (socialLinks[1] && data.facebook) socialLinks[1].href = data.facebook;
    if (socialLinks[2] && data.linkedin) socialLinks[2].href = data.linkedin;
}

// 수상 경력 로드
function loadAwardsData() {
    const saved = localStorage.getItem('awardsData');
    if (!saved) return;

    const data = JSON.parse(saved);
    const container = document.querySelector('.about-awards');

    if (container && data.length > 0) {
        container.innerHTML = '';

        data.forEach(award => {
            const div = document.createElement('div');
            div.className = 'award';
            div.innerHTML = `
                <span class="award-year">${award.year}</span>
                <span class="award-title">${award.title}</span>
            `;
            container.appendChild(div);
        });
    }
}

// 수상 경력도 로드
setTimeout(loadAwardsData, 100);
