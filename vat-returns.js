// 부가세 신고 페이지 JavaScript

let currentPage = 1;
const itemsPerPage = 10;
let filteredReturns = [];

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인
    checkAuth();
    
    // 사용자 정보 표시
    displayUserInfo();
    
    // 샘플 데이터 로드
    loadVATReturns();
    
    // 필터 이벤트 리스너
    document.getElementById('yearFilter')?.addEventListener('change', applyFilters);
    document.getElementById('quarterFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    
    // 모바일 메뉴
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }
});

// 부가세 신고 데이터 로드
function loadVATReturns() {
    const returns = JSON.parse(localStorage.getItem('sampleVATReturns') || '[]');
    
    // 더 많은 샘플 데이터 생성
    const extendedReturns = [
        ...returns,
        { period: '2023년 1기 (1~6월)', salesTax: 16000000, purchaseTax: 6500000, paymentTax: 9500000, refundTax: 0, deadline: '2023-07-25', paymentDeadline: '2023-07-25', status: '납부완료' },
        { period: '2022년 2기 (7~12월)', salesTax: 13000000, purchaseTax: 5500000, paymentTax: 7500000, refundTax: 0, deadline: '2023-01-25', paymentDeadline: '2023-01-25', status: '납부완료' },
        { period: '2022년 1기 (1~6월)', salesTax: 15000000, purchaseTax: 7000000, paymentTax: 8000000, refundTax: 0, deadline: '2022-07-25', paymentDeadline: '2022-07-25', status: '납부완료' }
    ];
    
    filteredReturns = extendedReturns;
    displayVATReturns();
}

// 부가세 신고 표시
function displayVATReturns() {
    const tableBody = document.getElementById('vatReturnsTable');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageReturns = filteredReturns.slice(startIndex, endIndex);
    
    if (pageReturns.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>부가세 신고 내역이 없습니다</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = pageReturns.map(vat => `
        <tr>
            <td><strong>${vat.period}</strong></td>
            <td>${formatCurrency(vat.salesTax)}</td>
            <td>${formatCurrency(vat.purchaseTax)}</td>
            <td><strong>${formatCurrency(vat.paymentTax)}</strong></td>
            <td>${vat.refundTax > 0 ? formatCurrency(vat.refundTax) : '-'}</td>
            <td>${vat.deadline}</td>
            <td>${vat.paymentDeadline}</td>
            <td><span class="status-badge ${getStatusClass(vat.status)}">${vat.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewVATDetail('${vat.period}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // 페이지네이션 업데이트
    updatePagination();
}

// 필터 적용
function applyFilters() {
    const yearFilter = document.getElementById('yearFilter')?.value;
    const quarterFilter = document.getElementById('quarterFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    
    const allReturns = JSON.parse(localStorage.getItem('sampleVATReturns') || '[]');
    
    // 확장 데이터
    const extendedReturns = [
        ...allReturns,
        { period: '2023년 1기 (1~6월)', salesTax: 16000000, purchaseTax: 6500000, paymentTax: 9500000, refundTax: 0, deadline: '2023-07-25', paymentDeadline: '2023-07-25', status: '납부완료' },
        { period: '2022년 2기 (7~12월)', salesTax: 13000000, purchaseTax: 5500000, paymentTax: 7500000, refundTax: 0, deadline: '2023-01-25', paymentDeadline: '2023-01-25', status: '납부완료' },
        { period: '2022년 1기 (1~6월)', salesTax: 15000000, purchaseTax: 7000000, paymentTax: 8000000, refundTax: 0, deadline: '2022-07-25', paymentDeadline: '2022-07-25', status: '납부완료' }
    ];
    
    filteredReturns = extendedReturns.filter(vat => {
        // 년도 필터
        if (yearFilter && !vat.period.includes(yearFilter)) {
            return false;
        }
        
        // 기수 필터
        if (quarterFilter && quarterFilter !== 'all') {
            if (!vat.period.includes(`${quarterFilter}기`)) {
                return false;
            }
        }
        
        // 상태 필터
        if (statusFilter && statusFilter !== 'all') {
            if (vat.status !== statusFilter) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    displayVATReturns();
}

// 페이지네이션 업데이트
function updatePagination() {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // 이전 버튼
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changePage(${i})" ${currentPage === i ? 'class="active"' : ''}>
            ${i}
        </button>`;
    }
    
    // 다음 버튼
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    paginationEl.innerHTML = html;
}

// 페이지 변경
function changePage(page) {
    const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayVATReturns();
    
    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 부가세 신고 상세보기
function viewVATDetail(period) {
    alert(`부가세 신고 상세보기\n신고기간: ${period}\n\n이 기능은 데모 버전에서 구현되지 않았습니다.`);
}

// 공통 함수들
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        
        if (userNameEl) userNameEl.textContent = currentUser.name || '사용자';
        if (userEmailEl) userEmailEl.textContent = currentUser.email || '';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

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