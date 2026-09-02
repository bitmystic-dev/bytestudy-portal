export function renderNavbar(container, user, onNavigate) {
  const isAuth = Boolean(user);
  
  container.innerHTML = `
    <header class="bs-navbar">
      <div class="bs-logo" id="nav-brand">
        📚 ByteStudy <span style="font-size: 12px; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 2px 6px; border-radius: 4px;">Public</span>
      </div>
      <div class="bs-navbar-actions">
        <button id="theme-toggle" style="background:transparent; border:none; font-size:20px; margin-right: 12px; cursor: pointer;" title="Toggle Theme">🌓</button>
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

  document.getElementById('theme-toggle').addEventListener('click', () => onNavigate('toggle-theme'));
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
