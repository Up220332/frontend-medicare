import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  const safeDecodeToken = (token) => {
    try {
      if (!token) return null;
      const decoded = jwt.decode(token);
      return decoded && decoded.id ? decoded : null;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const decodedToken = safeDecodeToken(token);

    if (decodedToken) {
      setAuthState({
        isAuthenticated: true,
        user: {
          id: decodedToken.id,
          role: decodedToken.role || 'user' 
        },
        isLoading: false
      });
    } else {
      Cookies.remove('token');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
    }
  }, []);

  const login = (token) => {
    const decodedToken = safeDecodeToken(token);
    
    if (!decodedToken) {
      throw new Error("Invalid token format - missing user ID");
    }

    Cookies.set('token', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 1 // 1 día
    });

    setAuthState({
      isAuthenticated: true,
      user: {
        id: decodedToken.id,
        role: decodedToken.role || 'user'
      },
      isLoading: false
    });
  };

  const logout = () => {
    Cookies.remove('token', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};