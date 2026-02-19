// ========================================
// STUDENT DASHBOARD JAVASCRIPT
// ========================================

// Display all notices for students
function displayNotices() {
  const notices = getAllNotices();
  const categoryFilter = document.getElementById('categoryFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const noticeList = document.getElementById('noticeList');
  const noticeCount = document.getElementById('noticeCount');
  
  if (!noticeList) {
    console.error('Notice list element not found');
    return;
  }
  
  const categoryValue = categoryFilter ? categoryFilter.value : 'All';
  const priorityValue = priorityFilter ? priorityFilter.value : 'All';
  
  const filteredNotices = filterNotices(notices, categoryValue, priorityValue);
  
  if (noticeCount) {
    noticeCount.textContent = filteredNotices.length;
  }
  
  noticeList.innerHTML = '';
  
  if (filteredNotices.length === 0) {
    noticeList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>No Notices Available</h3>
        <p>There are no active notices matching your filters at the moment.</p>
      </div>
    `;
    return;
  }
  
  filteredNotices.forEach(function(notice) {
    const card = createNoticeCard(notice);
    noticeList.appendChild(card);
  });
}

// Create notice card HTML element (Student view - no actions)
function createNoticeCard(notice) {
  const card = document.createElement('div');
  card.className = 'notice-card';
  
  const priorityBarClass = getPriorityClass(notice.priority);
  const priorityBadgeClass = getPriorityBadgeClass(notice.priority);
  const priorityLabel = getPriorityLabel(notice.priority);
  
  card.innerHTML = `
    <div class="priority-bar ${priorityBarClass}"></div>
    <div class="notice-content">
      <div class="notice-header">
        <h3 class="notice-title">${escapeHtml(notice.title)}</h3>
        <span class="priority-badge ${priorityBadgeClass}">${priorityLabel}</span>
      </div>
      <span class="category-tag">📂 ${escapeHtml(notice.category)}</span>
      <p class="notice-text">${escapeHtml(notice.content)}</p>
      <div class="notice-meta">
        <div class="meta-item">
          <span>📅 Posted: ${formatDate(notice.posted)}</span>
        </div>
        <div class="meta-item">
          <span>⏰ Expires: ${formatDate(notice.expiry)}</span>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  console.log('Student dashboard loaded');
  displayNotices();
});