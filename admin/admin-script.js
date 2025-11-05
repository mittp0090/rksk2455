// 관리자 페이지 JavaScript

// 기본 데이터 구조
let portfolioData = [];
let textData = {};
let contactData = {};
let awardsData = [];
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
    loadTextData();
    loadContactData();
    loadAwards();
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
    document.getElementById('editImageUrl').value = item.imageUrl;
    document.getElementById('editSize').value = item.size;

    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    if (currentEditIndex >= 0) {
        portfolioData[currentEditIndex] = {
            category: document.getElementById('editCategory').value,
            title: document.getElementById('editTitle').value,
            imageUrl: document.getElementById('editImageUrl').value,
            size: document.getElementById('editSize').value
        };

        savePortfolioData();
        renderPortfolio();
        closeModal();
        alert('저장되었습니다!');
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
    currentEditIndex = -1;
}

function savePortfolioData() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// ============================================
// 텍스트 편집
// ============================================

function loadTextData() {
    document.getElementById('aboutLead').value = textData.aboutLead || '';
    document.getElementById('aboutText1').value = textData.aboutText1 || '';
    document.getElementById('aboutText2').value = textData.aboutText2 || '';
}

function saveTexts() {
    textData = {
        aboutLead: document.getElementById('aboutLead').value,
        aboutText1: document.getElementById('aboutText1').value,
        aboutText2: document.getElementById('aboutText2').value
    };

    localStorage.setItem('textData', JSON.stringify(textData));
    alert('저장되었습니다!');
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
    alert('✅ 모든 데이터가 저장되었습니다!');
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
    if (confirm('⚠️ 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다!')) {
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
    if (event.target === modal) {
        closeModal();
    }
}
