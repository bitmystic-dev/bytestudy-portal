import { changeDisplayName, changeUserPassword, deleteUserAccount, getAuthErrorMessage } from '../services/auth';

export function renderAccountSettings(container, userProfile, user, onBack) {
  const name = userProfile?.name || user?.displayName || 'Student';

  container.innerHTML = `
    <div class="bs-container" style="max-width: 500px;">
      <div class="bs-card">
        <h2 style="font-size: 20px; margin-bottom: 4px;">Account Settings</h2>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">${user.email}</p>

        <div id="settings-alert"></div>

        <form id="form-name" style="margin-bottom: 24px;">
          <label style="font-size: 13px; font-weight: 600;">Display Name</label>
          <input class="bs-input" type="text" id="set-name" value="${name}" required />
          <button type="submit" class="bs-btn-secondary" style="width: 100%;">Update Name</button>
        </form>

        <form id="form-pass" style="margin-bottom: 24px;">
          <label style="font-size: 13px; font-weight: 600;">Current Password</label>
          <input class="bs-input" type="password" id="set-curr-pass" placeholder="Required for password updates" autocomplete="current-password" />
          
          <label style="font-size: 13px; font-weight: 600;">New Password</label>
          <input class="bs-input" type="password" id="set-new-pass" required minlength="6" autocomplete="new-password" />
          
          <button type="submit" class="bs-btn-secondary" style="width: 100%;">Change Password</button>
        </form>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <button type="button" class="bs-btn-danger" id="btn-delete-acc" style="width: 100%;">Delete Account</button>
        </div>

        <button type="button" id="btn-close-settings" style="background:none; color:#64748b; width:100%; margin-top:16px; font-size:14px;">Back to Dashboard</button>
      </div>
    </div>
  `;

  const alertBox = document.getElementById('settings-alert');

  document.getElementById('form-name').addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    const newName = document.getElementById('set-name').value;
    try {
      await changeDisplayName(newName);
      alertBox.innerHTML = `<div class="bs-alert bs-alert-success">Display name updated successfully.</div>`;
    } catch (err) {
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('form-pass').addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';
    const currPass = document.getElementById('set-curr-pass').value;
    const newPass = document.getElementById('set-new-pass').value;
    try {
      await changeUserPassword(currPass, newPass);
      alertBox.innerHTML = `<div class="bs-alert bs-alert-success">Password changed successfully.</div>`;
      document.getElementById('form-pass').reset();
    } catch (err) {
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('btn-delete-acc').addEventListener('click', async () => {
    alertBox.innerHTML = '';
    if (!confirm('Are you sure you want to delete your account? This action is permanent.')) return;
    const pwd = prompt('Please enter your password to confirm account deletion:');
    if (!pwd) return;

    try {
      await deleteUserAccount(pwd);
    } catch (err) {
      alertBox.innerHTML = `<div class="bs-alert bs-alert-error">${getAuthErrorMessage(err)}</div>`;
    }
  });

  document.getElementById('btn-close-settings').addEventListener('click', onBack);
}
