import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener("liftlog:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("liftlog:unauthorized", handleUnauthorized);
    };
  }, [refreshUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    if (data.token) {
      localStorage.setItem("liftlog_token", data.token);
    }
    return refreshUser();
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    if (data.token) {
      localStorage.setItem("liftlog_token", data.token);
    }
    return refreshUser();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("liftlog_token");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshUser,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
