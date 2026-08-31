/**
 * Dynamic Google Drive Content Retrieval Service
 * Supports direct public folder API fetching or routing through a secure proxy server.
 */

export async function fetchDriveFolderContents(folderId, apiKey) {
  if (!folderId) {
    throw new Error('Folder ID is required.');
  }

  const backendProxy = import.meta.env.VITE_BACKEND_PROXY_URL;

  // Option 1: Secure Backend Proxy routing
  if (backendProxy) {
    const response = await fetch(`${backendProxy}/drive/contents?folderId=${encodeURIComponent(folderId)}`);
    if (!response.ok) throw new Error('Failed to fetch materials from backend proxy.');
    return await response.json();
  }

  // Option 2: Direct Google Drive API v3 (for public read-only folders)
  if (!apiKey) {
    throw new Error('Drive API Key is missing. Please configure in the app.');
  }

  const query = `'${folderId}' in parents and trashed = false`;
  const fields = 'files(id, name, mimeType, webViewLink, webContentLink, iconLink, thumbnailLink, size, modifiedTime)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&orderBy=folder,name`;

  const response = await fetch(url);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Could not retrieve Google Drive directory contents.');
  }

  const data = await response.json();
  return (data.files || []).map(file => ({
    id: file.id,
    name: file.name,
    isFolder: file.mimeType === 'application/vnd.google-apps.folder',
    mimeType: file.mimeType,
    webViewLink: file.webViewLink,
    webContentLink: file.webContentLink,
    iconLink: file.iconLink,
    size: file.size ? formatBytes(file.size) : null
  }));
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
