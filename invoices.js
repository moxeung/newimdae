// 세금계산서 페이지 JavaScript

let currentPage = 1;
const itemsPerPage = 10;
let filteredInvoices = [];

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 확인
    checkAuth();
    
    // 사용자 정보 표시 (dashboard.js 함수 재사용)
    displayUserInfo();
    
    // 샘플 데이터 로드
    loadInvoices();
    
    // 필터 이벤트 리스너
    document.getElementById('periodFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('searchInput')?.addEventListener('input', applyFilters);
    
    // 모바일 메뉴
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleSidebar);
    }
});

// 세금계산서 로드
function loadInvoices() {
    const invoices = JSON.parse(localStorage.getItem('sampleInvoices') || '[]');
    
    // 더 많은 샘플 데이터 생성 (페이지네이션 테스트용)
    const extendedInvoices = [];
    for (let i = 0; i < 3; i++) {
        invoices.forEach((invoice, index) => {
            extendedInvoices.push({
                ...invoice,
                id: invoice.id + (i * 100) + index,
                date: adjustDate(invoice.date, -i * 30)
            });
        });
    }
    
    filteredInvoices = extendedInvoices;
    displayInvoices();
}

// 날짜 조정 (샘플 데이터용)
function adjustDate(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// 세금계산서 표시
function displayInvoices() {
    const tableBody = document.getElementById('invoicesTable');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageInvoices = filteredInvoices.slice(startIndex, endIndex);
    
    if (pageInvoices.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>세금계산서 내역이 없습니다</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = pageInvoices.map((invoice, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>${invoice.date}</td>
            <td>${invoice.client}</td>
            <td>${invoice.businessNumber}</td>
            <td>${formatCurrency(invoice.supplyAmount)}</td>
            <td>${formatCurrency(invoice.tax)}</td>
            <td><strong>${formatCurrency(invoice.supplyAmount + invoice.tax)}</strong></td>
            <td><span class="status-badge ${getStatusClass(invoice.status)}">${invoice.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="viewInvoice(${invoice.id})">
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
    const periodFilter = document.getElementById('periodFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase();
    
    const allInvoices = JSON.parse(localStorage.getItem('sampleInvoices') || '[]');
    
    // 확장 데이터 생성
    const extendedInvoices = [];
    for (let i = 0; i < 3; i++) {
        allInvoices.forEach((invoice, index) => {
            extendedInvoices.push({
                ...invoice,
                id: invoice.id + (i * 100) + index,
                date: adjustDate(invoice.date, -i * 30)
            });
        });
    }
    
    filteredInvoices = extendedInvoices.filter(invoice => {
        // 기간 필터
        if (periodFilter && periodFilter !== 'all') {
            const invoiceDate = new Date(invoice.date);
            const now = new Date();
            
            if (periodFilter === 'thisMonth') {
                if (invoiceDate.getMonth() !== now.getMonth() || invoiceDate.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            } else if (periodFilter === 'lastMonth') {
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                if (invoiceDate.getMonth() !== lastMonth.getMonth() || invoiceDate.getFullYear() !== lastMonth.getFullYear()) {
                    return false;
                }
            } else if (periodFilter === 'thisYear') {
                if (invoiceDate.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            }
        }
        
        // 상태 필터
        if (statusFilter && statusFilter !== 'all') {
            if (invoice.status !== statusFilter) {
                return false;
            }
        }
        
        // 검색 필터
        if (searchQuery) {
            if (!invoice.client.toLowerCase().includes(searchQuery)) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    displayInvoices();
}

// 페이지네이션 업데이트
function updatePagination() {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;
    
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    
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
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const pageNum = i;
        html += `<button onclick="changePage(${pageNum})" ${currentPage === pageNum ? 'class="active"' : ''}>
            ${pageNum}
        </button>`;
    }
    
    if (totalPages > 5) {
        html += `<button disabled>...</button>`;
        html += `<button onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'class="active"' : ''}>
            ${totalPages}
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
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayInvoices();
    
    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 세금계산서 상세보기
function viewInvoice(id) {
    alert(`세금계산서 상세보기 (ID: ${id})\n\n이 기능은 데모 버전에서 구현되지 않았습니다.`);
}

// 공통 함수들 (dashboard.js와 동일)
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