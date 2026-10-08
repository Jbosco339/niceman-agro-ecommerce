import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AdminProvider } from "./context/AdminContext";
import { ProductProvider } from "./context/ProductContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminProvider>
      <ProductProvider>
        <FavoritesProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FavoritesProvider>
      </ProductProvider>
    </AdminProvider>
  </BrowserRouter>,
);
