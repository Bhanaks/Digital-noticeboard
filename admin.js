// ========================================
// ADMIN DASHBOARD JAVASCRIPT
// ========================================

let editingNoticeTitle = null;

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
  
  // Check if expiry date is valid
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
    updateStatistics();
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

// Clear all notices
function clearAllNotices() {
  if (confirm('⚠️ WARNING: This will permanently delete ALL notices. Are you absolutely sure?')) {
    if (confirm('This action cannot be undone. Click OK to proceed.')) {
      localStorage.removeItem('notices');
      showAlert('All notices have been deleted!', 'success');
      displayNotices();
      updateStatistics();
    }
  }
}

// Display all notices
function displayNotices() {
  const notices = getAllNotices();
  const categoryFilter = document.getElementById('categoryFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const noticeList = document.getElementById('noticeList');
  
  if (!noticeList) {
    console.error('Notice list element not found');
    return;
  }
  
  const categoryValue = categoryFilter ? categoryFilter.value : 'All';
  const priorityValue = priorityFilter ? priorityFilter.value : 'All';
  
  const filteredNotices = filterNotices(notices, categoryValue, priorityValue);
  
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

// Create notice card with admin actions (edit & delete)
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
      <div class="notice-actions">
        <button class="btn-edit" data-notice='${JSON.stringify(notice)}'>
          ✏️ Edit
        </button>
        <button class="btn-delete" data-title="${escapeHtml(notice.title)}">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners using data attributes
  const editBtn = card.querySelector('.btn-edit');
  const deleteBtn = card.querySelector('.btn-delete');
  
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      const noticeData = JSON.parse(this.getAttribute('data-notice'));
      openEditModal(noticeData);
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      const title = this.getAttribute('data-title');
      deleteNotice(title);
    });
  }
  
  return card;
}

// Open edit modal
function openEditModal(notice) {
  editingNoticeTitle = notice.title;
  
  document.getElementById('editTitle').value = notice.title;
  document.getElementById('editContent').value = notice.content;
  document.getElementById('editExpiry').value = notice.expiry;
  document.getElementById('editCategory').value = notice.category;
  document.getElementById('editPriority').value = notice.priority;
  
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.classList.add('active');
  }
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.classList.remove('active');
  }
  editingNoticeTitle = null;
}

// Save edited notice
function saveEdit() {
  const title = document.getElementById('editTitle').value.trim();
  const content = document.getElementById('editContent').value.trim();
  const expiry = document.getElementById('editExpiry').value;
  const category = document.getElementById('editCategory').value;
  const priority = document.getElementById('editPriority').value;
  
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
  
  const expiryDate = new Date(expiry);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  
  if (expiryDate < today) {
    showAlert('Expiry date must be today or a future date!', 'error');
    return;
  }
  
  let notices = getAllNotices();
  const noticeIndex = notices.findIndex(function(n) {
    return n.title === editingNoticeTitle;
  });
  
  if (noticeIndex !== -1) {
    notices[noticeIndex] = {
      title: title,
      content: content,
      expiry: expiry,
      category: category,
      priority: priority,
      posted: notices[noticeIndex].posted // Keep original posted date
    };
    
    if (saveNotices(notices)) {
      showAlert('Notice updated successfully!', 'success');
      closeEditModal();
      displayNotices();
      updateStatistics();
    }
  } else {
    showAlert('Notice not found!', 'error');
  }
}

// Delete notice
function deleteNotice(title) {
  if (confirm('Are you sure you want to delete this notice?')) {
    let notices = getAllNotices();
    const originalLength = notices.length;
    notices = notices.filter(function(notice) {
      return notice.title !== title;
    });
    
    if (notices.length < originalLength) {
      if (saveNotices(notices)) {
        showAlert('Notice deleted successfully!', 'success');
        displayNotices();
        updateStatistics();
      }
    } else {
      showAlert('Notice not found!', 'error');
    }
  }
}

// Update statistics dashboard
function updateStatistics() {
  const notices = getAllNotices();
  
  const highCount = notices.filter(function(n) {
    return n.priority === 'high';
  }).length;
  
  const mediumCount = notices.filter(function(n) {
    return n.priority === 'medium';
  }).length;
  
  const lowCount = notices.filter(function(n) {
    return n.priority === 'low';
  }).length;
  
  const totalCount = notices.length;
  
  const highElement = document.getElementById('highCount');
  const mediumElement = document.getElementById('mediumCount');
  const lowElement = document.getElementById('lowCount');
  const totalElement = document.getElementById('totalCount');
  
  if (highElement) highElement.textContent = highCount;
  if (mediumElement) mediumElement.textContent = mediumCount;
  if (lowElement) lowElement.textContent = lowCount;
  if (totalElement) totalElement.textContent = totalCount;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    closeEditModal();
  }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  console.log('Admin dashboard loaded');
  displayNotices();
  updateStatistics();
});