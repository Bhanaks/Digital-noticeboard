// ========================================
// COMMON UTILITY FUNCTIONS
// ========================================

// Show alert message with animation
function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());
  
  const alertDiv = document.createElement('div');
  alertDiv.className = 'custom-alert';
  alertDiv.textContent = message;
  
  // Set styles based on type
  let backgroundColor = '';
  if (type === 'success') {
    backgroundColor = 'linear-gradient(135deg, #56ab2f, #a8e063)';
  } else if (type === 'error') {
    backgroundColor = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
  } else {
    backgroundColor = 'linear-gradient(135deg, #667eea, #764ba2)';
  }
  
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    background: ${backgroundColor};
    color: white;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
}

// Get all notices from localStorage
function getAllNotices() {
  try {
    const notices = JSON.parse(localStorage.getItem('notices')) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter out expired notices
    const activeNotices = notices.filter(notice => {
      const expiryDate = new Date(notice.expiry);
      expiryDate.setHours(0, 0, 0, 0);
      return expiryDate >= today;
    });
    
    // Update localStorage with only active notices
    if (activeNotices.length !== notices.length) {
      localStorage.setItem('notices', JSON.stringify(activeNotices));
    }
    
    return activeNotices;
  } catch (error) {
    console.error('Error getting notices:', error);
    return [];
  }
}

// Save notices to localStorage
function saveNotices(notices) {
  try {
    localStorage.setItem('notices', JSON.stringify(notices));
    return true;
  } catch (error) {
    console.error('Error saving notices:', error);
    showAlert('Error saving notice. Please try again.', 'error');
    return false;
  }
}

// Format date for display
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return dateString;
  }
}

// Get priority color class
function getPriorityClass(priority) {
  const classes = {
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low'
  };
  return classes[priority] || 'priority-medium';
}

// Get priority badge class
function getPriorityBadgeClass(priority) {
  const classes = {
    'high': 'badge-high',
    'medium': 'badge-medium',
    'low': 'badge-low'
  };
  return classes[priority] || 'badge-medium';
}

// Get priority label with emoji
function getPriorityLabel(priority) {
  const labels = {
    'high': '🔴 High',
    'medium': '🟡 Medium',
    'low': '🟢 Low'
  };
  return labels[priority] || '🟡 Medium';
}

// Sort notices by priority (high -> medium -> low)
function sortNoticesByPriority(notices) {
  const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
  return notices.sort((a, b) => {
    const orderA = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 1;
    const orderB = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 1;
    return orderA - orderB;
  });
}

// Filter notices by category and priority
function filterNotices(notices, category, priority) {
  let filtered = [...notices];
  
  if (category && category !== 'All') {
    filtered = filtered.filter(notice => notice.category === category);
  }
  
  if (priority && priority !== 'All') {
    filtered = filtered.filter(notice => notice.priority === priority);
  }
  
  return sortNoticesByPriority(filtered);
}

// Set minimum date for expiry date input (today)
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.setAttribute('min', today);
  }
  const editExpiryInput = document.getElementById('editExpiry');
  if (editExpiryInput) {
    editExpiryInput.setAttribute('min', today);
  }
}

// Initialize demo notices (run once on first load)
function initializeDemoNotices() {
  const notices = getAllNotices();
  
  if (notices.length === 0) {
    const today = new Date();
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 15);
    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 22);
    const futureDate3 = new Date(today);
    futureDate3.setDate(today.getDate() + 35);
    const futureDate4 = new Date(today);
    futureDate4.setDate(today.getDate() + 10);
    const futureDate5 = new Date(today);
    futureDate5.setDate(today.getDate() + 28);
    
    const demoNotices = [
      {
        title: 'Mid-Semester Examinations - Schedule Released',
        content: 'The mid-semester examination schedule has been released. Exams will be conducted from December 5-12, 2024. Please check the department notice board for detailed timings and examination halls. Students must carry their ID cards and hall tickets.',
        expiry: futureDate1.toISOString().split('T')[0],
        category: 'Exam',
        priority: 'high',
        posted: new Date().toISOString()
      },
      {
        title: 'Annual Technical Symposium 2024',
        content: 'Our department is organizing the Annual Technical Symposium on December 20-21, 2024. Students are encouraged to participate in various technical events, paper presentations, and project exhibitions. Registration is open now!',
        expiry: futureDate2.toISOString().split('T')[0],
        category: 'Event',
        priority: 'medium',
        posted: new Date().toISOString()
      },
      {
        title: 'Winter Break - Holiday Notice',
        content: 'The department will remain closed for winter break from December 23, 2024 to January 2, 2025. Regular classes will resume on January 3, 2025. Have a wonderful holiday season!',
        expiry: futureDate3.toISOString().split('T')[0],
        category: 'Holiday',
        priority: 'low',
        posted: new Date().toISOString()
      },
      {
        title: 'Guest Lecture on Artificial Intelligence',
        content: 'A guest lecture on "Recent Advances in Artificial Intelligence" by Dr. John Smith from MIT will be held on December 8, 2024, at 2:00 PM in the main auditorium. All students are cordially invited to attend.',
        expiry: futureDate4.toISOString().split('T')[0],
        category: 'Event',
        priority: 'medium',
        posted: new Date().toISOString()
      },
      {
        title: 'Library Resource Update',
        content: 'New research journals and technical books have been added to the department library. Students can access these resources during library hours (9 AM - 6 PM). Please maintain silence in the library premises.',
        expiry: futureDate5.toISOString().split('T')[0],
        category: 'General',
        priority: 'low',
        posted: new Date().toISOString()
      }
    ];
    
    saveNotices(demoNotices);
  }
}

// Add CSS animations dynamically
function addAnimationStyles() {
  if (!document.getElementById('custom-animations')) {
    const style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    initializeDemoNotices();
    setMinDate();
    addAnimationStyles();
  });
}