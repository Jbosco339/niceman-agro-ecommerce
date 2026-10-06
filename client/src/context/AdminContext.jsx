import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved admin session
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");

    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error("Invalid admin session:", error);
        localStorage.removeItem("admin");
      }
    }

    setLoading(false);
  }, []);

  // Admin login
  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  // Admin logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  const isAuthenticated = !!admin;

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook
export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }

  return context;
}