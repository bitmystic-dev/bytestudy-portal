import { db } from '../firebase';
import { query, collection, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { PACKAGE_INCLUSIONS } from '../config/materials';

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

export function isEntitledToPackage(userPurchases, targetPackageId, isAdmin = false) {
  if (isAdmin) return true;
  if (!Array.isArray(userPurchases)) return false;
  if (userPurchases.includes(targetPackageId)) return true;

  for (let i = 0; i < userPurchases.length; i++) {
    const activePkg = userPurchases[i];
    const inclusions = PACKAGE_INCLUSIONS[activePkg] || [];
    if (inclusions.includes(targetPackageId)) {
      return true;
    }
  }
  return false;
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
