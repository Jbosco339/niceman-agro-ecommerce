import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Sales",
    value: "₦1,245,000",
    change: "+12.5%",
    color: "green",
  },
  {
    title: "Total Orders",
    value: "156",
    change: "+8.2%",
    color: "blue",
  },
  {
    title: "Customers",
    value: "84",
    change: "+5.4%",
    color: "purple",
  },
  {
    title: "Products",
    value: "97",
    change: "+3.1%",
    color: "orange",
  },
];

const recentOrders = [
  {
    id: "NA-2026-00125",
    customer: "John Doe",
    amount: 53500,
    status: "Delivered",
    date: "Oct 6, 2026",
  },
  {
    id: "NA-2026-00124",
    customer: "Sarah Williams",
    amount: 78000,
    status: "Processing",
    date: "Oct 5, 2026",
  },
  {
    id: "NA-2026-00123",
    customer: "Michael Johnson",
    amount: 32000,
    status: "Pending",
    date: "Oct 5, 2026",
  },
  {
    id: "NA-2026-00122",
    customer: "Grace Okafor",
    amount: 45000,
    status: "Delivered",
    date: "Oct 4, 2026",
  },
];

const formatCurrency = (amount) =>
  `₦${amount.toLocaleString("en-NG")}`;

const statusStyle = {
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here's what's happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h2>

              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

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
              <h2 className="font-bold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-sm text-gray-500">
                Latest customer orders
              </p>
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
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-800"
                      >
                        {order.id}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {order.customer}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[order.status]}`}
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
          <h2 className="font-bold text-gray-900">
            Store Overview
          </h2>

          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending Orders
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  18
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
                <p className="text-sm text-gray-500">
                  Low Stock Products
                </p>
                <p className="mt-1 text-xl font-bold text-orange-600">
                  7
                </p>
              </div>

              <Link
                to="/admin/products"
                className="mt-2 inline-block text-sm font-medium text-green-600"
              >
                Manage Products
              </Link>
            </div>

            <div className="border-t pt-5">
              <div>
                <p className="text-sm text-gray-500">
                  New Customers
                </p>
                <p className="mt-1 text-xl font-bold text-purple-600">
                  24
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
                <p className="text-sm text-gray-500">
                  Blog Posts
                </p>
                <p className="mt-1 text-xl font-bold text-blue-600">
                  12
                </p>
              </div>

              <Link
                to="/admin/blog"
                className="mt-2 inline-block text-sm font-medium text-green-600"
              >
                Manage Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">
              Sales Performance
            </h2>
            <p className="text-sm text-gray-500">
              Overview of this month's sales
            </p>
          </div>

          <span className="text-sm font-semibold text-green-600">
            +12.5%
          </span>
        </div>

        <div className="mt-6 flex h-48 items-end gap-3">
          {[35, 50, 42, 65, 55, 78, 68, 85, 72, 90, 82, 100].map(
            (height, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-green-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">
                  {index + 1}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Backend note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <strong>Note:</strong> The dashboard currently uses sample
        data. Connect these statistics, orders, customers, products,
        and sales data to your backend API later.
      </div>
    </div>
  );
}