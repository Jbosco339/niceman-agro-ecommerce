import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const showPublicLayout = !isAdminRoute;

  return (
    <>
      <ScrollToTop />

      <div className="flex min-h-screen flex-col">
        {showPublicLayout && <Header />}

        <main className="flex-1">
          <AppRoutes />
        </main>

        {showPublicLayout && <Footer />}
      </div>
    </>
  );
}

export default App;
