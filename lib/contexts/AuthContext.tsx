'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User, UserRole } from '@/lib/types/models';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // Create user document if it doesn't exist
          const userData = {
            email: firebaseUser.email!,
            name: firebaseUser.displayName || 'User',
            role: 'employee' as UserRole,
            designation: 'Team Member',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          setUser({ id: firebaseUser.uid, ...userData } as User);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully logged in!');
        // The onAuthStateChanged listener will handle setting user state.
        // We just perform the redirect.
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push('/welcome');
        }
      } else {
        // If our backend returns an error, we'll use its message.
        throw new Error(data.message || 'Login failed.');
      }
    } catch (error) {
      // Re-throw the error so the calling component can handle it (e.g., show a message).
      console.error("Sign in error in AuthContext:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      const userData = {
        email,
        name,
        role,
        designation: role === 'executive' ? 'Executive' : 'Team Member',
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);
      setUser({ id: result.user.uid, ...userData } as User);

      // Note: A robust implementation would also have a backend endpoint for signup
      // to create a session, similar to the login flow. For now, we'll keep the client-side history log.
      const loginData = {
        userId: result.user.uid,
        device: navigator.userAgent,
        ip: 'Unknown',
        timestamp: Timestamp.now(),
        status: 'success',
      };
      await addDoc(collection(db, 'users', result.user.uid, 'login_history'), loginData);

      toast.success('Account created successfully!');
      router.push('/welcome');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
