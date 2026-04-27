import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "./AuthService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncAuth = async () => {
      setIsLoading(true);

      if (!AuthService.isAuthenticated()) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const currentUser = await AuthService.getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    };

    syncAuth();

    const handleAuthChanged = async (event) => {
      if (event?.detail?.authenticated && event.detail.user) {
        setUser(event.detail.user);
        setIsLoading(false);
        return;
      }

      await syncAuth();
    };

    window.addEventListener("authStateChanged", handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("authStateChanged", handleAuthChanged);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
