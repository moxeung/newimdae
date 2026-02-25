// 프로필 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인
    checkAuth();
    
    // 사용자 정보 로드
    loadUserProfile();
    
    // 폼 이벤트 리스너
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('passwordForm')?.addEventListener('submit', handlePasswordChange);
    
    // 모바일 메뉴
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }
});

// 사용자 프로필 로드
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // 기본 정보 입력
    document.getElementById('name').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    
    // 추가 정보가 있다면 입력
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    if (userDetails[currentUser.email]) {
        const details = userDetails[currentUser.email];
        document.getElementById('businessNumber').value = details.businessNumber || '';
        document.getElementById('businessName').value = details.businessName || '';
        document.getElementById('address').value = details.address || '';
    }
}

// 프로필 업데이트 처리
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const businessNumber = document.getElementById('businessNumber').value;
    const businessName = document.getElementById('businessName').value;
    const address = document.getElementById('address').value;
    
    // 현재 사용자 정보 업데이트
    currentUser.name = name;
    currentUser.phone = phone;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // 추가 정보 저장
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    userDetails[currentUser.email] = {
        businessNumber,
        businessName,
        address,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    
    // 등록된 사용자 목록도 업데이트
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].phone = phone;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    alert('프로필이 성공적으로 업데이트되었습니다.');
}

// 비밀번호 변경 처리
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 비밀번호 확인 검증
    if (newPassword !== confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 비밀번호 길이 검증
    if (newPassword.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    // 데모 계정인 경우
    if (currentUser.email === 'demo@imdaetax.com') {
        alert('데모 계정의 비밀번호는 변경할 수 없습니다.');
        return;
    }
    
    // 등록된 사용자 목록에서 현재 비밀번호 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === currentUser.email);
    
    if (!user) {
        alert('사용자 정보를 찾을 수 없습니다.');
        return;
    }
    
    if (user.password !== currentPassword) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
    }
    
    // 비밀번호 업데이트
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // 폼 초기화
    document.getElementById('passwordForm').reset();
    
    alert('비밀번호가 성공적으로 변경되었습니다.');
}

// 공통 함수들
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}