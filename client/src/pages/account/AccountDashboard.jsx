
import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Heart,
  ArrowRight,
  Package,
  Settings,
  LockKeyhole,
} from "lucide-react";

const AccountDashboard = () => {
  // Temporary customer data
  // Replace with useAuth() / API data later
  const customer = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };

  const stats = [
    {
      title: "Total Orders",
      value: "12",
      icon: ShoppingBag,
      description: "All your orders",
      link: "/account/orders",
    },
    {
      title: "Pending Orders",
      value: "2",
      icon: Clock3,
      description: "Currently processing",
      link: "/account/orders",
    },
    {
      title: "Completed",
      value: "10",
      icon: CheckCircle2,
      description: "Successfully delivered",
      link: "/account/orders",
    },
    {
      title: "Wishlist",
      value: "8",
      icon: Heart,
      description: "Saved products",
      link: "/account/wishlist",
    },
  ];

  const recentOrders = [
    {
      id: "#NAG-1001",
      date: "Oct 2, 2026",
      items: "Fresh Tomatoes, Yam",
      total: "₦25,500",
      status: "Delivered",
    },
    {
      id: "#NAG-1002",
      date: "Sep 28, 2026",
      items: "Fresh Eggs, Chicken",
      total: "₦18,000",
      status: "Processing",
    },
    {
      id: "#NAG-1003",
      date: "Sep 20, 2026",
      items: "Maize, Vegetables",
      total: "₦12,500",
      status: "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-800 to-green-600">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-green-100">
                Customer Account
              </p>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {customer.firstName} 👋
              </h1>

              <p className="mt-2 text-green-100">
                Manage your orders, profile and account from here.
              </p>
            </div>

            <Link
              to="/account/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
            >
              <User size={18} />
              My Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          
          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              <Link
                to="/account"
                className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 font-semibold text-green-700"
              >
                <User size={19} />
                Dashboard
              </Link>

              <Link
                to="/account/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <User size={19} />
                My Profile
              </Link>

              <Link
                to="/account/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <ShoppingBag size={19} />
                My Orders
              </Link>

              <Link
                to="/account/wishlist"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <Heart size={19} />
                Wishlist
              </Link>

              <Link
                to="/account/change-password"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <LockKeyhole size={19} />
                Change Password
              </Link>

              <Link
                to="/account/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <Settings size={19} />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Dashboard */}
          <div className="space-y-8">
            
            {/* Account Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                    {customer.firstName.charAt(0)}
                    {customer.lastName.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/account/profile"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  Edit Profile
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Link
                    key={stat.title}
                    to={stat.link}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-green-50 p-3 text-green-700">
                        <Icon size={21} />
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                      />
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {stat.description}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Recent Orders */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your latest purchases
                  </p>
                </div>

                <Link
                  to="/account/orders"
                  className="hidden items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 sm:flex"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                        <Package size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.id}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.items}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.total}
                        </p>

                        <span
                          className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <Link
                        to="/account/orders"
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-green-600 hover:text-green-600"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4 sm:hidden">
                <Link
                  to="/account/orders"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white"
                >
                  View All Orders
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  to="/shop"
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                >
                  <ShoppingBag className="text-green-700" size={24} />

                  <h3 className="mt-4 font-bold text-gray-900">
                    Continue Shopping
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Explore fresh products from our farm.
                  </p>
                </Link>

                <Link
                  to="/account/orders"
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                >
                  <Package className="text-green-700" size={24} />

                  <h3 className="mt-4 font-bold text-gray-900">
                    Track an Order
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Check the status of your recent purchases.
                  </p>
                </Link>

                <Link
                  to="/account/profile"
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                >
                  <User className="text-green-700" size={24} />

                  <h3 className="mt-4 font-bold text-gray-900">
                    Update Profile
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep your personal information up to date.
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;