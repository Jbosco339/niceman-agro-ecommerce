import { Link, useParams } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";

const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG")}`;

export default function ProductDetails() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/admin/products"
            className="text-sm font-medium text-green-600 hover:text-green-800"
          >
            ← Back to Products
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>
        </div>
      </div>
    );
  }

  const stockStatus =
    product.stock === 0
      ? "Out of Stock"
      : product.stock <= 10
        ? "Low Stock"
        : "In Stock";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="text-sm font-medium text-green-600 hover:text-green-800"
          >
            ← Back to Products
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Product Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View complete information about this product.
          </p>
        </div>

        <Link
          to={`/admin/products/edit/${id}`}
          className="w-fit rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          Edit Product
        </Link>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Image */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">{product.category}</p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {product.name}
              </h2>
            </div>

            <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {product.status}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm leading-6 text-gray-600">
              {product.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Price
              </p>
              <p className="mt-1 text-xl font-bold text-green-600">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Stock
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {product.stock}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Units Sold
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {product.sales || 0}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Inventory Status</span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  stockStatus === "In Stock"
                    ? "bg-green-100 text-green-700"
                    : stockStatus === "Low Stock"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {stockStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Product Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Product Information
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-500">Product ID</span>
              <span className="text-sm font-medium text-gray-900">
                {product.id}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium text-gray-900">
                {product.category}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-medium text-green-600">
                {product.status}
              </span>
            </div>
          </div>
        </div>

        {/* Sales Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Sales Information</h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Units Sold</span>
              <span className="text-sm font-semibold text-gray-900">
                {product.sales || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Current Stock</span>
              <span className="text-sm font-semibold text-gray-900">
                {product.stock} units
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Revenue Generated</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency((product.sales || 0) * product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/admin/products/edit/${id}`}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          Edit Product
        </Link>

        <Link
          to="/admin/inventory"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          View Inventory
        </Link>

        <Link
          to="/admin/products"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          All Products
        </Link>
      </div>
    </div>
  );
}
