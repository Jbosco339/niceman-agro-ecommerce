import { Route, Routes } from "react-router-dom";
import AccountDashboard from "../pages/account/AccountDashboard";
import Profile from "../pages/account/Profile";
import MyOrders from "../pages/account/MyOrders";
import OrderDetails from "../pages/account/OrderDetails";
import ChangePassword from "../pages/account/ChangePassword";
import SavedAddresses from "../pages/account/SavedAddresses";

function AccountRoutes() {
  return (
    <Routes>
      <Route path="/account" element={<AccountDashboard />} />
      <Route path="/AccountDashboard" element={<AccountDashboard />} />
      <Route path="/account/profile" element={<Profile />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/account/orders" element={<MyOrders />} />
      <Route path="/MyOrders" element={<MyOrders />} />
      <Route path="/account/orders/:orderId" element={<OrderDetails />} />
      <Route path="/OrderDetails" element={<OrderDetails />} />
      <Route path="/account/change-password" element={<ChangePassword />} />
      <Route path="/ChangePassword" element={<ChangePassword />} />
      <Route path="/account/settings" element={<SavedAddresses />} />
      <Route path="/account/saved-addresses" element={<SavedAddresses />} />
      <Route path="/SavedAddresses" element={<SavedAddresses />} />
    </Routes>
  );
}

export default AccountRoutes;
