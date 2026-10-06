import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/Login/AdminLogin";
import Admindashboard from "../pages/admin/Dashboard/Admindashboard";
import BlogManagement from "../pages/admin/Blog/BlogManagement";
import CreateArticle from "../pages/admin/Blog/CreateArticle";
import EditArticle from "../pages/admin/Blog/EditArticle";
import Categories from "../pages/admin/Categories/Categories";
import AddCategory from "../pages/admin/Categories/AddCategory";
import Products from "../pages/admin/Products/Products";
import AddProduct from "../pages/admin/Products/AddProduct";
import ProductDetails from "../pages/admin/Products/ProductDetails";
import EditProduct from "../pages/admin/Products/EditProduct";
import Orders from "../pages/admin/Orders/Orders";
import OrderDetails from "../pages/admin/Orders/OrderDetails";
import Customers from "../pages/admin/Customers/Customers";
import CustomerDetails from "../pages/admin/Customers/CustomerDetails";
import Inventory from "../pages/admin/Inventory/Inventory";
import Reviews from "../pages/admin/Reviews/Reviews";
import Promotions from "../pages/admin/Promotions/Promotions";
import WebsiteContent from "../pages/admin/WebsiteContent/WebsiteContent";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Admindashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Admindashboard />} />
      <Route path="/admin/blog" element={<BlogManagement />} />
      <Route path="/admin/blog/create" element={<CreateArticle />} />
      <Route path="/admin/blog/edit/:id" element={<EditArticle />} />
      <Route path="/admin/categories" element={<Categories />} />
      <Route path="/admin/categories/add" element={<AddCategory />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/products/:id" element={<ProductDetails />} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      <Route path="/admin/orders" element={<Orders />} />
      <Route path="/admin/orders/:id" element={<OrderDetails />} />
      <Route path="/admin/customers" element={<Customers />} />
      <Route path="/admin/customers/:id" element={<CustomerDetails />} />
      <Route path="/admin/inventory" element={<Inventory />} />
      <Route path="/admin/reviews" element={<Reviews />} />
      <Route path="/admin/promotions" element={<Promotions />} />
      <Route path="/admin/website-content" element={<WebsiteContent />} />
    </Routes>
  );
}

export default AdminRoutes;
