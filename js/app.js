// ============================================================
// 발주단가 관리 시스템 - 공통 API 유틸리티
// ============================================================

// ── API 호출 ────────────────────────────────────────────────
async function apiGet(action, params = {}) {
  const url = new URL(CONFIG.API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null) url.searchParams.set(k, v); });
  showSpinner();
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  } catch (e) {
    showToast('API 연결 실패: ' + e.message, 'error');
    return { success: false, message: e.message };
  } finally {
    hideSpinner();
  }
}

async function apiPost(action, body = {}) {
  showSpinner();
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body })
    });
    const data = await res.json();
    return data;
  } catch (e) {
    showToast('API 연결 실패: ' + e.message, 'error');
    return { success: false, message: e.message };
  } finally {
    hideSpinner();
  }
}

// ── 스피너 ────────────────────────────────────────────────
function showSpinner() {
  const el = document.getElementById('globalSpinner');
  if (el) el.classList.remove('hidden');
}
function hideSpinner() {
  const el = document.getElementById('globalSpinner');
  if (el) el.classList.add('hidden');
}

// ── 토스트 ────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-blue-600'
  };
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm shadow-lg transform transition-all duration-300 translate-x-full ${colors[type] || colors.info}`;
  toast.innerHTML = `<span class="font-bold text-base">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
  });
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── 숫자 포맷 ────────────────────────────────────────────────
function formatNumber(n) {
  if (n === null || n === undefined || n === '') return '-';
  return Number(n).toLocaleString('ko-KR');
}

function formatPrice(n) {
  if (n === null || n === undefined || n === '') return '-';
  return '₩' + Number(n).toLocaleString('ko-KR');
}

function formatRate(rate) {
  const r = Number(rate);
  if (isNaN(r)) return '-';
  const sign = r > 0 ? '+' : '';
  return `${sign}${r.toFixed(2)}%`;
}

function rateHtml(rate) {
  const r = Number(rate);
  if (isNaN(r) || r === 0) return `<span class="text-gray-500">0.00%</span>`;
  if (r > 0) return `<span class="text-red-600 font-semibold">▲ +${r.toFixed(2)}%</span>`;
  return `<span class="text-blue-600 font-semibold">▼ ${r.toFixed(2)}%</span>`;
}

// ── 날짜 ────────────────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// ── 빈 상태 ────────────────────────────────────────────────
function emptyRow(colspan, msg = '데이터가 없습니다.') {
  return `<tr><td colspan="${colspan}" class="px-4 py-10 text-center text-gray-400 text-sm">${msg}</td></tr>`;
}

// ── 사이드바 활성 메뉴 ────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(el => {
    const target = el.getAttribute('data-nav');
    if (path === target || (path === '' && target === 'index.html')) {
      el.classList.add('bg-white/20', 'text-white');
      el.classList.remove('text-white/70', 'hover:bg-white/10');
    }
  });
}

// ── 모바일 사이드바 토글 ──────────────────────────────────
function initSidebar() {
  const btn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      overlay && overlay.classList.toggle('hidden');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar && sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    });
  }
  setActiveNav();
}

document.addEventListener('DOMContentLoaded', initSidebar);
