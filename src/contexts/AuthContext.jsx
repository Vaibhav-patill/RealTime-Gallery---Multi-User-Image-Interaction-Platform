import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/instantdb';
import { tx, id } from '@instantdb/react';
import { getRandomColor } from '../utils/helpers';
import { ADMIN_EMAILS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoading, user, error } = db.useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const adminStatus = ADMIN_EMAILS.includes(user.email);
      setIsAdmin(adminStatus);

      const initUserProfile = async () => {
        try {
          const newProfile = {
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0],
            userColor: getRandomColor(),
            isAdmin: adminStatus,
            createdAt: Date.now()
          };

          await db.transact([
            tx.users[user.id].update(newProfile)
          ]);

          setUserProfile(newProfile);
        } catch (error) {
          console.error('Error initializing user profile:', error);
          setUserProfile({
            id: user.id,
            email: user.email,
            username: user.email.split('@')[0],
            userColor: getRandomColor(),
            isAdmin: adminStatus,
            createdAt: Date.now()
          });
        }
      };

      initUserProfile();
    } else {
      setUserProfile(null);
      setIsAdmin(false);
    }
  }, [user]);

  const signInWithEmail = async (email) => {
    try {
      await db.auth.sendMagicCode({ email });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const verifyCode = async (email, code) => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    await db.auth.signOut();
    setUserProfile(null);
  };

  const updateUsername = async (newUsername) => {
    if (!user || !userProfile) return;

    await db.transact([
      tx.users[user.id].update({
        ...userProfile,
        username: newUsername
      })
    ]);

    setUserProfile({ ...userProfile, username: newUsername });
  };

  const value = {
    user,
    userProfile,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    signInWithEmail,
    verifyCode,
    signOut,
    updateUsername,
    getCurrentUser: () => ({
      userId: user?.id,
      username: userProfile?.username || 'Anonymous',
      userColor: userProfile?.userColor || '#999999'
    })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};