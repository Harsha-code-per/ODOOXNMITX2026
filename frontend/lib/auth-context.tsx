"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserSession, DEMO_PERSONAS, Employee } from "./mock-data";
import { DayflowApiClient } from "./api";
import { toast } from "sonner";

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<UserSession>;
  logout: () => void;
  switchPersona: (personaKey: "superadmin" | "admin" | "admin_temp" | "sarah" | "alex") => void;
  updateCurrentUserEmployee: (updates: Partial<Employee>) => void;
  resetPermanentPassword: (newPassword: string, oldPassword?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({} as UserSession),
  logout: () => {},
  switchPersona: () => {},
  updateCurrentUserEmployee: () => {},
  resetPermanentPassword: async () => {},
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
        // Default to Alex Rivera (Employee)
        setUser(DEMO_PERSONAS.alex);
        localStorage.setItem("dayflow_active_user", JSON.stringify(DEMO_PERSONAS.alex));
      }
    } catch {
      setUser(DEMO_PERSONAS.alex);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<UserSession> => {
    setIsLoading(true);
    try {
      const session = await DayflowApiClient.login(email, pass);
      setUser(session);
      localStorage.setItem("dayflow_active_user", JSON.stringify(session));
      toast.success(`Welcome back, ${session.employee.firstName}!`, {
        description: `Logged in as ${session.role} at ${session.companyName || "Dayflow"}`,
      });
      return session;
    } catch (e: any) {
      toast.error(e.message || "Failed to log in");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPermanentPassword = async (newPassword: string, oldPassword?: string) => {
    if (!user) throw new Error("No active session");
    setIsLoading(true);
    try {
      await DayflowApiClient.changePassword(oldPassword || "password123", newPassword);
      const updatedUser: UserSession = {
        ...user,
        mustChangePassword: false,
      };
      setUser(updatedUser);
      localStorage.setItem("dayflow_active_user", JSON.stringify(updatedUser));
      toast.success("Permanent password set successfully!", {
        description: "Your account is now active.",
      });
    } catch (e: any) {
      toast.error(e.message || "Password update failed");
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

  const switchPersona = (personaKey: "superadmin" | "admin" | "admin_temp" | "sarah" | "alex") => {
    const target = DEMO_PERSONAS[personaKey];
    if (target) {
      setUser(target);
      localStorage.setItem("dayflow_active_user", JSON.stringify(target));
      toast.success(`Switched to ${target.employee.firstName} ${target.employee.lastName}`, {
        description: `Role: ${target.role} • ${target.companyName || "Dayflow"}`,
      });
    }
  };

  const updateCurrentUserEmployee = (updates: Partial<Employee>) => {
    if (!user) return;
    const updatedUser: UserSession = {
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
        resetPermanentPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
