import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AxiosInstance from "../auth/axiosInstance";

interface User {
  avatar: string | undefined;
  id: any;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
  hasRole: (role: "student" | "teacher" | "admin") => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          // ✅ Skip loading screen for token verification - it's a background check
          const response = await AxiosInstance.get("/me", { 
            skipLoading: true 
          } as any);
          setUser(response.data);
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      // ✅ Login SHOULD show loading - user is waiting for authentication
      const response = await AxiosInstance.post("/login", {
        identifier,
        password,
      });

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // ✅ Skip loading for logout - it happens in background
        await AxiosInstance.post("/logout", {}, { 
          skipLoading: true 
        } as any);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const hasRole = (role: "student" | "teacher" | "admin") =>
    user?.role === role;

  const isLoggedIn = useMemo(() => !!token && !!user, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn,
        isLoading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};