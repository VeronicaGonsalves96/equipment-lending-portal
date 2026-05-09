import React, { createContext, useCallback, useContext, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));

  const saveSession = (tokenValue, userValue) => {
    if (tokenValue) {
      localStorage.setItem("auth_token", tokenValue);
      setToken(tokenValue);
    }
    setUser(userValue || null);
  };

  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data.token, data.user);
    return data;
  };

  const signup = async (payload) => {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  };

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
    }
  }, []);

  const fetchMe = useCallback(async () => {
    if (!token) {
      return null;
    }
    const data = await apiFetch("/auth/me");
    setUser(data.user);
    return data.user;
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, fetchMe, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
