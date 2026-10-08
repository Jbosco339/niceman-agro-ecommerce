import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminLogin from "../pages/admin/Login/AdminLogin";
import Admindashboard from "../pages/admin/Dashboard/Admindashboard";
import BlogManagement from "../pages/admin/Blog/BlogManagement";
import CreateArticle from "../pages/admin/Blog/CreateArticle";
import EditArticle from "../pages/admin/Blog/EditArticle";
import Categories from "../pages/admin/Categories/Categories";
import AddCategory from "../pages/admin/Categories/AddCategory";
import EditCategory from "../pages/admin/Categories/EditCategory";
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
      <Route path="login" element={<AdminLogin />} />
      <Route path="AdminLogin" element={<AdminLogin />} />

      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Admindashboard />} />
        <Route path="Admindashboard" element={<Admindashboard />} />

        <Route path="blog" element={<BlogManagement />} />
        <Route path="BlogManagement" element={<BlogManagement />} />
        <Route path="blog/create" element={<CreateArticle />} />
        <Route path="CreateArticle" element={<CreateArticle />} />
        <Route path="blog/edit/:id" element={<EditArticle />} />
        <Route path="EditArticle" element={<EditArticle />} />

        <Route path="categories" element={<Categories />} />
        <Route path="Categories" element={<Categories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="AddCategory" element={<AddCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />
        <Route path="EditCategory" element={<EditCategory />} />

        <Route path="products" element={<Products />} />
        <Route path="Products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="AddProduct" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="ProductDetails" element={<ProductDetails />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="EditProduct" element={<EditProduct />} />

        <Route path="orders" element={<Orders />} />
        <Route path="Orders" element={<Orders />} />
        <Route path="OrderTable" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="OrderDetails" element={<OrderDetails />} />

        <Route path="customers" element={<Customers />} />
        <Route path="Customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="CustomerDetails" element={<CustomerDetails />} />

        <Route path="inventory" element={<Inventory />} />
        <Route path="Inventory" element={<Inventory />} />

        <Route path="reviews" element={<Reviews />} />
        <Route path="Reviews" element={<Reviews />} />

        <Route path="promotions" element={<Promotions />} />
        <Route path="Promotions" element={<Promotions />} />

        <Route path="website-content" element={<WebsiteContent />} />
        <Route path="WebsiteContent" element={<WebsiteContent />} />
      </Route>

      <Route path="*" element={null} />
    </Routes>
  );
}

export default AdminRoutes;
