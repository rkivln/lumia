import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const toFriendlyAuthMessage = (error: unknown): string => {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: string }).code)
      : '';

    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'The sign-in window was closed before completing signup. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in attempt was in progress. Please try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      case 'auth/unauthorized-domain':
        return 'This app domain is not authorized in Firebase Authentication settings.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled in Firebase Authentication for this project.';
      case 'auth/network-request-failed':
        return 'Network error while signing in. Check your internet connection and retry.';
      default:
        return 'Signup failed. Please try again.';
    }
  };

  useEffect(() => {
    const hydrateRedirectResult = async () => {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        setAuthError(toFriendlyAuthMessage(error));
      }
    };

    hydrateRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        if (firebaseUser) {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // If no profile, they need to onboard
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to load user profile after auth:', error);
        setAuthError('Signed in, but profile data could not be loaded. Please retry.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: string }).code)
        : '';
      const shouldUseRedirect =
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment';

      if (shouldUseRedirect) {
        await signInWithRedirect(auth, provider);
        return;
      }

      setAuthError(toFriendlyAuthMessage(error));
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { ...profile, ...updates }, { merge: true });
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      setAuthError('Could not update profile. Please try again.');
      throw error;
    }
  };

  const setRole = async (role: UserRole) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      email: user.email || '',
      avatar: user.photoURL || '',
      banner: '',
      role,
      createdAt: new Date().toISOString(),
      skills: [],
      bio: '',
      rating: 5.0,
      reviewCount: 0,
      location: '',
      website: '',
      github: ''
    };
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, newProfile);
      setProfile(newProfile);
    } catch (error) {
      setAuthError('Signup completed, but profile setup failed. Please retry.');
      throw error;
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ user, profile, loading, authError, signInWithGoogle, logout, updateProfile, setRole, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
