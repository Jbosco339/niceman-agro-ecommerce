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

const withAdminContentSpacing = (element) => (
  <div className="w-full px-3 sm:px-4 lg:px-6">{element}</div>
);

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="AdminLogin"
        element={withAdminContentSpacing(<AdminLogin />)}
      />
      <Route
        path="Admindashboard"
        element={withAdminContentSpacing(<Admindashboard />)}
      />
      <Route
        path="dashboard"
        element={withAdminContentSpacing(<Admindashboard />)}
      />
      <Route path="login" element={withAdminContentSpacing(<AdminLogin />)} />
      <Route
        path="blog"
        element={withAdminContentSpacing(<BlogManagement />)}
      />
      <Route
        path="BlogManagement"
        element={withAdminContentSpacing(<BlogManagement />)}
      />
      <Route
        path="blog/create"
        element={withAdminContentSpacing(<CreateArticle />)}
      />
      <Route
        path="CreateArticle"
        element={withAdminContentSpacing(<CreateArticle />)}
      />
      <Route
        path="blog/edit/:id"
        element={withAdminContentSpacing(<EditArticle />)}
      />
      <Route
        path="EditArticle"
        element={withAdminContentSpacing(<EditArticle />)}
      />
      <Route
        path="categories"
        element={withAdminContentSpacing(<Categories />)}
      />
      <Route
        path="Categories"
        element={withAdminContentSpacing(<Categories />)}
      />
      <Route
        path="categories/add"
        element={withAdminContentSpacing(<AddCategory />)}
      />
      <Route
        path="AddCategory"
        element={withAdminContentSpacing(<AddCategory />)}
      />
      <Route path="products" element={withAdminContentSpacing(<Products />)} />
      <Route path="Products" element={withAdminContentSpacing(<Products />)} />
      <Route
        path="products/add"
        element={withAdminContentSpacing(<AddProduct />)}
      />
      <Route
        path="AddProduct"
        element={withAdminContentSpacing(<AddProduct />)}
      />
      <Route
        path="products/:id"
        element={withAdminContentSpacing(<ProductDetails />)}
      />
      <Route
        path="ProductDetails"
        element={withAdminContentSpacing(<ProductDetails />)}
      />
      <Route
        path="products/edit/:id"
        element={withAdminContentSpacing(<EditProduct />)}
      />
      <Route
        path="EditProduct"
        element={withAdminContentSpacing(<EditProduct />)}
      />
      <Route path="orders" element={withAdminContentSpacing(<Orders />)} />
      <Route path="Orders" element={withAdminContentSpacing(<Orders />)} />
      <Route path="OrderTable" element={withAdminContentSpacing(<Orders />)} />
      <Route
        path="orders/:id"
        element={withAdminContentSpacing(<OrderDetails />)}
      />
      <Route
        path="OrderDetails"
        element={withAdminContentSpacing(<OrderDetails />)}
      />
      <Route
        path="customers"
        element={withAdminContentSpacing(<Customers />)}
      />
      <Route
        path="Customers"
        element={withAdminContentSpacing(<Customers />)}
      />
      <Route
        path="customers/:id"
        element={withAdminContentSpacing(<CustomerDetails />)}
      />
      <Route
        path="CustomerDetails"
        element={withAdminContentSpacing(<CustomerDetails />)}
      />
      <Route
        path="inventory"
        element={withAdminContentSpacing(<Inventory />)}
      />
      <Route
        path="Inventory"
        element={withAdminContentSpacing(<Inventory />)}
      />
      <Route path="reviews" element={withAdminContentSpacing(<Reviews />)} />
      <Route path="Reviews" element={withAdminContentSpacing(<Reviews />)} />
      <Route
        path="promotions"
        element={withAdminContentSpacing(<Promotions />)}
      />
      <Route
        path="Promotions"
        element={withAdminContentSpacing(<Promotions />)}
      />
      <Route
        path="website-content"
        element={withAdminContentSpacing(<WebsiteContent />)}
      />
      <Route
        path="WebsiteContent"
        element={withAdminContentSpacing(<WebsiteContent />)}
      />
      <Route path="*" element={null} />
    </Routes>
  );
}

export default AdminRoutes;
