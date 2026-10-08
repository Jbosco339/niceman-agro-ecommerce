import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  // Hide the public Footer on admin pages (path starts with /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <AppRoutes />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
