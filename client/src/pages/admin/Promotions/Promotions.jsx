import { useState } from "react";
import { Link } from "react-router-dom";

export default function Promotions() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Fresh Produce Discount",
      code: "FRESH20",
      type: "Percentage",
      value: 20,
      startDate: "Oct 1, 2026",
      endDate: "Oct 15, 2026",
      usage: 34,
      status: "Active",
    },
    {
      id: 2,
      name: "New Customer Discount",
      code: "WELCOME10",
      type: "Percentage",
      value: 10,
      startDate: "Sep 1, 2026",
      endDate: "Dec 31, 2026",
      usage: 58,
      status: "Active",
    },
    {
      id: 3,
      name: "Rice Special Offer",
      code: "RICE5000",
      type: "Fixed",
      value: 5000,
      startDate: "Sep 20, 2026",
      endDate: "Oct 10, 2026",
      usage: 21,
      status: "Active",
    },
    {
      id: 4,
      name: "Harvest Season Sale",
      code: "HARVEST25",
      type: "Percentage",
      value: 25,
      startDate: "Aug 1, 2026",
      endDate: "Aug 31, 2026",
      usage: 76,
      status: "Expired",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const toggleStatus = (id) => {
    setPromotions((current) =>
      current.map((promotion) =>
        promotion.id === id
          ? {
              ...promotion,
              status:
                promotion.status === "Active" ? "Inactive" : "Active",
            }
          : promotion
      )
    );
  };

  const deletePromotion = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this promotion?"
    );

    if (!confirmed) return;

    setPromotions((current) =>
      current.filter((promotion) => promotion.id !== id)
    );
  };

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(search.toLowerCase()) ||
      promotion.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || promotion.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter(
    (promotion) => promotion.status === "Active"
  ).length;
  const inactivePromotions = promotions.filter(
    (promotion) => promotion.status === "Inactive"
  ).length;
  const expiredPromotions = promotions.filter(
    (promotion) => promotion.status === "Expired"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discounts and promotional offers.
          </p>
        </div>

        <Link
          to="/admin/promotions/add"
          className="w-fit rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
        >
          + Create Promotion
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Promotions</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalPromotions}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activePromotions}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Inactive</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-600">
            {inactivePromotions}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Expired</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {expiredPromotions}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search promotion or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Promotion
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Code
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Discount
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Duration
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Usage
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {promotion.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Promotion #{promotion.id}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      {promotion.code}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {promotion.type === "Percentage"
                      ? `${promotion.value}%`
                      : formatCurrency(promotion.value)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{promotion.startDate}</div>
                    <div className="text-xs text-gray-400">
                      to {promotion.endDate}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {promotion.usage} uses
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(promotion.id)}
                      disabled={promotion.status === "Expired"}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        promotion.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : promotion.status === "Expired"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {promotion.status}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/promotions/edit/${promotion.id}`}
                        className="text-sm font-medium text-green-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deletePromotion(promotion.id)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPromotions.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No promotions found.
          </div>
        )}
      </div>

      {/* Backend Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        Promotion data is currently stored locally for development. Connect
        this page to the backend API when the server is ready.
      </div>
    </div>
  );
}