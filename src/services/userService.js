import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { PACKAGE_INCLUSIONS } from '../config/materials';

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

export function isEntitledToPackage(userPurchases, targetPackageId) {
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

export function hasDownloadPermission(profile) {
  return Boolean(profile && profile.downloads === true);
}

