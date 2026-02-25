// 인증 관련 JavaScript (로그인/회원가입)

// 데모 계정 정보
const DEMO_ACCOUNT = {
    email: 'demo@imdaetax.com',
    password: 'demo1234',
    name: '홍길동',
    phone: '010-1234-5678'
};

// 로그인 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 로그인 상태 확인
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
});

// 로그인 처리
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 데모 계정 확인
    if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
        const userData = {
            email: DEMO_ACCOUNT.email,
            name: DEMO_ACCOUNT.name,
            phone: DEMO_ACCOUNT.phone,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showMessage('success', '로그인 성공! 대시보드로 이동합니다...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // 저장된 사용자 확인
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userData = {
                email: user.email,
                name: user.name,
                phone: user.phone,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            showMessage('success', '로그인 성공! 대시보드로 이동합니다...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage('error', '이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }
}

// 회원가입 처리
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // 유효성 검사
    if (!agreeTerms) {
        showMessage('error', '이용약관에 동의해주세요.');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('error', '비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (password.length < 8) {
        showMessage('error', '비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    // 기존 사용자 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showMessage('error', '이미 등록된 이메일입니다.');
        return;
    }
    
    // 새 사용자 추가
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('success', '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// 비밀번호 표시/숨김 토글
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId || 'password');
    const button = field.nextElementSibling || field.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// 메시지 표시
function showMessage(type, message) {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    
    if (type === 'error') {
        errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    } else if (type === 'success') {
        successMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
    }
    
    // 5초 후 메시지 숨김
    setTimeout(() => {
        if (errorMsg) errorMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    }, 5000);
}