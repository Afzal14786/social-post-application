import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create the Context Object
const AuthContext = createContext();

/**
 * Custom Hook: useAuth
 * * A helper hook to easily access the AuthContext value.
 * * Safeguard: Throws an error if used outside of <AuthProvider>, helping debug structure issues.
 * @returns {Object} The context value { user, setUser, login, logout, loading }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/**
 * AuthProvider Component
 * * Manages the global authentication state of the application.
 * * Key Features:
 * - **Persistence**: Rehydrates user session from localStorage on page reload.
 * - **State Management**: Provides `user` state and `loading` status to the app.
 * - **Auth Actions**: Exposes `login` and `logout` functions to child components.
 * * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The part of the app that needs access to auth state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Controls initial app loading state
  const navigate = useNavigate();

  // --- EFFECT: SESSION RESTORATION ---
  useEffect(() => {
    // 1. Check LocalStorage for existing session data
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        // 2. Parse and restore user state
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // 3. Fallback: If JSON is corrupt, clear storage to prevent app crash
        console.error("Corrupt data in local storage");
        localStorage.removeItem("user");
      }
    }
    
    // 4. Initialization Complete: Turn off loading so the UI renders
    setLoading(false);
  }, []);

  // --- HANDLER: LOGIN ---
  const login = (userData) => {
    // 1. Update React State (Instant UI update)
    setUser(userData);
    // 2. Persist to LocalStorage (Survives refresh)
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // --- HANDLER: LOGOUT ---
  const logout = () => {
    // 1. Clear React State
    setUser(null);
    // 2. Clear LocalStorage
    localStorage.removeItem("user");
    
    // 3. Redirect user to Login page
    // Note: If you have a backend session, call the logout API endpoint here.
    navigate("/login"); 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};