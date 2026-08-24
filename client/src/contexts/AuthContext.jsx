// Fournn AI OS AuthContext - Build v1.0.2 User Identity Persistence
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const parseJsonResponse = async (res) => {
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (err) {
    data = { error: text || `Server returned response with status ${res.status}` };
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fournn_token') || '');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fournn_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('fournn_theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('fournn_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => parseJsonResponse(res))
        .then(data => {
          if (data.user && data.user.email !== 'user@fournn.app') {
            setUser(data.user);
            localStorage.setItem('fournn_user', JSON.stringify(data.user));
          } else if (user) {
            // Retain locally saved user if server returns generic demo identity
            localStorage.setItem('fournn_user', JSON.stringify(user));
          }
        })
        .catch(err => console.error('Auth verification notice:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJsonResponse(res);
    localStorage.setItem('fournn_token', data.token);
    localStorage.setItem('fournn_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await parseJsonResponse(res);
    localStorage.setItem('fournn_token', data.token);
    localStorage.setItem('fournn_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async () => {
    const randomId = Math.floor(Math.random() * 10000);
    const demoEmail = `demo.user.${randomId}@fournn.app`;
    return register('Demo User', demoEmail, 'demopassword123');
  };

  const logout = () => {
    localStorage.removeItem('fournn_token');
    localStorage.removeItem('fournn_user');
    setToken('');
    setUser(null);
  };

  const toggleEmergencyPause = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/agents/toggle-emergency', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await parseJsonResponse(res);
      if (res.ok && user) {
        const updatedUser = { ...user, emergencyPaused: data.emergencyPaused };
        setUser(updatedUser);
        localStorage.setItem('fournn_user', JSON.stringify(updatedUser));
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      theme, 
      toggleTheme, 
      login, 
      register, 
      demoLogin, 
      logout, 
      toggleEmergencyPause, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
