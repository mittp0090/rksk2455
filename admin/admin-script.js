// 관리자 페이지 JavaScript

// 기본 데이터 구조
let portfolioData = [];
let heroData = {};
let textData = {};
let contactData = {};
let awardsData = [];
let brandingData = {};
let currentEditIndex = -1;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    checkLogin();
});

// 로그인 확인
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdmin();
    }
}

// 로그인
function login() {
    const password = document.getElementById('passwordInput').value;
    const savedPassword = localStorage.getItem('adminPassword') || 'admin1234';

    if (password === savedPassword) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdmin();
    } else {
        alert('비밀번호가 틀렸습니다!');
    }
}

// Enter 키로 로그인
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
        login();
    }
});

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    }
}

// 관리자 화면 표시
function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderPortfolio();
    loadHeroData();
    loadTextData();
    loadContactData();
    loadAwards();
    loadBranding();
    updateInquiriesBadge();
}

// 탭 전환
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 모든 탭 컨텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 선택한 탭 활성화
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');

    // 접수 내역 탭이면 데이터 로드
    if (tabName === 'inquiries') {
        loadInquiries();
    }
}

// ============================================
// 포트폴리오 관리
// ============================================

function loadAllData() {
    // LocalStorage에서 데이터 로드
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        portfolioData = JSON.parse(saved);
    } else {
        // 기본 데이터
        portfolioData = [
            {
                category: 'wedding',
                title: '영원한 약속',
                imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop',
                size: 'large'
            },
            {
                category: 'dol',
                title: '첫 생일의 기쁨',
                imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=400&fit=crop',
                size: ''
            },
            {
                category: 'event',
                title: '생생한 현장의 기록',
                imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
                size: ''
            },
            {
                category: 'wedding',
                title: '행복한 시작',
                imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop',
                size: 'tall'
            },
            {
                category: 'dol',
                title: '소중한 첫걸음',
                imageUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=400&fit=crop',
                size: ''
            },
            {
                category: 'event',
                title: '특별한 순간들',
                imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
                size: 'wide'
            }
        ];
    }

    // 텍스트 데이터
    const savedText = localStorage.getItem('textData');
    if (savedText) {
        textData = JSON.parse(savedText);
    } else {
        textData = {
            aboutLead: '순간을 포착하고, 감정을 담아내며,\n이야기를 만들어갑니다.',
            aboutText1: '저는 10년 이상 사진을 통해 세상과 소통해왔습니다.\n단순히 아름다운 이미지를 넘어서, 그 안에 담긴 감정과\n이야기를 전달하는 것이 제 작업의 핵심입니다.',
            aboutText2: '웨딩, 돌잔치, 행사현장스케치 등 다양한 분야에서\n활동하며 수많은 고객들과 함께 특별한 순간들을\n만들어왔습니다.'
        };
    }

    // 연락처 데이터
    const savedContact = localStorage.getItem('contactData');
    if (savedContact) {
        contactData = JSON.parse(savedContact);
    } else {
        contactData = {
            email: 'hello@photographer.com',
            phone: '+82 10-1234-5678',
            location: 'Seoul, South Korea',
            instagram: '#',
            facebook: '#',
            linkedin: '#'
        };
    }

    // 수상 데이터
    const savedAwards = localStorage.getItem('awardsData');
    if (savedAwards) {
        awardsData = JSON.parse(savedAwards);
    } else {
        awardsData = [
            { year: '2023', title: 'Photography Excellence Award' },
            { year: '2022', title: 'Best Portrait Photographer' },
            { year: '2021', title: 'Visual Arts Recognition' }
        ];
    }
}

function renderPortfolio() {
    const container = document.getElementById('portfolioItems');
    container.innerHTML = '';

    portfolioData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.onclick = () => editPortfolioItem(index);

        const categoryName = {
            'wedding': '웨딩',
            'dol': '돌잔치',
            'event': '행사현장스케치'
        }[item.category] || item.category;

        const sizeName = {
            'large': '큰 (2칸)',
            'tall': '세로 긴',
            'wide': '가로 넓은',
            '': '기본'
        }[item.size] || '기본';

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="portfolio-card-image"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23999%22%3E이미지 없음%3C/text%3E%3C/svg%3E'">
            <div class="portfolio-card-info">
                <span class="portfolio-card-category">${categoryName}</span>
                <div class="portfolio-card-title">${item.title}</div>
                <div class="portfolio-card-size">크기: ${sizeName}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

function addPortfolioItem() {
    const newItem = {
        category: 'wedding',
        title: '새 작품',
        imageUrl: '',
        size: ''
    };

    portfolioData.push(newItem);
    savePortfolioData();
    renderPortfolio();
    editPortfolioItem(portfolioData.length - 1);
}

function editPortfolioItem(index) {
    currentEditIndex = index;
    const item = portfolioData[index];

    document.getElementById('editCategory').value = item.category;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editSize').value = item.size;

    // 기존 이미지가 있으면 미리보기 표시
    if (item.imageUrl) {
        showPortfolioImagePreview(item.imageUrl);
    } else {
        // 미리보기 숨기기
        document.getElementById('portfolioImagePreview').style.display = 'none';
        document.getElementById('editImageFile').value = '';
    }

    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    if (currentEditIndex >= 0) {
        // 미리보기에서 이미지 가져오기 (Base64)
        const previewImg = document.getElementById('portfolioImagePreviewImg');
        const imageUrl = previewImg.src || '';

        portfolioData[currentEditIndex] = {
            category: document.getElementById('editCategory').value,
            title: document.getElementById('editTitle').value,
            imageUrl: imageUrl,
            size: document.getElementById('editSize').value
        };

        try {
            savePortfolioData();
            renderPortfolio();
            closeModal();
            alert('저장되었습니다!');
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('저장 실패: 이미지 파일이 너무 큽니다. 더 작은 이미지를 사용하세요.');
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        }
    }
}

function deleteItem() {
    if (confirm('정말 삭제하시겠습니까?')) {
        portfolioData.splice(currentEditIndex, 1);
        savePortfolioData();
        renderPortfolio();
        closeModal();
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('portfolioImagePreview').style.display = 'none';
    document.getElementById('editImageFile').value = '';
    currentEditIndex = -1;
}

function savePortfolioData() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// 포트폴리오 이미지 파일 업로드 처리
function handlePortfolioImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다. 5MB 이하의 이미지를 선택하세요.');
        event.target.value = '';
        return;
    }

    // 파일 타입 체크
    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
        alert('JPG, PNG, WebP 형식만 지원합니다.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const base64Image = e.target.result;

        // 미리보기 표시
        showPortfolioImagePreview(base64Image);

        console.log('✅ 포트폴리오 이미지 업로드:', file.name, '크기:', (file.size / 1024).toFixed(2) + 'KB');
    };

    reader.onerror = function() {
        alert('파일을 읽는 중 오류가 발생했습니다.');
        event.target.value = '';
    };

    reader.readAsDataURL(file);
}

// 포트폴리오 이미지 미리보기 표시
function showPortfolioImagePreview(imageUrl) {
    const previewDiv = document.getElementById('portfolioImagePreview');
    const previewImg = document.getElementById('portfolioImagePreviewImg');

    previewImg.src = imageUrl;
    previewDiv.style.display = 'block';
}

// 포트폴리오 이미지 제거
function clearPortfolioImage() {
    if (!confirm('이미지를 제거하시겠습니까?')) return;

    document.getElementById('editImageFile').value = '';
    document.getElementById('portfolioImagePreview').style.display = 'none';
    document.getElementById('portfolioImagePreviewImg').src = '';

    alert('이미지가 제거되었습니다. "저장" 버튼을 눌러 적용하세요.');
}

// ============================================
// Hero 섹션 편집
// ============================================

function loadHeroData() {
    // localStorage에서 Hero 데이터 로드
    const saved = localStorage.getItem('heroData');
    if (saved) {
        heroData = JSON.parse(saved);
    }

    // 폼에 데이터 채우기
    document.getElementById('heroTag').value = heroData.heroTag || 'Visual Artist';
    document.getElementById('heroLine1').value = heroData.heroLine1 || '순간을';
    document.getElementById('heroLine2').value = heroData.heroLine2 || '영원으로';
    document.getElementById('heroDescription').value = heroData.heroDescription || '빛과 그림자 사이, 찰나와 영원 사이\n예술로 기억되는 순간들';

    document.getElementById('stat1Number').value = heroData.stat1Number || '500+';
    document.getElementById('stat1Label').value = heroData.stat1Label || 'Projects';
    document.getElementById('stat2Number').value = heroData.stat2Number || '10+';
    document.getElementById('stat2Label').value = heroData.stat2Label || 'Years';
    document.getElementById('stat3Number').value = heroData.stat3Number || '100%';
    document.getElementById('stat3Label').value = heroData.stat3Label || 'Satisfaction';
}

function saveHero() {
    heroData = {
        heroTag: document.getElementById('heroTag').value,
        heroLine1: document.getElementById('heroLine1').value,
        heroLine2: document.getElementById('heroLine2').value,
        heroDescription: document.getElementById('heroDescription').value,
        stat1Number: document.getElementById('stat1Number').value,
        stat1Label: document.getElementById('stat1Label').value,
        stat2Number: document.getElementById('stat2Number').value,
        stat2Label: document.getElementById('stat2Label').value,
        stat3Number: document.getElementById('stat3Number').value,
        stat3Label: document.getElementById('stat3Label').value
    };

    try {
        localStorage.setItem('heroData', JSON.stringify(heroData));
        console.log('✅ Hero 섹션 저장 완료');
        alert('Hero 섹션이 저장되었습니다!');
    } catch (e) {
        console.error('Hero 저장 실패:', e);
        alert('저장 중 오류가 발생했습니다.');
    }
}

// ============================================
// About 섹션 편집
// ============================================

function loadTextData() {
    document.getElementById('aboutLead').value = textData.aboutLead || '';
    document.getElementById('aboutText1').value = textData.aboutText1 || '';
    document.getElementById('aboutText2').value = textData.aboutText2 || '';

    // 작가 사진이 있으면 미리보기 표시
    if (textData.artistImageUrl) {
        showArtistImagePreview(textData.artistImageUrl);
        console.log('✅ 저장된 작가 사진 로드:', textData.artistImageUrl.substring(0, 50) + '...');
    }
}

function saveAbout() {
    // 현재 미리보기에 표시된 이미지 src를 저장 (Base64)
    const previewDiv = document.getElementById('artistImagePreview');
    const previewImg = document.getElementById('artistImagePreviewImg');

    // 미리보기가 표시되고 있고 src가 있으면 저장
    let imageUrl = '';
    if (previewDiv.style.display !== 'none' && previewImg.src) {
        imageUrl = previewImg.src;
    }

    textData = {
        aboutLead: document.getElementById('aboutLead').value,
        aboutText1: document.getElementById('aboutText1').value,
        aboutText2: document.getElementById('aboutText2').value,
        artistImageUrl: imageUrl
    };

    try {
        localStorage.setItem('textData', JSON.stringify(textData));

        // 저장 확인
        if (imageUrl) {
            const imageSize = (imageUrl.length / 1024).toFixed(2);
            console.log('✅ 작가 사진 저장됨:', imageUrl.substring(0, 50) + '...', '크기:', imageSize + 'KB');
        } else {
            console.log('ℹ️ 작가 사진 없음');
        }

        alert('저장되었습니다!');
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('저장 실패: 파일이 너무 큽니다. 더 작은 이미지를 사용하세요.');
            console.error('localStorage 용량 초과:', e);
        } else {
            alert('저장 중 오류가 발생했습니다.');
            console.error('저장 오류:', e);
        }
    }
}

// 작가 사진 파일 업로드 처리
function handleArtistImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기가 너무 큽니다. 5MB 이하의 이미지를 선택하세요.');
        event.target.value = '';
        return;
    }

    // 파일 타입 체크
    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
        alert('JPG, PNG, WebP 형식만 지원합니다.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const base64Image = e.target.result;

        // 미리보기 표시
        showArtistImagePreview(base64Image);

        console.log('✅ 이미지 업로드 완료:', file.name, '크기:', (file.size / 1024).toFixed(2) + 'KB');
    };

    reader.onerror = function() {
        alert('파일을 읽는 중 오류가 발생했습니다.');
        event.target.value = '';
    };

    reader.readAsDataURL(file);
}

// 작가 사진 미리보기 표시
function showArtistImagePreview(imageUrl) {
    const previewDiv = document.getElementById('artistImagePreview');
    const previewImg = document.getElementById('artistImagePreviewImg');

    previewImg.src = imageUrl;
    previewDiv.style.display = 'block';
}

// 작가 사진 제거
function clearArtistImage() {
    if (!confirm('작가 사진을 제거하시겠습니까?')) return;

    document.getElementById('artistImageFile').value = '';
    document.getElementById('artistImagePreview').style.display = 'none';
    document.getElementById('artistImagePreviewImg').src = '';

    alert('이미지가 제거되었습니다. "저장" 버튼을 눌러 적용하세요.');
}

// ============================================
// 수상 경력
// ============================================

function loadAwards() {
    const container = document.getElementById('awards');
    container.innerHTML = '';

    awardsData.forEach((award, index) => {
        const div = document.createElement('div');
        div.className = 'award-item';
        div.innerHTML = `
            <input type="text" value="${award.year}" placeholder="연도"
                   onchange="updateAward(${index}, 'year', this.value)">
            <input type="text" value="${award.title}" placeholder="수상 내역"
                   onchange="updateAward(${index}, 'title', this.value)">
            <button onclick="removeAward(${index})">삭제</button>
        `;
        container.appendChild(div);
    });
}

function updateAward(index, field, value) {
    awardsData[index][field] = value;
    localStorage.setItem('awardsData', JSON.stringify(awardsData));
}

function addAward() {
    awardsData.push({ year: '2024', title: '새 수상' });
    localStorage.setItem('awardsData', JSON.stringify(awardsData));
    loadAwards();
}

function removeAward(index) {
    if (confirm('삭제하시겠습니까?')) {
        awardsData.splice(index, 1);
        localStorage.setItem('awardsData', JSON.stringify(awardsData));
        loadAwards();
    }
}

// ============================================
// 연락처
// ============================================

function loadContactData() {
    document.getElementById('contactEmail').value = contactData.email || '';
    document.getElementById('contactPhone').value = contactData.phone || '';
    document.getElementById('contactLocation').value = contactData.location || '';
    document.getElementById('socialInstagram').value = contactData.instagram || '';
    document.getElementById('socialFacebook').value = contactData.facebook || '';
    document.getElementById('socialLinkedin').value = contactData.linkedin || '';
}

function saveContact() {
    contactData = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        location: document.getElementById('contactLocation').value,
        instagram: document.getElementById('socialInstagram').value,
        facebook: document.getElementById('socialFacebook').value,
        linkedin: document.getElementById('socialLinkedin').value
    };

    localStorage.setItem('contactData', JSON.stringify(contactData));
    alert('저장되었습니다!');
}

// ============================================
// 설정
// ============================================

function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (newPassword.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    localStorage.setItem('adminPassword', newPassword);
    alert('비밀번호가 변경되었습니다!');
    document.getElementById('newPassword').value = '';
}

function saveAll() {
    savePortfolioData();
    saveTexts();
    saveContact();
    localStorage.setItem('awardsData', JSON.stringify(awardsData));
    alert('모든 데이터가 저장되었습니다!');
}

function exportData() {
    const allData = {
        portfolio: portfolioData,
        text: textData,
        contact: contactData,
        awards: awardsData
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (confirm('기존 데이터를 덮어쓰시겠습니까?')) {
                if (data.portfolio) {
                    portfolioData = data.portfolio;
                    savePortfolioData();
                }
                if (data.text) {
                    textData = data.text;
                    localStorage.setItem('textData', JSON.stringify(textData));
                }
                if (data.contact) {
                    contactData = data.contact;
                    localStorage.setItem('contactData', JSON.stringify(contactData));
                }
                if (data.awards) {
                    awardsData = data.awards;
                    localStorage.setItem('awardsData', JSON.stringify(awardsData));
                }

                alert('데이터를 가져왔습니다!');
                location.reload();
            }
        } catch (error) {
            alert('잘못된 파일 형식입니다.');
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (confirm('모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다!')) {
        if (confirm('정말로 초기화하시겠습니까?')) {
            localStorage.clear();
            sessionStorage.clear();
            alert('초기화되었습니다. 페이지를 새로고침합니다.');
            location.reload();
        }
    }
}

// 모달 닫기 (배경 클릭)
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    const inquiryModal = document.getElementById('inquiryModal');
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === inquiryModal) {
        closeInquiryModal();
    }
}

// ============================================
// 접수 내역 관리
// ============================================

let currentInquiryId = null;

// 접수 내역 배지 업데이트
function updateInquiriesBadge() {
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const unreadCount = inquiries.filter(i => !i.read).length;
    const badge = document.getElementById('unreadBadge');

    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
}

// 접수 내역 로드
function loadInquiries() {
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    renderInquiriesStats(inquiries);
    renderInquiriesList(inquiries);
    updateInquiriesBadge();
}

// 통계 렌더링
function renderInquiriesStats(inquiries) {
    const unreadCount = inquiries.filter(i => !i.read).length;
    const totalCount = inquiries.length;

    const statsHTML = `
        <div class="stat-card unread">
            <div class="stat-number">${unreadCount}</div>
            <div class="stat-label">미읽음 문의</div>
        </div>
        <div class="stat-card total">
            <div class="stat-number">${totalCount}</div>
            <div class="stat-label">전체 문의</div>
        </div>
    `;

    document.getElementById('inquiriesStats').innerHTML = statsHTML;
}

// 목록 렌더링
function renderInquiriesList(inquiries) {
    const listContainer = document.getElementById('inquiriesList');

    if (inquiries.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">접수된 문의가 없습니다</div>
                <div class="empty-state-subtext">Contact 폼으로 문의가 들어오면 여기에 표시됩니다.</div>
            </div>
        `;
        return;
    }

    const listHTML = inquiries.map(inquiry => {
        const date = formatDate(inquiry.date);
        const unreadClass = inquiry.read ? '' : 'unread';
        const preview = inquiry.message.length > 100
            ? inquiry.message.substring(0, 100) + '...'
            : inquiry.message;

        return `
            <div class="inquiry-item ${unreadClass}" onclick="viewInquiry(${inquiry.id})">
                <div class="inquiry-header">
                    <div class="inquiry-name">${inquiry.name}</div>
                    <div class="inquiry-date">${date}</div>
                </div>
                <div class="inquiry-subject">${inquiry.subject}</div>
                <div class="inquiry-preview">${preview}</div>
                <div class="inquiry-email">${inquiry.email}</div>
                <div class="inquiry-actions" onclick="event.stopPropagation()">
                    ${!inquiry.read ? `<button onclick="markAsRead(${inquiry.id})" class="btn-secondary">읽음 처리</button>` : ''}
                    <button onclick="deleteInquiryFromList(${inquiry.id})" class="btn-danger">삭제</button>
                </div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = listHTML;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);

    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 상세보기
function viewInquiry(id) {
    let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const inquiry = inquiries.find(i => i.id === id);

    if (!inquiry) return;

    currentInquiryId = id;

    // 모달에 데이터 채우기
    document.getElementById('inquiryDate').textContent = formatDate(inquiry.date);
    document.getElementById('inquiryName').textContent = inquiry.name;
    document.getElementById('inquiryEmail').textContent = inquiry.email;
    document.getElementById('inquirySubject').textContent = inquiry.subject;
    document.getElementById('inquiryMessage').textContent = inquiry.message;

    // 읽음 처리
    if (!inquiry.read) {
        inquiry.read = true;
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        updateInquiriesBadge();
    }

    // 모달 표시
    document.getElementById('inquiryModal').style.display = 'block';
}

// 모달 닫기
function closeInquiryModal() {
    document.getElementById('inquiryModal').style.display = 'none';
    currentInquiryId = null;
    loadInquiries(); // 목록 새로고침
}

// 읽음 처리
function markAsRead(id) {
    let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const inquiry = inquiries.find(i => i.id === id);

    if (inquiry) {
        inquiry.read = true;
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        loadInquiries();
    }
}

// 모두 읽음 처리
function markAllAsRead() {
    if (confirm('모든 문의를 읽음 처리하시겠습니까?')) {
        let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        inquiries.forEach(i => i.read = true);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        loadInquiries();
    }
}

// 목록에서 삭제
function deleteInquiryFromList(id) {
    if (confirm('이 문의를 삭제하시겠습니까?')) {
        let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        loadInquiries();
    }
}

// 모달에서 삭제
function deleteInquiry() {
    if (!currentInquiryId) return;

    if (confirm('이 문의를 삭제하시겠습니까?')) {
        let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        inquiries = inquiries.filter(i => i.id !== currentInquiryId);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        closeInquiryModal();
    }
}

// 전체 삭제
function deleteAllInquiries() {
    if (confirm('모든 접수 내역을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!')) {
        if (confirm('정말로 삭제하시겠습니까?')) {
            localStorage.removeItem('inquiries');
            loadInquiries();
        }
    }
}

// 답장하기
function replyToInquiry() {
    const email = document.getElementById('inquiryEmail').textContent;
    const subject = document.getElementById('inquirySubject').textContent;

    // 기본 메일 클라이언트로 열기
    window.location.href = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
}

// ============================================
// 브랜딩 설정
// ============================================

function loadBranding() {
    const saved = localStorage.getItem('brandingData');
    if (saved) {
        brandingData = JSON.parse(saved);
    } else {
        brandingData = {
            logoTextSingle: '사진작가',
            logoTextLine1: '사진',
            logoTextLine2: '작가'
        };
    }

    // 폼에 데이터 채우기
    document.getElementById('logoTextSingle').value = brandingData.logoTextSingle || '사진작가';
    document.getElementById('logoTextLine1').value = brandingData.logoTextLine1 || '사진';
    document.getElementById('logoTextLine2').value = brandingData.logoTextLine2 || '작가';
}

function saveBranding() {
    brandingData = {
        logoTextSingle: document.getElementById('logoTextSingle').value,
        logoTextLine1: document.getElementById('logoTextLine1').value,
        logoTextLine2: document.getElementById('logoTextLine2').value
    };

    try {
        localStorage.setItem('brandingData', JSON.stringify(brandingData));
        console.log('✅ 브랜딩 설정 저장 완료');
        alert('브랜딩 설정이 저장되었습니다!');
    } catch (e) {
        console.error('브랜딩 저장 실패:', e);
        alert('저장 중 오류가 발생했습니다.');
    }
}
