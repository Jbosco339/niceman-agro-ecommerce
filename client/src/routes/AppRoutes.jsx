import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AccountRoutes from "./AccountRoutes";
import AdminRoutes from "./AdminRoutes";
import { AdminProvider } from "../context/AdminContext";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/account/*" element={<AccountRoutes />} />
      <Route
        path="/admin/*"
        element={
          <AdminProvider>
            <AdminRoutes />
          </AdminProvider>
        }
      />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
