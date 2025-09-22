import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// User authentication functions
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await createUserDocument(user.uid, {
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    await updateUserDocument(user.uid, { lastLoginAt: new Date() });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
    } else {
      await updateUserDocument(user.uid, { lastLoginAt: new Date() });
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in was cancelled. Please try again.' };
    } else if (error.code === 'auth/popup-blocked') {
      return { success: false, error: 'Popup was blocked. Please allow popups for this site.' };
    } else if (error.code === 'auth/network-request-failed') {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
    
    return { success: false, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
      return { success: true };
    }
    return { success: false, error: 'No user logged in' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete user from Firebase Auth
      await deleteUser(user);
      
      return { success: true };
    }
    return { success: false, error: 'No user logged in' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User document management
export const createUserDocument = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      socialMediaAccounts: {},
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      settings: {
        privacy: 'public',
        dataSharing: true,
        analytics: true,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserDocument = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User document not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserDocument = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Social media account management
export const addSocialMediaAccount = async (uid, platform, accountData) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const socialMediaAccounts = userData.socialMediaAccounts || {};
      
      socialMediaAccounts[platform] = {
        ...accountData,
        connectedAt: new Date(),
        isActive: true,
      };
      
      await updateDoc(userRef, {
        socialMediaAccounts,
      });
      
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeSocialMediaAccount = async (uid, platform) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const socialMediaAccounts = userData.socialMediaAccounts || {};
      
      delete socialMediaAccounts[platform];
      
      await updateDoc(userRef, {
        socialMediaAccounts,
      });
      
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSocialMediaAccount = async (uid, platform, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const socialMediaAccounts = userData.socialMediaAccounts || {};
      
      if (socialMediaAccounts[platform]) {
        socialMediaAccounts[platform] = {
          ...socialMediaAccounts[platform],
          ...updates,
          updatedAt: new Date(),
        };
        
        await updateDoc(userRef, {
          socialMediaAccounts,
        });
        
        return { success: true };
      }
      return { success: false, error: 'Social media account not found' };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
