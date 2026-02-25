// 대시보드 JavaScript

// 샘플 데이터
const sampleInvoices = [
    { id: 1, date: '2024-11-15', client: '(주)서울부동산', businessNumber: '123-45-67890', supplyAmount: 10000000, tax: 1000000, status: '발행완료' },
    { id: 2, date: '2024-11-10', client: '강남빌딩관리', businessNumber: '234-56-78901', supplyAmount: 5000000, tax: 500000, status: '발행완료' },
    { id: 3, date: '2024-11-05', client: '명동상가', businessNumber: '345-67-89012', supplyAmount: 8000000, tax: 800000, status: '처리중' },
    { id: 4, date: '2024-10-28', client: '신촌오피스텔', businessNumber: '456-78-90123', supplyAmount: 12000000, tax: 1200000, status: '발행완료' },
    { id: 5, date: '2024-10-20', client: '홍대임대사업', businessNumber: '567-89-01234', supplyAmount: 6000000, tax: 600000, status: '발행완료' }
];

const sampleVATReturns = [
    { period: '2024년 2기 (7~12월)', salesTax: 15000000, purchaseTax: 5000000, paymentTax: 10000000, refundTax: 0, deadline: '2025-01-25', paymentDeadline: '2025-01-25', status: '신고완료' },
    { period: '2024년 1기 (1~6월)', salesTax: 18000000, purchaseTax: 7000000, paymentTax: 11000000, refundTax: 0, deadline: '2024-07-25', paymentDeadline: '2024-07-25', status: '납부완료' },
    { period: '2023년 2기 (7~12월)', salesTax: 14000000, purchaseTax: 6000000, paymentTax: 8000000, refundTax: 0, deadline: '2024-01-25', paymentDeadline: '2024-01-25', status: '납부완료' }
];

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인
    checkAuth();
    
    // 사용자 정보 표시
    displayUserInfo();
    
    // 통계 업데이트
    updateStatistics();
    
    // 최근 세금계산서 표시
    displayRecentInvoices();
    
    // 부가세 신고 현황 표시
    displayVATReturns();
    
    // 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }
});

// 로그인 확인
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

// 사용자 정보 표시
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        
        if (userNameEl) userNameEl.textContent = currentUser.name || '사용자';
        if (userEmailEl) userEmailEl.textContent = currentUser.email || '';
    }
}

// 통계 업데이트
function updateStatistics() {
    const totalInvoices = sampleInvoices.length;
    const approvedInvoices = sampleInvoices.filter(inv => inv.status === '발행완료').length;
    const pendingInvoices = sampleInvoices.filter(inv => inv.status === '처리중').length;
    const totalAmount = sampleInvoices.reduce((sum, inv) => sum + inv.supplyAmount + inv.tax, 0);
    
    const totalInvoicesEl = document.getElementById('totalInvoices');
    const approvedInvoicesEl = document.getElementById('approvedInvoices');
    const pendingInvoicesEl = document.getElementById('pendingInvoices');
    const totalAmountEl = document.getElementById('totalAmount');
    
    if (totalInvoicesEl) totalInvoicesEl.textContent = totalInvoices;
    if (approvedInvoicesEl) approvedInvoicesEl.textContent = approvedInvoices;
    if (pendingInvoicesEl) pendingInvoicesEl.textContent = pendingInvoices;
    if (totalAmountEl) totalAmountEl.textContent = formatCurrency(totalAmount);
}

// 최근 세금계산서 표시
function displayRecentInvoices() {
    const tableBody = document.getElementById('recentInvoicesTable');
    if (!tableBody) return;
    
    const recentInvoices = sampleInvoices.slice(0, 5);
    
    if (recentInvoices.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>최근 세금계산서가 없습니다</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = recentInvoices.map(invoice => `
        <tr>
            <td>${invoice.date}</td>
            <td>${invoice.client}</td>
            <td>${formatCurrency(invoice.supplyAmount)}</td>
            <td>${formatCurrency(invoice.tax)}</td>
            <td><strong>${formatCurrency(invoice.supplyAmount + invoice.tax)}</strong></td>
            <td><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status}</span></td>
        </tr>
    `).join('');
}

// 부가세 신고 현황 표시
function displayVATReturns() {
    const tableBody = document.getElementById('vatReturnsTable');
    if (!tableBody) return;
    
    const recentReturns = sampleVATReturns.slice(0, 3);
    
    if (recentReturns.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>부가세 신고 내역이 없습니다</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = recentReturns.map(vat => `
        <tr>
            <td>${vat.period}</td>
            <td>${formatCurrency(vat.salesTax)}</td>
            <td>${formatCurrency(vat.purchaseTax)}</td>
            <td><strong>${formatCurrency(vat.paymentTax)}</strong></td>
            <td>${vat.deadline}</td>
            <td><span class="status-badge ${getStatusClass(vat.status)}">${vat.status}</span></td>
        </tr>
    `).join('');
}

// 통화 포맷
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

// 상태 클래스 반환
function getStatusClass(status) {
    const statusMap = {
        '발행완료': 'success',
        '신고완료': 'success',
        '납부완료': 'success',
        '처리중': 'warning',
        '미신고': 'error',
        '취소': 'error'
    };
    return statusMap[status] || '';
}

// 사이드바 토글 (모바일)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// 샘플 데이터를 localStorage에 저장 (다른 페이지에서 사용)
localStorage.setItem('sampleInvoices', JSON.stringify(sampleInvoices));
localStorage.setItem('sampleVATReturns', JSON.stringify(sampleVATReturns));