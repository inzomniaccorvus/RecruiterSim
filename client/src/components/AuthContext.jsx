import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
          const parsed = await response.json();
          setCurrentEmail(parsed.email);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, currentEmail, setCurrentEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
