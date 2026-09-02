import { loginUser, registerUser, resetUserPassword, getAuthErrorMessage } from '../services/auth';

export function renderLoginForm(container, onNavigate) {
  container.innerHTML = `
    <div class="bs-container" style="max-width: 420px; margin-top: 40px;">
      <div class="bs-card">
        <h2 style="font-size: 22px; margin-bottom: 6px; text-align: center;">Sign In</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">Enter your credentials to access your materials</p>
        
        <div id="auth-alert"></div>

        <form id="form-login">
          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Email Address</label>
          <input class="bs-input" type="email" id="login-email" required autocomplete="email" />

          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Password</label>
          <input class="bs-input" type="password" id="login-password" required autocomplete="current-password" />

          <button type="submit" class="bs-btn-primary" id="login-btn" style="width: 100%; margin-top: 8px;">Sign In</button>
        </form>

        <button type="button" id="btn-goto-forgot" style="background:none; color:var(--primary); width:100%; margin-top:12px; font-size:14px; cursor: pointer; border: none;">Forgot Password?</button>
        <button type="button" id="btn-goto-signup" style="background:none; color:var(--text-muted); width:100%; margin-top:8px; font-size:14px; cursor: pointer; border: none;">Need an account? Sign up</button>
      </div>
    </div>
  `;

  const alertBox = document.getElementById('auth-alert');

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      await loginUser(email, pass);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Sign In';
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('btn-goto-forgot').addEventListener('click', () => onNavigate('forgot'));
  document.getElementById('btn-goto-signup').addEventListener('click', () => onNavigate('signup'));
}

export function renderSignupForm(container, onNavigate) {
  container.innerHTML = `
    <div class="bs-container" style="max-width: 420px; margin-top: 40px;">
      <div class="bs-card">
        <h2 style="font-size: 22px; margin-bottom: 6px; text-align: center;">Create Account</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">Register to access enrolled ByteStudy modules</p>
        
        <div id="auth-alert"></div>

        <form id="form-signup">
          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Full Name</label>
          <input class="bs-input" type="text" id="signup-name" required autocomplete="name" />

          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Email Address</label>
          <input class="bs-input" type="email" id="signup-email" required autocomplete="email" />

          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Password (min. 6 characters)</label>
          <input class="bs-input" type="password" id="signup-password" required minlength="6" autocomplete="new-password" />

          <button type="submit" class="bs-btn-primary" id="signup-btn" style="width: 100%; margin-top: 8px;">Create Account</button>
        </form>

        <button type="button" id="btn-goto-login" style="background:none; color:var(--text-muted); width:100%; margin-top:12px; font-size:14px; cursor: pointer; border: none;">Already registered? Sign In</button>
      </div>
    </div>
  `;

  const alertBox = document.getElementById('auth-alert');

  document.getElementById('form-signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;
    const btn = document.getElementById('signup-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Creating Account...';
      await registerUser(email, pass, name);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Create Account';
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('btn-goto-login').addEventListener('click', () => onNavigate('login'));
}

export function renderForgotPasswordForm(container, onNavigate) {
  container.innerHTML = `
    <div class="bs-container" style="max-width: 420px; margin-top: 40px;">
      <div class="bs-card">
        <h2 style="font-size: 22px; margin-bottom: 6px; text-align: center;">Reset Password</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">Receive a reset link via email</p>
        
        <div id="auth-alert"></div>

        <form id="form-reset">
          <label style="font-size: 13px; font-weight: 600; color: var(--text-main);">Email Address</label>
          <input class="bs-input" type="email" id="reset-email" required autocomplete="email" />

          <button type="submit" class="bs-btn-primary" id="reset-btn" style="width: 100%; margin-top: 8px;">Send Reset Link</button>
        </form>

        <button type="button" id="btn-goto-login" style="background:none; color:var(--text-muted); width:100%; margin-top:12px; font-size:14px; cursor: pointer; border: none;">Back to Sign In</button>
      </div>
    </div>
  `;

  const alertBox = document.getElementById('auth-alert');

  document.getElementById('form-reset').addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    const email = document.getElementById('reset-email').value;
    const btn = document.getElementById('reset-btn');

    try {
      btn.disabled = true;
      btn.textContent = 'Sending...';
      await resetUserPassword(email);
      alertBox.innerHTML = `<div class="bs-alert bs-alert-success">Password reset email sent! Check your inbox.</div>`;
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('btn-goto-login').addEventListener('click', () => onNavigate('login'));
}
