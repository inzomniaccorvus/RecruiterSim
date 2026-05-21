import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

  // Prevents components from flashing "not logged in" before the auth check resolves.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
          const parsed = await response.json();
          setCurrentEmail(parsed.email);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentEmail,
        setCurrentEmail,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
