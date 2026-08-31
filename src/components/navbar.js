export function renderNavbar(container, user, onNavigate) {
  const isAuth = Boolean(user);
  
  container.innerHTML = `
    <header class="bs-navbar">
      <div class="bs-logo" id="nav-brand">
        📚 ByteStudy <span style="font-size: 12px; background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px;">Public</span>
      </div>
      <div>
        ${isAuth ? `
          <button class="bs-btn-secondary" id="nav-dashboard" style="margin-right: 8px;">Materials</button>
          <button class="bs-btn-secondary" id="nav-settings" style="margin-right: 8px;">Account</button>
          <button class="bs-btn-danger" id="nav-logout">Logout</button>
        ` : `
          <button class="bs-btn-secondary" id="nav-login" style="margin-right: 8px;">Sign In</button>
          <button class="bs-btn-primary" id="nav-signup">Get Started</button>
        `}
      </div>
    </header>
  `;

  document.getElementById('nav-brand').addEventListener('click', () => onNavigate(isAuth ? 'dashboard' : 'landing'));

  if (isAuth) {
    document.getElementById('nav-dashboard').addEventListener('click', () => onNavigate('dashboard'));
    document.getElementById('nav-settings').addEventListener('click', () => onNavigate('settings'));
    document.getElementById('nav-logout').addEventListener('click', () => onNavigate('logout'));
  } else {
    document.getElementById('nav-login').addEventListener('click', () => onNavigate('login'));
    document.getElementById('nav-signup').addEventListener('click', () => onNavigate('signup'));
  }
}
