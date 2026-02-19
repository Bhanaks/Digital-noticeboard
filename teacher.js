// ========================================
// TEACHER DASHBOARD JAVASCRIPT
// ========================================

// Add new notice
function addNotice() {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const expiry = document.getElementById('expiry').value;
  const category = document.getElementById('category').value;
  const priority = document.getElementById('priority').value;
  
  // Validation
  if (!title) {
    showAlert('Please enter a notice title!', 'error');
    return;
  }
  
  if (!content) {
    showAlert('Please enter notice content!', 'error');
    return;
  }
  
  if (!expiry) {
    showAlert('Please select an expiry date!', 'error');
    return;
  }
  
  // Check if expiry date is in the future
  const expiryDate = new Date(expiry);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  if (expiryDate < today) {
    showAlert('Expiry date must be today or a future date!', 'error');
    return;
  }
  
  const newNotice = {
    title: title,
    content: content,
    expiry: expiry,
    category: category,
    priority: priority,
    posted: new Date().toISOString()
  };
  
  const notices = getAllNotices();
  notices.push(newNotice);
  
  if (saveNotices(notices)) {
    showAlert('Notice published successfully!', 'success');
    clearForm();
    displayNotices();
  }
}

// Clear form
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('expiry').value = '';
  document.getElementById('category').value = 'Exam';
  document.getElementById('priority').value = 'medium';
}

// Display all notices
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
        <p>There are no active notices matching your filters. Create a new notice to get started!</p>
      </div>
    `;
    return;
  }
  
  filteredNotices.forEach(function(notice) {
    const card = createNoticeCard(notice);
    noticeList.appendChild(card);
  });
}

// Create notice card with delete action
function createNoticeCard(notice) {
  const card = document.createElement('div');
  card.className = 'notice-card';
  
  const priorityBarClass = getPriorityClass(notice.priority);
  const priorityBadgeClass = getPriorityBadgeClass(notice.priority);
  const priorityLabel = getPriorityLabel(notice.priority);
  
  // Escape special characters for onclick attribute
  const safeTitle = notice.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  
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
      <div class="notice-actions">
        <button class="btn-delete" onclick="deleteNotice('${safeTitle}')">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Delete notice
function deleteNotice(title) {
  // Unescape the title
  const actualTitle = title.replace(/\\'/g, "'");
  
  if (confirm('Are you sure you want to delete this notice?')) {
    let notices = getAllNotices();
    const originalLength = notices.length;
    notices = notices.filter(function(notice) {
      return notice.title !== actualTitle;
    });
    
    if (notices.length < originalLength) {
      if (saveNotices(notices)) {
        showAlert('Notice deleted successfully!', 'success');
        displayNotices();
      }
    } else {
      showAlert('Notice not found!', 'error');
    }
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  console.log('Teacher dashboard loaded');
  displayNotices();
});