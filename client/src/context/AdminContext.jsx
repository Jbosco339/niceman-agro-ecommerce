import { useEffect, useState } from "react";
import { adminLogin, adminLogout, getCurrentAdmin } from "../services/adminService";
import { AdminContext } from "./adminContextValue";

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    getCurrentAdmin()
      .then(({ data }) => {
        if (active) setAdmin(data);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status !== 401 && error.status !== 403) {
          setAuthError(error.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const { data } = await adminLogin(credentials);
    setAuthError("");
    setAdmin(data);
    return data;
  };

  const logout = async () => {
    await adminLogout();
    setAdmin(null);
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
        authError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
