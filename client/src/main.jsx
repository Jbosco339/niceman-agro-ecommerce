import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AdminProvider } from "./context/AdminContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { CustomerProvider } from "./context/CustomerContext";
import { CategoryProvider } from "./context/CategoryContext";
import { BlogProvider } from "./context/BlogContext";
import { WebsiteContentProvider } from "./context/WebsiteContentContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminProvider>
      <ProductProvider>
        <OrderProvider>
          <CustomerProvider>
            <CategoryProvider>
              <WebsiteContentProvider>
                <BlogProvider>
                  <FavoritesProvider>
                    <CartProvider>
                      <App />
                    </CartProvider>
                  </FavoritesProvider>
                </BlogProvider>
              </WebsiteContentProvider>
            </CategoryProvider>
          </CustomerProvider>
        </OrderProvider>
      </ProductProvider>
    </AdminProvider>
  </BrowserRouter>,
);
