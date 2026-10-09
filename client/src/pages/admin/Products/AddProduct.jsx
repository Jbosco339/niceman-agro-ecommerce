import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategories from "../../../hooks/useCategories";
import useProducts from "../../../hooks/useProducts";
import { handleLocalImageUpload } from "../../../utils/localImageUpload";

export default function AddProduct() {
  const navigate = useNavigate();
  const { activeCategories } = useCategories();
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    status: "Active",
    featured: false,
  });

  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image") {
      setPreview(value);
    }
  };

  const handleImageUpload = async (e) => {
    const dataUrl = await handleLocalImageUpload(e, (nextImage) => {
      setFormData((prev) => ({ ...prev, image: nextImage }));
      setPreview(nextImage);
    });

    if (!dataUrl && formData.image) {
      setPreview(formData.image);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock ? Number(formData.stock) : 0,
      featured: Boolean(formData.featured),
      sku: formData.sku || `NAG-${Date.now()}`,
      image: formData.image || "/images/products/placeholder.jpg",
    };

    addProduct(newProduct);
    navigate("/admin/products");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/products"
          className="text-sm font-medium text-green-600 hover:text-green-800"
        >
          ← Back to Products
        </Link>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add Product</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new product to your store.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fresh Tomatoes"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            >
              <option value="">Select category</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              SKU
            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. NAG-FRT-001"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price (₦)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 3500"
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Stock Quantity (Optional)
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <p className="mt-1 text-xs text-gray-500">
              Stock management will be enabled after backend integration.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Mark as featured product
            </label>
          </div>

          {/* Image Upload */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />

            <p className="mt-2 text-xs text-gray-500">
              Upload a local image or keep an existing image URL if already
              saved.
            </p>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="lg:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Image Preview
              </p>

              <div className="h-48 w-48 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={preview}
                  alt={formData.name || "Product preview"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
