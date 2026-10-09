import { NavLink, useNavigate } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

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

const AdminSidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose = () => {},
  onToggleCollapse = () => {},
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin authentication data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  const handleNavClick = () => {
    if (isMobileOpen) {
      onClose();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/30 transition-opacity lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-green-900 text-white shadow-xl transition-all duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className="flex h-20 items-center justify-between border-b border-green-700 px-3">
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <img
              src="/images/NicemanAgroLogoWhite.png"
              alt="Niceman Agro & Farms"
              className={`${isCollapsed ? "h-10" : "h-14"} w-auto object-contain`}
            />
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-green-700/80 bg-green-800/60 text-green-100 transition hover:bg-green-700 lg:inline-flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-green-700/80 bg-green-800/60 text-green-100 transition hover:bg-green-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-6">
          <p
            className={`mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-green-300 ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-green-900 shadow-sm"
                      : "text-green-100 hover:bg-green-800 hover:text-white"
                  } ${isCollapsed ? "justify-center px-2" : ""}`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-green-700 p-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-green-100 transition hover:bg-red-600 hover:text-white ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <span className="text-lg">🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
