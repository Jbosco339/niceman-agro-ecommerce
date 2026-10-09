import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import useOrders from "../../../hooks/useOrders";
import useCustomers from "../../../hooks/useCustomers";
import useCategories from "../../../hooks/useCategories";

const formatCurrency = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const statusStyle = {
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { customers } = useCustomers();
  const { categories } = useCategories();

  const recentOrders = orders.slice(0, 4);
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid" || order.status === "Delivered",
  );

  const totalSales = paidOrders.reduce((sum, order) => {
    const orderTotal = (() => {
      if (order.total != null) return Number(order.total);
      const itemsTotal = (order.items || []).reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 1),
        0,
      );
      return itemsTotal + Number(order.deliveryFee || 0);
    })();

    return sum + orderTotal;
  }, 0);

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      change: `${
        paidOrders.length > 0
          ? Math.min(
              99,
              Math.round(
                (paidOrders.length / Math.max(orders.length, 1)) * 100,
              ),
            )
          : 0
      }%`,
      color: "green",
    },
    {
      title: "Total Orders",
      value: String(orders.length),
      change: `${
        orders.length > 0
          ? Math.round((pendingOrders.length / orders.length) * 100)
          : 0
      }% pending`,
      color: "blue",
    },
    {
      title: "Customers",
      value: String(customers.length),
      change: `${
        customers.length > 0
          ? Math.min(
              99,
              Math.round(
                (customers.filter((customer) => customer.status === "Active")
                  .length /
                  customers.length) *
                  100,
              ),
            )
          : 0
      }% active`,
      color: "purple",
    },
    {
      title: "Products",
      value: String(products.length),
      change: `${categories.filter((cat) => cat.status === "Active").length} active categories`,
      color: "orange",
    },
  ];

  const computeOrderAmount = (order) => {
    if (!order) return 0;
    if (order.total != null) return Number(order.total);

    const itemsTotal = (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );

    return itemsTotal + Number(order.deliveryFee || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here is the live summary of your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>

            <div className="mt-3 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>

              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/products/add"
            className="rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Add Product
          </Link>

          <Link
            to="/admin/categories/add"
            className="rounded-lg border border-green-600 px-4 py-3 text-center text-sm font-semibold text-green-600 transition hover:bg-green-50"
          >
            Add Category
          </Link>

          <Link
            to="/admin/blog/create"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Create Article
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest customer orders</p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-green-600 hover:text-green-800"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Order
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-800"
                      >
                        {order.id}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {order.customer?.name || order.customer || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(computeOrderAmount(order))}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[order.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Store Overview</h2>

          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {pendingOrders.length}
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-sm font-medium text-green-600"
              >
                View
              </Link>
            </div>

            <div className="border-t pt-5">
              <div>
                <p className="text-sm text-gray-500">New Customers</p>
                <p className="mt-1 text-xl font-bold text-purple-600">
                  {customers.length}
                </p>
              </div>

              <Link
                to="/admin/customers"
                className="mt-2 inline-block text-sm font-medium text-green-600"
              >
                View Customers
              </Link>
            </div>

            <div className="border-t pt-5">
              <div>
                <p className="text-sm text-gray-500">Active Categories</p>
                <p className="mt-1 text-xl font-bold text-blue-600">
                  {
                    categories.filter(
                      (category) => category.status === "Active",
                    ).length
                  }
                </p>
              </div>

              <Link
                to="/admin/categories"
                className="mt-2 inline-block text-sm font-medium text-green-600"
              >
                Manage Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
