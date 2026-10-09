import { useState } from "react";
import { Link } from "react-router-dom";
import useCustomers from "../../../hooks/useCustomers";

const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG")}`;

export default function Customers() {
  const { customers, updateCustomer, deleteCustomer } = useCustomers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search);

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id) => {
    const c = customers.find((x) => String(x.id) === String(id));
    if (!c) return;
    updateCustomer(id, {
      status: c.status === "Active" ? "Inactive" : "Active",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(id);
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;
  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all registered customers.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalCustomers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activeCustomers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Inactive Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {inactiveCustomers}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.phone}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {customer.orders}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          state={{ customer }}
                          className="text-sm font-medium text-green-600 hover:text-green-800"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => toggleStatus(customer.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {customer.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
