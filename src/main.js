import { onAuthChange, logoutUser } from './services/auth';
import { getUserProfile, checkIsAdmin, listenToPublicNotifications } from './services/userService';

import { renderNavbar } from './components/navbar';
import { renderLanding } from './components/landing';
import { renderLoginForm, renderSignupForm, renderForgotPasswordForm } from './components/authForms';
import { renderDashboard } from './components/dashboard';
import { renderMaterialBrowser } from './components/materialBrowser';
import { renderAccountSettings } from './components/accountSettings';

let currentUser = null;
let currentUserProfile = null;
let isUserAdmin = false;
let currentView = 'landing';
let materialOptions = null;
let publicNotifs = [];
let unsubNotifs = null;

const appRoot = document.getElementById('app');

function initTheme() {
  const savedTheme = localStorage.getItem('bytestudy-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bytestudy-theme', next);
}

// Notification Logic
function getReadNotifs() {
  if (!currentUser) return [];
  const key = 'read_pub_notifs_' + currentUser.uid;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function markNotifAsRead(id) {
  if (!currentUser) return;
  const key = 'read_pub_notifs_' + currentUser.uid;
  const read = getReadNotifs();
  if (!read.includes(id)) {
    read.push(id);
    localStorage.setItem(key, JSON.stringify(read));
    updateBellCount();
  }
}

function startNotifListener() {
  if (unsubNotifs) unsubNotifs();
  unsubNotifs = listenToPublicNotifications((notes) => {
    publicNotifs = notes;
    updateBellCount();
    
    const notifModal = document.getElementById('public-notif-modal');
    if (notifModal && notifModal.style.display === 'flex') {
      renderNotifModalContent();
    }
  });
}

function updateBellCount() {
  const badge = document.getElementById('public-notif-badge');
  if (!badge || !currentUser) return;

  const readIds = getReadNotifs();
  let unreadCount = 0;

  publicNotifs.forEach(n => {
    if (n.authorUid === currentUser.uid || readIds.includes(n.id)) {
      return; 
    }
    unreadCount++;
  });

  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

function renderNotifModalContent() {
  const container = document.getElementById('public-notif-list');
  if (!container) return;
  
  const readIds = getReadNotifs();

  if (publicNotifs.length === 0) {
    container.innerHTML = '<div style="text-align:center; opacity:0.6; padding: 32px;">No announcements available.</div>';
    return;
  }

  let htmlString = '';
  publicNotifs.forEach(n => {
    const isAuthor = currentUser && (n.authorUid === currentUser.uid);
    const isRead = isAuthor || readIds.includes(n.id);
    const unreadDotHtml = !isRead ? '<div class="unread-dot"></div>' : '';
    const authorName = n.author || 'ByteStudy Admin';
    
    htmlString += `
      <div class="notif-card" data-id="${n.id}">
        <div class="notif-header">
          ${unreadDotHtml}
          <div class="notif-title">${n.title}</div>
          <div class="notif-author">By ${authorName}</div>
        </div>
        <div class="notif-body fade-text">${n.message}</div>
      </div>
    `;
  });
  
  container.innerHTML = htmlString;

  document.querySelectorAll('.notif-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      markNotifAsRead(id);
      
      const dot = card.querySelector('.unread-dot');
      if (dot) dot.remove();

      const body = card.querySelector('.notif-body');
      if (body) {
        body.classList.toggle('expanded');
      }
    });
  });
}

function init() {
  initTheme();
  
  onAuthChange(async (user) => {
    if (user) {
      currentUser = user;
      try {
        const [profile, adminStatus] = await Promise.all([
          getUserProfile(user.uid),
          checkIsAdmin(user.uid)
        ]);
        currentUserProfile = profile;
        isUserAdmin = adminStatus;
      } catch (e) {
        console.error('Error fetching user data:', e);
      }
      
      startNotifListener(); // Start listening when logged in

      if (['landing', 'login', 'signup'].includes(currentView)) {
        currentView = 'dashboard';
      }
    } else {
      currentUser = null;
      currentUserProfile = null;
      isUserAdmin = false;
      currentView = 'landing';
      if (unsubNotifs) {
        unsubNotifs();
        unsubNotifs = null;
      }
    }
    router();
  });
}

function router() {
  // Inject the modal wrapper natively for authenticated users
  let modalHtml = '';
  if (currentUser) {
    modalHtml = `
      <div class="modal-overlay" id="public-notif-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; padding:16px;">
        <div class="notif-modal-content" style="background:var(--card-bg, #fff); width:100%; max-width:600px; border-radius:8px; padding:24px; border:1px solid var(--border-color, #e2e8f0); max-height:90vh; display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:16px;">
            <h3 style="margin:0;">Announcements</h3>
            <button class="bs-btn bs-btn-secondary" id="close-public-notif" style="padding:0 12px; height:32px; border-radius:6px; cursor:pointer;">Close</button>
          </div>
          <div class="notif-list" id="public-notif-list" style="overflow-y:auto; display:flex; flex-direction:column; gap:12px; margin-top:16px; padding-right:8px;"></div>
        </div>
      </div>
    `;
  }

  appRoot.innerHTML = '<div id="nav-root"></div><div id="content-root"></div>' + modalHtml;
  
  const navRoot = document.getElementById('nav-root');
  const contentRoot = document.getElementById('content-root');

  // Attach modal close listener
  const closeBtn = document.getElementById('close-public-notif');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('public-notif-modal').style.display = 'none';
    });
  }

  // Define global open function so navbar can trigger it
  window.openNotificationsModal = () => {
    renderNotifModalContent();
    const modal = document.getElementById('public-notif-modal');
    if (modal) modal.style.display = 'flex';
  };

  renderNavbar(navRoot, currentUser, (target) => {
    if (target === 'toggle-theme') {
      toggleTheme();
      return;
    }
    if (target === 'logout') {
      logoutUser();
      return;
    }
    currentView = target;
    router();
  });

  // Re-run badge count after router injects elements
  setTimeout(updateBellCount, 50);

  switch (currentView) {
    case 'landing':
      renderLanding(contentRoot, (view) => { currentView = view; router(); });
      break;
    case 'login':
      renderLoginForm(contentRoot, (view) => { currentView = view; router(); });
      break;
    case 'signup':
      renderSignupForm(contentRoot, (view) => { currentView = view; router(); });
      break;
    case 'forgot':
      renderForgotPasswordForm(contentRoot, (view) => { currentView = view; router(); });
      break;
    case 'dashboard':
      if (!currentUser) { currentView = 'login'; router(); return; }
      renderDashboard(contentRoot, currentUserProfile, isUserAdmin, (opts) => {
        materialOptions = opts;
        currentView = 'browser';
        router();
      });
      break;
    case 'browser':
      if (!currentUser) { currentView = 'login'; router(); return; }
      renderMaterialBrowser(contentRoot, materialOptions, currentUserProfile, isUserAdmin, () => {
        currentView = 'dashboard';
        router();
      });
      break;
    case 'settings':
      if (!currentUser) { currentView = 'login'; router(); return; }
      renderAccountSettings(contentRoot, currentUserProfile, currentUser, () => {
        currentView = 'dashboard';
        router();
      });
      break;
    default:
      renderLanding(contentRoot, (view) => { currentView = view; router(); });
  }
}

init();
