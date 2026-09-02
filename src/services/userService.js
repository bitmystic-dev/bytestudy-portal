import { db } from '../firebase';
import { query, collection, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';

export async function checkIsAdmin(uid) {
  if (!uid) return false;
  try {
    const adminRef = doc(db, 'admin_users', uid);
    const docSnap = await getDoc(adminRef);
    return docSnap.exists();
  } catch (e) {
    return false;
  }
}

export async function createUserProfile(uid, name, email) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    name: name || 'Student',
    email: email,
    purchases: [],
    downloads: false,
    createdAt: serverTimestamp()
  });
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function updateUserProfileName(uid, newName) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { name: newName });
}

export async function deleteUserProfileDoc(uid) {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
}

// Updated for Dynamic CMS: Direct 1:1 check against CMS module IDs
export function isEntitledToPackage(userPurchases, targetPackageId, isAdmin = false) {
  if (isAdmin) return true;
  if (!Array.isArray(userPurchases)) return false;
  return userPurchases.includes(targetPackageId);
}

export function hasDownloadPermission(profile, isAdmin = false) {
  if (isAdmin) return true;
  return Boolean(profile && profile.downloads === true);
}

export function listenToPublicNotifications(callback) {
  const q = query(collection(db, 'public_notifications'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const notes = [];
    snapshot.forEach(doc => notes.push({ id: doc.id, ...doc.data() }));
    callback(notes);
  });
}

// Fetches the Categories and Published Modules from the Headless CMS
export async function fetchDashboardContent() {
  const catsSnap = await getDocs(query(collection(db, 'course_categories'), orderBy('displayOrder', 'asc')));
  const modsSnap = await getDocs(query(collection(db, 'course_modules'), where('status', '==', 'published')));
  
  const categories = [];
  catsSnap.forEach(d => categories.push({ id: d.id, ...d.data() }));
  
  const modules = [];
  const now = new Date().getTime();
  
  modsSnap.forEach(d => {
    const m = { id: d.id, ...d.data() };
    
    // Serverless Scheduler: Skip rendering if publish date is in the future
    if (m.publishAt) {
      const pubTime = new Date(m.publishAt).getTime();
      if (pubTime > now) return; 
    }
    modules.push(m);
  });
  
  return { categories, modules };
}
