"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import authService from "@/appwrite/auth";
import { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isAdmin: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // Check for Admin status via Teams
      const userTeams = await authService.listTeams();
      const isUserAdmin = userTeams.teams.some(
        (team) => team.name.toLowerCase() === "admins"
      );
      setIsAdmin(isUserAdmin);
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, refreshAuth: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
