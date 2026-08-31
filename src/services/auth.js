import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { createUserProfile, updateUserProfileName, deleteUserProfileDoc } from './userService';

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function registerUser(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (name) {
    await updateProfile(user, { displayName: name });
  }
  await createUserProfile(user.uid, name, email);
  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function changeDisplayName(newName) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in.');
  await updateProfile(user, { displayName: newName });
  await updateUserProfileName(user.uid, newName);
}

export async function changeUserPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in.');

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      if (!currentPassword) {
        throw new Error('Please re-enter your current password to confirm this change.');
      }
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } else {
      throw error;
    }
  }
}

export async function deleteUserAccount(currentPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in.');
  const uid = user.uid;

  try {
    await deleteUserProfileDoc(uid);
    await deleteUser(user);
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      if (!currentPassword) {
        throw new Error('Please enter your current password to confirm account deletion.');
      }
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUserProfileDoc(uid);
      await deleteUser(user);
    } else {
      throw error;
    }
  }
}

export function getAuthErrorMessage(error) {
  if (!error || !error.code) return error.message || 'An error occurred.';
  switch (error.code) {
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Incorrect email or password.';
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    case 'auth/requires-recent-login': return 'Please confirm your current password.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment.';
    default: return error.message || 'Authentication error.';
  }
}
