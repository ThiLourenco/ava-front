"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/apiClient";
import { User } from "@/app/lib/types";
import { getMe } from "@/app/lib/api";

interface IAuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("@Elearning:token");
    if (token) {
      getMe().then(setUser).catch(logout);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("@Elearning:token", token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

   try {
      const userData = await getMe();
      setUser(userData);
      
      router.push("/platform/dashboard");
    } catch (error) {
      console.error("Falha ao buscar usuário após login", error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@Elearning:token");
    delete apiClient.defaults.headers.common['Authorization'];
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
    
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);