import { fetchDriveContents, isFolder } from './api.js';

// Configuration Constants
const DEFAULT_ROOT_ID = '14UKPnQOW-C74KHKM5kx57P_Jpl5Mqg9j';
const ALLEN_ROOT_ID = '1LIOaBOHiQBN4wodAlrfAaJsskV5e7EVy';

const DEFAULT_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const ALLEN_API_KEY = import.meta.env.VITE_ALLEN_NORTH_MATERIAL_API;

// DOM Elements
const contentEl = document.getElementById('dynamic-content');
const breadcrumbsEl = document.getElementById('breadcrumbs');
const btnMainLib = document.getElementById('btn-main-lib');
const btnAllenLib = document.getElementById('btn-allen-lib');
const appSubtitleEl = document.getElementById('app-subtitle'); // New reference for the header text

// Application State
let activeApiKey = DEFAULT_API_KEY;
let historyPath = [
  { id: DEFAULT_ROOT_ID, name: 'Home' }
];

// Initialize
setupLibraryToggle();
loadCurrentFolder();

function setupLibraryToggle() {
  btnMainLib.onclick = () => switchLibrary('main');
  btnAllenLib.onclick = () => switchLibrary('allen');
}

function switchLibrary(lib) {
  if (lib === 'main') {
    activeApiKey = DEFAULT_API_KEY;
    historyPath = [{ id: DEFAULT_ROOT_ID, name: 'Home' }];
    
    // Update tabs
    btnMainLib.classList.add('active');
    btnAllenLib.classList.remove('active');
    
    // Update header display text
    appSubtitleEl.textContent = 'Viewing: JEE Resources';
    
  } else if (lib === 'allen') {
    activeApiKey = ALLEN_API_KEY;
    historyPath = [{ id: ALLEN_ROOT_ID, name: 'Allen North Material' }];
    
    // Update tabs
    btnAllenLib.classList.add('active');
    btnMainLib.classList.remove('active');
    
    // Update header display text
    appSubtitleEl.textContent = 'Viewing: Allen North Material';
  }
  loadCurrentFolder();
}

async function loadCurrentFolder() {
  const currentFolder = historyPath[historyPath.length - 1];
  
  renderBreadcrumbs();
  renderState('Loading library...', 'loading');

  try {
    const files = await fetchDriveContents(currentFolder.id, activeApiKey);
    renderContent(files);
  } catch (error) {
    console.error(error);
    renderState('Unable to load this folder.<br>Please try again.', 'error');
  }
}

function navigateTo(folderId, folderName) {
  historyPath.push({ id: folderId, name: folderName });
  loadCurrentFolder();
}

function navigateBack() {
  if (historyPath.length > 1) {
    historyPath.pop();
    loadCurrentFolder();
  }
}

function navigateToBreadcrumbIndex(index) {
  historyPath = historyPath.slice(0, index + 1);
  loadCurrentFolder();
}

// --- DOM Rendering Functions ---

function renderState(messageHtml, type) {
  let emoji = '⏳';
  let pulseClass = '';
  
  if (type === 'loading') {
    emoji = '📚';
    pulseClass = 'icon-pulse';
  } else if (type === 'empty') {
    emoji = '📭';
  } else if (type === 'error') {
    emoji = '⚠️';
  }
  
  contentEl.innerHTML = 
    '<div class="state-message">' +
      '<div class="state-icon ' + pulseClass + '">' + emoji + '</div>' +
      '<div class="state-text">' + messageHtml + '</div>' +
    '</div>';
}

function renderBreadcrumbs() {
  breadcrumbsEl.innerHTML = '';
  
  historyPath.forEach((step, index) => {
    const isLast = index === historyPath.length - 1;
    
    if (!isLast) {
      const btn = document.createElement('button');
      btn.className = 'breadcrumb-btn';
      btn.textContent = step.name;
      btn.onclick = () => navigateToBreadcrumbIndex(index);
      
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = '›';
      
      breadcrumbsEl.appendChild(btn);
      breadcrumbsEl.appendChild(separator);
    } else {
      const span = document.createElement('span');
      span.className = 'breadcrumb-current';
      span.textContent = step.name;
      breadcrumbsEl.appendChild(span);
    }
  });
}

function renderContent(items) {
  contentEl.innerHTML = '';

  // Render Back Button
  if (historyPath.length > 1) {
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '<span class="back-arrow">←</span> Back';
    backBtn.onclick = navigateBack;
    contentEl.appendChild(backBtn);
  }

  // Render Empty State
  if (items.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'state-message';
    emptyState.innerHTML = 
      '<div class="state-icon">📭</div>' +
      '<div class="state-text">This folder is empty.</div>';
    contentEl.appendChild(emptyState);
    return;
  }

  // Render List
  const listContainer = document.createElement('div');
  listContainer.className = 'list-container';

  items.forEach(item => {
    const isItemFolder = isFolder(item.mimeType);
    
    const row = document.createElement('div');
    row.className = 'item-card ' + (isItemFolder ? 'folder-card' : 'file-card');

    const leftContainer = document.createElement('div');
    leftContainer.className = 'item-left';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper ' + (isItemFolder ? 'folder-icon' : 'file-icon');
    iconWrapper.textContent = isItemFolder ? '📁' : '📄';

    const nameNode = document.createElement('span');
    nameNode.className = 'item-name';
    nameNode.textContent = item.name;

    leftContainer.appendChild(iconWrapper);
    leftContainer.appendChild(nameNode);
    row.appendChild(leftContainer);

    if (isItemFolder) {
      row.onclick = () => navigateTo(item.id, item.name);
    } else {
      const downloadUrl = item.webContentLink ? item.webContentLink : item.webViewLink;
      
      const downloadBtn = document.createElement('a');
      downloadBtn.className = 'btn-download';
      downloadBtn.textContent = 'Download';
      downloadBtn.href = downloadUrl;
      downloadBtn.target = '_blank';
      downloadBtn.rel = 'noopener noreferrer';
      
      row.appendChild(downloadBtn);
    }

    listContainer.appendChild(row);
  });

  contentEl.appendChild(listContainer);
}
