import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "../lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success?: boolean; error?: any }>;
  signUp: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success?: boolean; error?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem("axg_bolt_token");
    const storedUser = localStorage.getItem("axg_bolt_user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAdmin(userData.role === "admin");
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("axg_bolt_token");
        localStorage.removeItem("axg_bolt_user");
      }
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        setIsAdmin(response.data.user.role === "admin");
        return { success: true };
      }

      return { error: response.message || "Login failed" };
    } catch (error: any) {
      return { error: error.message || "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      setLoading(true);
      console.log("AuthContext: Calling register API with:", {
        ...userData,
        password: "***hidden***",
      });

      const response = await authApi.register(userData);
      console.log("AuthContext: Register API response:", response);

      if (response.success && response.data) {
        // Auto-login after successful registration
        const loginResponse = await authApi.login(
          userData.email,
          userData.password
        );

        if (loginResponse.success && loginResponse.data) {
          setToken(loginResponse.data.token);
          setUser(loginResponse.data.user);
          setIsAdmin(loginResponse.data.user.role === "admin");
        }

        return { success: true };
      }

      return { error: response };
    } catch (error: any) {
      console.error("AuthContext: Register error:", error);
      return { error: error.message || "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setToken(null);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      if (!token) return;

      const response = await authApi.getProfile();

      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAdmin(response.data.user.role === "admin");
        localStorage.setItem(
          "axg_bolt_user",
          JSON.stringify(response.data.user)
        );
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
