import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleAuthProvider, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, HistoryItem, AffiliatePartner, SocialPlatform } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseActive: boolean;
  history: HistoryItem[];
  getIdToken: () => Promise<string | null>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (
    name: string,
    preferredAffiliate: AffiliatePartner,
    preferredSocial: SocialPlatform
  ) => Promise<void>;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'affliyat_auth_user';
const LOCAL_STORAGE_HISTORY_KEY = 'affliyat_user_history';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Get current Firebase ID token for authenticated API requests
  const getIdToken = async (): Promise<string | null> => {
    if (auth?.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (err) {
        console.warn('Failed to retrieve Firebase ID token:', err);
      }
    }
    return null;
  };

  // Sync user profile with Cloud SQL PostgreSQL backend
  const syncWithDatabase = async (token: string, profile: UserProfile) => {
    try {
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: profile.displayName,
        }),
      });

      // Fetch user's saved generations from Cloud SQL
      const genRes = await fetch('/api/generations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (genRes.ok) {
        const genData = await genRes.json();
        if (genData.success && Array.isArray(genData.generations)) {
          const mapped: HistoryItem[] = genData.generations.map((g: any) => ({
            id: String(g.id),
            userId: g.userUid,
            createdAt: g.createdAt,
            imageThumb: g.imageThumb || undefined,
            imageName: g.imageName || undefined,
            affiliatePartner: g.affiliatePartner,
            socialPlatform: g.socialPlatform,
            productDetails: g.productDetails || undefined,
            content: {
              caption: g.caption || undefined,
              title: g.title || undefined,
              description: g.description || undefined,
              cta: g.cta || undefined,
              seoKeywords: g.seoKeywords || [],
              hashtags: g.hashtags || [],
            },
          }));
          setHistory(mapped);
          saveLocalHistory(profile.uid, mapped);
        }
      }
    } catch (err) {
      console.warn('Cloud SQL sync skipped or offline:', err);
    }
  };

  // Initialize Firebase Auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const profile: UserProfile = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Affiliate Creator',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            preferredAffiliate: 'Myntra',
            preferredSocial: 'Instagram',
            createdAt: new Date().toISOString(),
          };
          setUser(profile);
          loadLocalHistory(profile.uid);

          const token = await fbUser.getIdToken();
          if (token) {
            syncWithDatabase(token, profile);
          }
        } else {
          checkLocalSession();
        }
        setLoading(false);
      });
    } else {
      checkLocalSession();
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkLocalSession = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.uid === 'demo_creator_rishi' || parsed.email?.includes('creator.rishi')) {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          setUser(null);
        } else {
          setUser(parsed);
          loadLocalHistory(parsed.uid);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const loadLocalHistory = (uid: string) => {
    try {
      const savedHist = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_KEY}_${uid}`);
      if (savedHist) {
        setHistory(JSON.parse(savedHist));
      } else {
        setHistory([]);
      }
    } catch {
      setHistory([]);
    }
  };

  const saveLocalHistory = (uid: string, items: HistoryItem[]) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_HISTORY_KEY}_${uid}`, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save local history', err);
    }
  };

  // Sign in with Email
  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          displayName: cred.user.displayName || email.split('@')[0],
          email: cred.user.email || email,
          photoURL: cred.user.photoURL || undefined,
          preferredAffiliate: 'Myntra',
          preferredSocial: 'Instagram',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        loadLocalHistory(profile.uid);

        const token = await cred.user.getIdToken();
        if (token) {
          syncWithDatabase(token, profile);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign up with Email
  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const profile: UserProfile = {
          uid: cred.user.uid,
          displayName: name,
          email: cred.user.email || email,
          preferredAffiliate: 'Myntra',
          preferredSocial: 'Instagram',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        loadLocalHistory(profile.uid);

        const token = await cred.user.getIdToken();
        if (token) {
          syncWithDatabase(token, profile);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In with Popup
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithPopup(auth, googleAuthProvider);
        const profile: UserProfile = {
          uid: cred.user.uid,
          displayName: cred.user.displayName || 'Creator',
          email: cred.user.email || '',
          photoURL: cred.user.photoURL || undefined,
          preferredAffiliate: 'Myntra',
          preferredSocial: 'Instagram',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        loadLocalHistory(profile.uid);

        const token = await cred.user.getIdToken();
        if (token) {
          syncWithDatabase(token, profile);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Password reset
  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await fbSignOut(auth);
      }
      setUser(null);
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  // Update preferences in Cloud SQL & local state
  const updateUserPreferences = async (
    name: string,
    preferredAffiliate: AffiliatePartner,
    preferredSocial: SocialPlatform
  ) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      displayName: name,
      preferredAffiliate,
      preferredSocial,
    };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));

    const token = await getIdToken();
    if (token) {
      try {
        await fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName: name,
            preferredAffiliate,
            preferredSocial,
          }),
        });
      } catch (err) {
        console.warn('Failed to update preferences in Cloud SQL:', err);
      }
    }
  };

  // Add history item to Cloud SQL and local state
  const addHistoryItem = async (item: Omit<HistoryItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const tempId = 'gen_' + Date.now();
    const newItem: HistoryItem = {
      ...item,
      id: tempId,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    saveLocalHistory(user.uid, updated);

    const token = await getIdToken();
    if (token) {
      try {
        const res = await fetch('/api/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageThumb: item.imageThumb,
            imageName: item.imageName,
            affiliatePartner: item.affiliatePartner,
            socialPlatform: item.socialPlatform,
            caption: item.content.caption,
            title: item.content.title,
            description: item.content.description,
            cta: item.content.cta,
            seoKeywords: item.content.seoKeywords,
            hashtags: item.content.hashtags,
            productDetails: item.productDetails,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.generation) {
            newItem.id = String(data.generation.id);
            saveLocalHistory(user.uid, [newItem, ...history]);
          }
        }
      } catch (err) {
        console.warn('Saved locally, Cloud SQL sync failed:', err);
      }
    }
  };

  // Delete history item from Cloud SQL and local state
  const deleteHistoryItem = async (id: string) => {
    if (!user) return;
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveLocalHistory(user.uid, updated);

    const token = await getIdToken();
    if (token && !isNaN(Number(id))) {
      try {
        await fetch(`/api/generations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('Failed to delete from Cloud SQL:', err);
      }
    }
  };

  // Clear all history
  const clearHistory = () => {
    if (!user) return;
    setHistory([]);
    saveLocalHistory(user.uid, []);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        history,
        getIdToken,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
        updateUserPreferences,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
