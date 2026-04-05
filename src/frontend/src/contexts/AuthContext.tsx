import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type BankUser, bankingStore } from "../store/bankingStore";

const SESSION_KEY = "chase_bank_session";

interface Session {
  username: string;
  role: "admin" | "user";
  loginAt: string;
}

interface AuthContextType {
  session: Session | null;
  user: BankUser | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<BankUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback((username: string) => {
    const u = bankingStore.getUser(username);
    setUser(u);
  }, []);

  const refreshUser = useCallback(() => {
    if (session) {
      loadUserData(session.username);
    }
  }, [session, loadUserData]);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Session;
        setSession(s);
        loadUserData(s.username);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, [loadUserData]);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      const u = bankingStore.validateLogin(username, password);
      if (!u) {
        return { success: false, message: "Invalid username or password" };
      }

      const s: Session = {
        username: u.username,
        role: u.role,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      setUser(u);
      return { success: true, message: "Login successful" };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setUser(null);
  }, []);

  const register = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      if (username.length < 3)
        return {
          success: false,
          message: "Username must be at least 3 characters",
        };
      if (password.length < 6)
        return {
          success: false,
          message: "Password must be at least 6 characters",
        };

      const existing = bankingStore.getUser(username);
      if (existing)
        return { success: false, message: "Username already taken" };

      const newUser = bankingStore.registerUser(username, password);
      if (!newUser) return { success: false, message: "Registration failed" };

      const s: Session = {
        username: newUser.username,
        role: newUser.role,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      setUser(newUser);
      return { success: true, message: "Account created successfully" };
    },
    [],
  );

  const value: AuthContextType = {
    session,
    user,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
    isAdmin: session?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
