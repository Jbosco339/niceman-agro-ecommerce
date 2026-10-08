import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "📊",
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: "📦",
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: "🗂️",
  },
  {
    name: "Inventory",
    path: "/admin/inventory",
    icon: "🏪",
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: "🛒",
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: "👥",
  },
  {
    name: "Blog Management",
    path: "/admin/blog",
    icon: "📝",
  },
  {
    name: "Promotions",
    path: "/admin/promotions",
    icon: "🏷️",
  },
  {
    name: "Reviews",
    path: "/admin/reviews",
    icon: "⭐",
  },
  {
    name: "Website Content",
    path: "/admin/website-content",
    icon: "🌐",
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin authentication data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-green-900 text-white shadow-xl">
      {/* Logo / Brand */}
      <div className="flex h-20 items-center border-b border-green-700 px-6">
        <div>
          <h1 className="text-xl font-bold">Niceman Agro</h1>
          <p className="text-xs text-green-200">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-green-300">
          Management
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-green-900 shadow-sm"
                    : "text-green-100 hover:bg-green-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-green-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-green-100 transition hover:bg-red-600 hover:text-white"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;