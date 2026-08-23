import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fournn_token') || '');
  const [loading, setLoading] = useState(true);
  
  // Theme state: default to localStorage or 'dark'
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
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('fournn_token', data.token);
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('fournn_token', data.token);
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
    setToken('');
    setUser(null);
  };

  const toggleEmergencyPause = async () => {
    if (!token) return;
    const res = await fetch('/api/agents/toggle-emergency', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok && user) {
      setUser({ ...user, emergencyPaused: data.emergencyPaused });
    }
    return data;
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
