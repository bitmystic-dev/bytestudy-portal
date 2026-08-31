import { fetchDriveFolderContents } from '../services/driveService';
import { ACCOUNT_A_CONFIG, ACCOUNT_B_CONFIG } from '../config/materials';
import { hasDownloadPermission } from '../services/userService';

export function renderMaterialBrowser(container, options, userProfile, onBackToDashboard) {
  const { accountType, folderId, title } = options;
  const apiKey = accountType === 'B' ? ACCOUNT_B_CONFIG.apiKey : ACCOUNT_A_CONFIG.apiKey;
  const canDownload = hasDownloadPermission(userProfile);

  let folderHistory = [{ id: folderId, name: title }];

  async function loadFolder(currentFolderId) {
    container.innerHTML = `
      <div class="bs-container">
        <div class="bs-breadcrumb" id="browser-breadcrumbs"></div>
        <div class="bs-card" style="text-align: center; padding: 40px;">
          <p style="color: #64748b;">Loading files and subdirectories...</p>
        </div>
      </div>
    `;

    try {
      const items = await fetchDriveFolderContents(currentFolderId, apiKey);
      renderUI(items);
    } catch (err) {
      container.innerHTML = `
        <div class="bs-container">
          <div class="bs-breadcrumb" id="browser-breadcrumbs"></div>
          <div class="bs-card">
            <div class="bs-alert bs-alert-error">${err.message || 'Unable to load folder contents.'}</div>
            <button class="bs-btn-secondary" id="btn-retry">Retry</button>
            <button class="bs-btn-secondary" id="btn-back-dash" style="margin-left: 8px;">Back to Dashboard</button>
          </div>
        </div>
      `;
      document.getElementById('btn-retry')?.addEventListener('click', () => loadFolder(currentFolderId));
      document.getElementById('btn-back-dash')?.addEventListener('click', onBackToDashboard);
      renderBreadcrumbs();
    }
  }

  function renderBreadcrumbs() {
    const breadcrumbElem = document.getElementById('browser-breadcrumbs');
    if (!breadcrumbElem) return;

    let html = `<span class="bs-breadcrumb-item" id="bc-root">Dashboard</span> / `;
    folderHistory.forEach((item, idx) => {
      if (idx === folderHistory.length - 1) {
        html += `<span class="bs-breadcrumb-item">${item.name}</span>`;
      } else {
        html += `<span class="bs-breadcrumb-item bc-link" data-index="${idx}">${item.name}</span> / `;
      }
    });

    breadcrumbElem.innerHTML = html;

    document.getElementById('bc-root')?.addEventListener('click', onBackToDashboard);
    document.querySelectorAll('.bc-link').forEach(el => {
      el.addEventListener('click', (e) => {
        const targetIdx = parseInt(e.target.getAttribute('data-index'), 10);
        folderHistory = folderHistory.slice(0, targetIdx + 1);
        loadFolder(folderHistory[folderHistory.length - 1].id);
      });
    });
  }

  function renderUI(items) {
    let listHTML = '';

    if (items.length === 0) {
      listHTML = `<div style="text-align:center; padding: 30px; color: #64748b;">This directory is empty.</div>`;
    } else {
      items.forEach(item => {
        listHTML += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">${item.isFolder ? '📁' : '📄'}</span>
              <div>
                <div style="font-weight: 600; font-size: 15px;">${item.name}</div>
                ${item.size ? `<div style="font-size: 12px; color: #64748b;">${item.size}</div>` : ''}
              </div>
            </div>
            <div>
              ${item.isFolder ? `
                <button class="bs-btn-secondary btn-open-folder" data-id="${item.id}" data-name="${item.name}">Open</button>
              ` : `
                <a href="${item.webViewLink}" target="_blank" rel="noopener noreferrer" class="bs-btn-secondary" style="display:inline-flex; align-items:center; text-decoration:none; padding: 0 16px; height: 44px; line-height: 44px;">View Document</a>
                ${canDownload && item.webContentLink ? `
                  <a href="${item.webContentLink}" target="_blank" class="bs-btn-primary" style="display:inline-flex; align-items:center; text-decoration:none; margin-left:8px; padding: 0 16px; height: 44px; line-height: 44px;">Download</a>
                ` : ''}
              `}
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div class="bs-container">
        <div class="bs-breadcrumb" id="browser-breadcrumbs"></div>
        <div class="bs-card" style="padding: 0;">
          ${listHTML}
        </div>
      </div>
    `;

    renderBreadcrumbs();

    document.querySelectorAll('.btn-open-folder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextId = e.currentTarget.getAttribute('data-id');
        const nextName = e.currentTarget.getAttribute('data-name');
        folderHistory.push({ id: nextId, name: nextName });
        loadFolder(nextId);
      });
    });
  }

  loadFolder(folderId);
}
