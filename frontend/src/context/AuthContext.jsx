import React, { createContext, useContext, useState } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    // Send JSON payload matching backend Pydantic schema
    const response = await API.post('/auth/login', {
      email: email,
      password: password
    });

    const { access_token, user: userData } = response.data;

    if (access_token) {
      localStorage.setItem('token', access_token);
    }

    const activeUser = userData || { email, role: 'ADMIN' };
    localStorage.setItem('user', JSON.stringify(activeUser));
    setUser(activeUser);

    return activeUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);