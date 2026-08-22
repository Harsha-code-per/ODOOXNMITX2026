"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSession, DEMO_PERSONAS, Employee } from "./mock-data";
import { DayflowApiClient } from "./api";
import { toast } from "sonner";

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchPersona: (personaKey: "alex" | "sarah" | "admin") => void;
  updateCurrentUserEmployee: (updates: Partial<Employee>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  switchPersona: () => {},
  updateCurrentUserEmployee: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dayflow_active_user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to Alex Rivera (Employee) for rich interactive demo state
        setUser(DEMO_PERSONAS.alex);
        localStorage.setItem("dayflow_active_user", JSON.stringify(DEMO_PERSONAS.alex));
      }
    } catch {
      setUser(DEMO_PERSONAS.alex);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const session = await DayflowApiClient.login(email, pass);
      setUser(session);
      localStorage.setItem("dayflow_active_user", JSON.stringify(session));
      toast.success(`Welcome back, ${session.employee.firstName}!`, {
        description: `Logged in as ${session.role}`,
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to log in");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dayflow_active_user");
    toast.info("Logged out successfully");
  };

  const switchPersona = (personaKey: "alex" | "sarah" | "admin") => {
    const target = DEMO_PERSONAS[personaKey];
    if (target) {
      setUser(target);
      localStorage.setItem("dayflow_active_user", JSON.stringify(target));
      toast.success(`Switched Persona: ${target.employee.firstName} ${target.employee.lastName}`, {
        description: `Role: ${target.role} (${target.employee.designation})`,
      });
    }
  };

  const updateCurrentUserEmployee = (updates: Partial<Employee>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      employee: {
        ...user.employee,
        ...updates,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("dayflow_active_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        switchPersona,
        updateCurrentUserEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
