import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  ShoppingCart,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Package,
  LockKeyhole,
  MapPin,
  Wallet,
  Truck,
  XCircle,
  AlertCircle,
  RefreshCw,
  LogIn,
  Store,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { getMyOrders } from "../../services/orderService";
import { getCartSummary } from "../../services/cartService";
import { getCustomerAddresses } from "../../services/customerService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  Pending: Clock3,
  Processing: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

const navItems = [
  { to: "/account", label: "Dashboard", icon: User, end: true },
  { to: "/account/profile", label: "My Profile", icon: User },
  { to: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { to: "/account/settings", label: "Saved Addresses", icon: MapPin },
  {
    to: "/account/change-password",
    label: "Change Password",
    icon: LockKeyhole,
  },
];

const quickActions = [
  {
    to: "/shop",
    icon: Store,
    title: "Continue Shopping",
    description: "Explore fresh products from our farm.",
  },
  {
    to: "/account/orders",
    icon: Package,
    title: "Track an Order",
    description: "Check the status of your recent purchases.",
  },
  {
    to: "/account/profile",
    icon: User,
    title: "Update Profile",
    description: "Keep your personal information up to date.",
  },
  {
    to: "/account/change-password",
    icon: LockKeyhole,
    title: "Change Password",
    description: "Keep your account secure.",
  },
];

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const firstName = (name = "") => name.trim().split(/\s+/)[0] || "Customer";

const StatCard = ({ title, value, description, icon: Icon, link }) => (
  <Link
    to={link}
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

    <p className="mt-5 text-sm text-gray-500">{title}</p>

    <p className="mt-1 truncate text-2xl font-bold text-gray-900">{value}</p>

    <p className="mt-1 text-xs text-gray-400">{description}</p>
  </Link>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

const AccountDashboard = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLogoutError("");
    setLoggingOut(true);
    try {
      await logout();
      navigate("/account/login", { replace: true });
    } catch (logoutFailure) {
      setLogoutError(
        logoutFailure.message || "Unable to log out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const fetchDashboard = useCallback(async () => {
    const [ordersResult, cartResult, addressesResult] =
      await Promise.allSettled([
        getMyOrders(),
        getCartSummary(),
        getCustomerAddresses(),
      ]);

    return {
      orders:
        ordersResult.status === "fulfilled"
          ? (ordersResult.value.data ?? [])
          : [],
      cart:
        cartResult.status === "fulfilled"
          ? (cartResult.value.data ?? { items: 0, subtotal: 0 })
          : { items: 0, subtotal: 0 },
      addresses:
        addressesResult.status === "fulfilled"
          ? (addressesResult.value.data ?? [])
          : [],
      failed: ordersResult.status === "rejected",
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;

    fetchDashboard().then((result) => {
      if (!active) return;

      setData(result);
      if (result.failed) {
        setError("We could not load your account data. Please try again.");
      }
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, fetchDashboard]);

  const retry = useCallback(async () => {
    setError(null);
    setData(null);

    const result = await fetchDashboard();

    setData(result);
    if (result.failed) {
      setError("We could not load your account data. Please try again.");
    }
  }, [fetchDashboard]);

  const orderList = useMemo(() => data?.orders ?? [], [data]);

  const stats = useMemo(() => {
    const activeOrders = orderList.filter(
      (order) => order.status !== "Cancelled",
    );
    const totalSpent = activeOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );
    const pending = orderList.filter(
      (order) => order.status === "Pending" || order.status === "Processing",
    ).length;
    const delivered = orderList.filter(
      (order) => order.status === "Delivered",
    ).length;

    return [
      {
        title: "Total Orders",
        value: String(orderList.length),
        description: "Lifetime purchases",
        icon: ShoppingBag,
        link: "/account/orders",
      },
      {
        title: "Total Spent",
        value: formatCurrency(totalSpent),
        description: "Excluding cancelled orders",
        icon: Wallet,
        link: "/account/orders",
      },
      {
        title: "Pending Orders",
        value: String(pending),
        description: "Awaiting fulfilment",
        icon: Clock3,
        link: "/account/orders",
      },
      {
        title: "Delivered",
        value: String(delivered),
        description: "Successfully completed",
        icon: CheckCircle2,
        link: "/account/orders",
      },
      {
        title: "Cart Items",
        value: String(data?.cart?.items ?? 0),
        description: data?.cart?.subtotal
          ? `${formatCurrency(data.cart.subtotal)} subtotal`
          : "Your cart is empty",
        icon: ShoppingCart,
        link: "/cart",
      },
      {
        title: "Saved Addresses",
        value: String(data?.addresses?.length ?? 0),
        description: "Delivery addresses",
        icon: MapPin,
        link: "/account/settings",
      },
    ];
  }, [orderList, data]);

  const recentOrders = useMemo(() => orderList.slice(0, 5), [orderList]);
  const loading = isAuthenticated && data === null && !error;

  if (authLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-40 w-full rounded-2xl" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <Skeleton className="h-72 rounded-2xl" />

          <div className="space-y-8">
            <Skeleton className="h-32 rounded-2xl" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-36" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <LogIn size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Sign in to view your dashboard
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Your orders, cart, profile and account settings are available after
            signing in.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/account/login"
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              <LogIn size={17} />
              Sign In
            </Link>

            <Link
              to="/account/register"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-r from-green-800 to-green-600">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-green-100">
                Customer Account
              </p>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {firstName(user?.userName)}
              </h1>

              <p className="mt-2 text-green-100">
                Manage your orders, profile and account from here.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/account/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
              >
                <User size={18} />
                My Profile
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-300 bg-green-700/40 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <Store size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                        isActive
                          ? "bg-green-50 font-semibold text-green-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.userName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                      {initials(user?.userName) || "?"}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {user?.userName || "Customer"}
                    </h2>

                    <p className="text-sm text-gray-500">{user?.email}</p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                      {user?.phone && <span>{user.phone}</span>}
                      {user?.createdAt && (
                        <span>Member since {formatDate(user.createdAt)}</span>
                      )}
                      <span className="rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700">
                        Customer
                      </span>
                    </div>
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
            </section>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : error ? (
              <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertCircle size={24} />
                </div>

                <p className="mt-4 font-semibold text-red-700">{error}</p>

                <button
                  type="button"
                  onClick={retry}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </section>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>
            )}

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

              {loading ? (
                <div className="divide-y divide-gray-100 px-6 py-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="my-4 h-16 w-full" />
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentOrders.map((order) => {
                    const StatusIcon = STATUS_ICONS[order.status] || Package;
                    const itemCount =
                      order.items?.reduce(
                        (count, item) => count + (Number(item.quantity) || 0),
                        0,
                      ) ?? 0;
                    const itemNames = (order.items ?? [])
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(", ");
                    const extraItems = (order.items?.length ?? 0) - 2;

                    return (
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
                              Order #{order.id.slice(-6).toUpperCase()}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {itemNames}
                              {extraItems > 0 && ` +${extraItems} more`}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatDate(order.date)} · {itemCount}{" "}
                              {itemCount === 1 ? "item" : "items"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>

                            <span
                              className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                STATUS_STYLES[order.status] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <StatusIcon size={13} />
                              {order.status}
                            </span>
                          </div>

                          <Link
                            to={`/account/orders/${order.id}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-green-600 hover:text-green-600"
                            aria-label={`View order ${order.id}`}
                          >
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <ShoppingBag size={26} />
                  </div>

                  <p className="mt-4 font-semibold text-gray-900">
                    No orders yet
                  </p>

                  <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                    When you place an order, it will appear here with tracking
                    and delivery updates.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 font-semibold text-white transition hover:bg-green-800"
                  >
                    Start Shopping
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}

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

            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
                      to={action.to}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                    >
                      <Icon className="text-green-700" size={24} />

                      <h3 className="mt-4 font-bold text-gray-900">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {action.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>

            <div className="pt-2">
              {logoutError && (
                <p role="alert" className="mb-3 text-sm text-red-700">
                  {logoutError}
                </p>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 hover:text-red-800 disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;
