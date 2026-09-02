import { ACCOUNT_A_CONFIG, ACCOUNT_B_CONFIG } from '../config/materials';
import { isEntitledToPackage, hasDownloadPermission } from '../services/userService';

export function renderDashboard(container, userProfile, isAdmin, onOpenMaterial) {
  const purchases = userProfile?.purchases || [];
  const downloadsAllowed = hasDownloadPermission(userProfile, isAdmin);

  let mainCardsHTML = '';
  const c11 = ACCOUNT_A_CONFIG.materials.class11;

  Object.keys(c11).forEach(key => {
    const item = c11[key];
    const entitled = isEntitledToPackage(purchases, item.id, isAdmin);

    mainCardsHTML += `
      <div class="bs-card">
        <div style="font-size: 32px; margin-bottom: 8px;">${item.icon}</div>
        <h3 style="font-size: 18px; margin-bottom: 4px;">Class 11 ${item.name}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Core Modules & Notes</p>
        ${entitled ? `
          <button class="bs-btn-primary open-mat-btn" data-account="A" data-folder="${item.folderId}" data-title="Class 11 ${item.name}">
            Explore Material
          </button>
        ` : `
          <span class="bs-badge bs-badge-gray">Locked (No Enrolled Package)</span>
        `}
      </div>
    `;
  });

  let allenCardsHTML = '';
  const allen = ACCOUNT_B_CONFIG.materials;
  Object.keys(allen).forEach(key => {
    const item = allen[key];
    const entitled = isEntitledToPackage(purchases, item.id, isAdmin);

    allenCardsHTML += `
      <div class="bs-card">
        <div style="font-size: 32px; margin-bottom: 8px;">${item.icon}</div>
        <h3 style="font-size: 18px; margin-bottom: 4px;">${item.name}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Allen Material Sync</p>
        ${entitled ? `
          <button class="bs-btn-primary open-mat-btn" data-account="B" data-folder="${item.folderId}" data-title="${item.name}">
            Explore Material
          </button>
        ` : `
          <span class="bs-badge bs-badge-gray">Locked (No Enrolled Package)</span>
        `}
      </div>
    `;
  });

  const statusText = isAdmin 
    ? '<span style="color:var(--primary); font-weight:600;">✓ Administrator Access</span>' 
    : (downloadsAllowed ? '<span style="color:var(--success); font-weight:600;">✓ Offline Downloads Permitted</span>' : 'Standard Web Viewer Mode');

  container.innerHTML = `
    <div class="bs-container">
      <div class="dash-header-mobile" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 700;">My Learning Dashboard</h1>
          <p style="font-size: 14px; color: var(--text-muted);">Status: ${statusText}</p>
        </div>
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: var(--text-main);">ByteStudy Main Courses (Class 11)</h2>
      <div class="bs-grid" style="margin-bottom: 32px;">
        ${mainCardsHTML}
      </div>

      <h2 style="font-size: 18px; margin-bottom: 12px; color: var(--text-main);">Specialized Repositories (Allen Materials)</h2>
      <div class="bs-grid">
        ${allenCardsHTML}
      </div>
    </div>
  `;

  document.querySelectorAll('.open-mat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accountType = e.currentTarget.getAttribute('data-account');
      const folderId = e.currentTarget.getAttribute('data-folder');
      const title = e.currentTarget.getAttribute('data-title');
      onOpenMaterial({ accountType, folderId, title });
    });
  });
}
