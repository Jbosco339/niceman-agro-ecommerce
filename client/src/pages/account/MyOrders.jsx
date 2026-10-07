import  { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Package,
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Temporary order data
  // Replace with your order service/API later.
  const orders = [
    {
      id: "NAG-1003",
      date: "Oct 2, 2026",
      status: "Delivered",
      total: "₦25,500",
      items: [
        {
          name: "Fresh Tomatoes",
          quantity: 2,
          price: "₦8,000",
          image: "/images/products/tomatoes.jpg",
        },
        {
          name: "Fresh Yam",
          quantity: 1,
          price: "₦17,500",
          image: "/images/products/yam.jpg",
        },
      ],
    },
    {
      id: "NAG-1002",
      date: "Sep 28, 2026",
      status: "Processing",
      total: "₦18,000",
      items: [
        {
          name: "Fresh Eggs",
          quantity: 2,
          price: "₦6,000",
          image: "/images/products/eggs.jpg",
        },
        {
          name: "Farm Chicken",
          quantity: 1,
          price: "₦12,000",
          image: "/images/products/chicken.jpg",
        },
      ],
    },
    {
      id: "NAG-1001",
      date: "Sep 20, 2026",
      status: "Delivered",
      total: "₦12,500",
      items: [
        {
          name: "Fresh Maize",
          quantity: 1,
          price: "₦7,500",
          image: "/images/products/maize.jpg",
        },
        {
          name: "Fresh Vegetables",
          quantity: 1,
          price: "₦5,000",
          image: "/images/products/vegetables.jpg",
        },
      ],
    },
    {
      id: "NAG-1000",
      date: "Sep 12, 2026",
      status: "Cancelled",
      total: "₦15,000",
      items: [
        {
          name: "Organic Pepper",
          quantity: 2,
          price: "₦15,000",
          image: "/images/products/pepper.jpg",
        },
      ],
    },
  ];

  const filters = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        activeFilter === "All" || order.status === activeFilter;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(search)
        );

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={15} />;

      case "Processing":
        return <Clock3 size={15} />;

      case "Shipped":
        return <Truck size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-800 to-green-600">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-medium text-green-100">
            Customer Account
          </p>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 max-w-xl text-green-100">
            View, track and manage all your Niceman Agro & Farms orders.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Account Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <Link
            to="/account"
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700"
          >
            Dashboard
          </Link>

          <Link
            to="/account/profile"
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700"
          >
            My Profile
          </Link>

          <Link
            to="/account/orders"
            className="whitespace-nowrap rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700"
          >
            My Orders
          </Link>

          <Link
            to="/account/wishlist"
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700"
          >
            Wishlist
          </Link>

          <Link
            to="/account/change-password"
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700"
          >
            Change Password
          </Link>
        </div>

        {/* Order Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <ShoppingBag size={21} />
              </div>

              <span className="text-2xl font-bold text-gray-900">4</span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total Orders
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                <Clock3 size={21} />
              </div>

              <span className="text-2xl font-bold text-gray-900">1</span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Processing
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Truck size={21} />
              </div>

              <span className="text-2xl font-bold text-gray-900">0</span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Shipped
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <CheckCircle2 size={21} />
              </div>

              <span className="text-2xl font-bold text-gray-900">2</span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Delivered
            </p>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden gap-2 overflow-x-auto md:flex">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Mobile Filter */}
            <div className="relative md:hidden">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-green-500"
              >
                {filters.map((filter) => (
                  <option key={filter}>{filter}</option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Orders */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-green-100 p-3 text-green-700">
                      <Package size={21} />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {order.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                {/* Products */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="flex items-center gap-4 px-5 py-5 sm:px-6"
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                        <Package
                          size={25}
                          className="text-gray-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {order.total}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {order.status === "Delivered" && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
                      >
                        <RotateCcw size={16} />
                        Buy Again
                      </button>
                    )}

                    {order.status === "Processing" ||
                    order.status === "Shipped" ? (
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        Track Order
                        <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ShoppingBag size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                No orders found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                We couldn't find any orders matching your search or selected
                filter.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
              >
                Start Shopping
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;