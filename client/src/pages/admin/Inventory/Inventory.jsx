import { useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";

const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG")}`;

export default function Inventory() {
  const { products, updateStock: sharedUpdateStock } = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || getStockStatus(product.stock) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStock = (id, amount) => {
    // delegate to shared product store
    sharedUpdateStock(id, amount);
  };

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock > 10).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage your product stock.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalProducts}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">In Stock</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{inStock}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{lowStock}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{outOfStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <Link
            to="/admin/products"
            className="rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-green-700"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                  Stock
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(product.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {product.stock}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          units
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "In Stock"
                              ? "bg-green-100 text-green-700"
                              : status === "Low Stock"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateStock(product.id, -1)}
                            disabled={product.stock === 0}
                            className="h-8 w-8 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <button
                            onClick={() => updateStock(product.id, 1)}
                            className="h-8 w-8 rounded-lg bg-green-600 font-bold text-white hover:bg-green-700"
                          >
                            +
                          </button>

                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backend Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <strong>Note:</strong> Inventory is currently using sample data. Connect
        the stock values to your backend API later.
      </div>
    </div>
  );
}
