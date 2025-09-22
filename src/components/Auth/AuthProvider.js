import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser } from '../../firebase/auth';
import { getUserDocument } from '../../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setLoading(true);
      setError(null);
      
      if (user) {
        setUser(user);
        
        // Fetch user data from Firestore
        const result = await getUserDocument(user.uid);
        if (result.success) {
          setUserData(result.data);
        } else {
          setError(result.error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = async () => {
    if (user) {
      const result = await getUserDocument(user.uid);
      if (result.success) {
        setUserData(result.data);
      } else {
        setError(result.error);
      }
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    refreshUserData,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
