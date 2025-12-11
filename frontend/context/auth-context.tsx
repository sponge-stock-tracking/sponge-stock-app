"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi, getMe } from "@/api/auth";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    // Only try to load user if we have tokens
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");
      
      if (!token && !refresh) {
        setLoading(false);
        return;
      }
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      // Auth failed - clear tokens and set user to null
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // İlk mount'ta localStorage erişim garantisi
    setTimeout(() => {
      loadUser();
    }, 20);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await loginApi(username, password);

      // Tarayıcıya token yazılmasını bekletiyoruz
      await new Promise((res) => setTimeout(res, 50));

      await loadUser();
    } catch (error: any) {
      // Hatayı yukarı fırlat ki login sayfası yakalayabilsin
      throw error;
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
