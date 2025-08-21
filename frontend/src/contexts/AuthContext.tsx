import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: () => void;
  signOut: () => void;
  getSession: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return {
    data: context.session,
    status: context.status,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const getSession = async (): Promise<any> => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return null;
      }

      // In a real app, you would validate the token with your backend
      const response = await fetch("/api/auth/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const sessionData = await response.json();
        return sessionData;
      }
      return null;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  };

  const signIn = async () => {
    // Get the session data after successful authentication
    const sessionData = await getSession();
    if (sessionData?.user) {
      setUser(sessionData.user);
      setSession(sessionData);
      setStatus("authenticated");
    }
  };

  const signOut = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setSession(null);
    setStatus("unauthenticated");
  };

  useEffect(() => {
    const initAuth = async () => {
      const sessionData = await getSession();
      if (sessionData?.user) {
        setUser(sessionData.user);
        setSession(sessionData);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    status,
    signIn,
    signOut,
    getSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
