import { useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import useCategories from "../../../hooks/useCategories";

export default function Products() {
  const {
    products,
    toggleStatus: toggleStatusHook,
    deleteProduct: deleteProductHook,
  } = useProducts();
  const { activeCategories } = useCategories();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const toggleStatus = (id) => {
    // delegate to shared product hook
    toggleStatusHook(id);
  };

  const deleteProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    // delegate to shared product hook
    deleteProductHook(id);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (product) => product.status === "Active",
  ).length;
  const lowStock = products.filter(
    (product) => product.stock > 0 && product.stock <= 10,
  ).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all products in your store.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/inventory"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Inventory
          </Link>

          <Link
            to="/admin/products/add"
            className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalProducts}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Products</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activeProducts}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {lowStock}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">{outOfStock}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Categories</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Stock Status
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
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />

                        <div>
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="font-medium text-gray-900 hover:text-green-700"
                          >
                            {product.name}
                          </Link>

                          <p className="text-xs text-gray-500">
                            ID: #{product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          stockStatus === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : stockStatus === "Low Stock"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stockStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          View
                        </Link>

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-sm font-medium text-green-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No products found.
          </div>
        )}
      </div>

      {/* Backend note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        Product data is currently stored locally for development. Connect this
        page to the backend API when the server is ready.
      </div>
    </div>
  );
}
