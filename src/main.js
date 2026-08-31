import { onAuthChange, logoutUser } from './services/auth';
import { getUserProfile } from './services/userService';

import { renderNavbar } from './components/navbar';
import { renderLanding } from './components/landing';
import { renderLoginForm, renderSignupForm, renderForgotPasswordForm } from './components/authForms';
import { renderDashboard } from './components/dashboard';
import { renderMaterialBrowser } from './components/materialBrowser';
import { renderAccountSettings } from './components/accountSettings';

let currentUser = null;
let currentUserProfile = null;
let currentView = 'landing';
let materialOptions = null;

const appRoot = document.getElementById('app');

function init() {
  onAuthChange(async (user) => {
    if (user) {
      currentUser = user;
      try {
        currentUserProfile = await getUserProfile(user.uid);
      } catch (e) {
        console.error('Error fetching user profile:', e);
      }
      if (currentView === 'landing' || currentView === 'login' || currentView === 'signup') {
        currentView = 'dashboard';
      }
    } else {
      currentUser = null;
      currentUserProfile = null;
      currentView = 'landing';
    }
    router();
  });
}

function router() {
  appRoot.innerHTML = '<div id="nav-root"></div><div id="content-root"></div>';
  const navRoot = document.getElementById('nav-root');
  const contentRoot = document.getElementById('content-root');

  renderNavbar(navRoot, currentUser, (target) => {
    if (target === 'logout') {
      logoutUser();
      return;
    }
    currentView = target;
    router();
  });

  switch (currentView) {
    case 'landing':
      renderLanding(contentRoot, (view) => {
        currentView = view;
        router();
      });
      break;

    case 'login':
      renderLoginForm(contentRoot, (view) => {
        currentView = view;
        router();
      });
      break;

    case 'signup':
      renderSignupForm(contentRoot, (view) => {
        currentView = view;
        router();
      });
      break;

    case 'forgot':
      renderForgotPasswordForm(contentRoot, (view) => {
        currentView = view;
        router();
      });
      break;

    case 'dashboard':
      if (!currentUser) { currentView = 'login'; router(); return; }
      renderDashboard(contentRoot, currentUserProfile, (opts) => {
        materialOptions = opts;
        currentView = 'browser';
        router();
      });
      break;

    case 'browser':
      if (!currentUser) { currentView = 'login'; router(); return; }
      renderMaterialBrowser(contentRoot, materialOptions, currentUserProfile, () => {
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
      renderLanding(contentRoot, (view) => {
        currentView = view;
        router();
      });
  }
}

init();
