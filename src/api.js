const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

// We now pass apiKey as a parameter to support multiple Google Drive accounts
export async function fetchDriveContents(folderId, apiKey) {
  const query = "'" + folderId + "' in parents and trashed = false";
  
  const url = "https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent(query) + 
              "&fields=files(id,name,mimeType,webContentLink,webViewLink)&orderBy=folder,name&key=" + apiKey;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('API Request Failed');
  }
  
  const data = await response.json();
  
  if (data && data.files) {
    return data.files;
  } else {
    return [];
  }
}

export function isFolder(mimeType) {
  return mimeType === FOLDER_MIME_TYPE;
}