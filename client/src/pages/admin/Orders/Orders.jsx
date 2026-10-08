import { useState } from "react";
import { Link } from "react-router-dom";
import useOrders from "../../../hooks/useOrders";

const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG")}`;

export default function Orders() {
  const { orders, updateOrder } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const lower = search.toLowerCase();
    const customerName = order.customer?.name || "";

    const matchesSearch =
      String(order.id).toLowerCase().includes(lower) ||
      customerName.toLowerCase().includes(lower) ||
      String(order.customer?.email || "")
        .toLowerCase()
        .includes(lower);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "Processing",
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track all customer orders.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {processingOrders}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {deliveredOrders}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search order ID, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-semibold text-green-600 hover:text-green-800"
                      >
                        {order.id}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customer?.email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {Array.isArray(order.items)
                        ? order.items.length
                        : order.items}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrder(order.id, { status: e.target.value })
                        }
                        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <strong>Note:</strong> Orders currently use sample data. Connect the
        orders and status updates to your backend API later.
      </div>
    </div>
  );
}
