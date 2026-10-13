import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <AuthProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </AuthProvider>
    </CartProvider>
  </BrowserRouter>,
);
