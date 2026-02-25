// 메인 페이지 JavaScript

// FAQ 아코디언
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 현재 열려있는 항목인지 확인
            const isActive = item.classList.contains('active');
            
            // 모든 항목 닫기
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // 현재 항목이 닫혀있었다면 열기
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // 네비게이션 로그인 상태 확인
    checkLoginStatus();
    
    // 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#contact') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// 로그인 상태 확인
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authMenu = document.querySelector('.auth-menu');
    
    if (user && authMenu) {
        authMenu.innerHTML = `
            <a href="dashboard.html" class="btn-login">
                <i class="fas fa-tachometer-alt"></i> 대시보드
            </a>
        `;
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// 스크롤 시 네비게이션 스타일 변경
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});