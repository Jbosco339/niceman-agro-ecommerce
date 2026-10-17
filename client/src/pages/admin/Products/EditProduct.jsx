import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../../services/adminService";
import { useCategoryContext } from "../../../context/CategoryContext";
import { handleLocalImageUpload } from "../../../utils/localImageUpload";

const normalizeProduct = (product) => ({
  ...product,
  id: product?.id ?? product?._id ?? "",
  category: product?.category ?? "",
  name: product?.name ?? "Unnamed Product",
  price: String(product?.price ?? ""),
  stock: String(product?.stock ?? ""),
  image: product?.image || "",
});

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories = [] } = useCategoryContext();
  const categoryOptions =
    categories
      .filter((category) => category?.name)
      .map((category) => category.name) || [];

  const [formData, setFormData] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(({ data }) => {
        const nextProduct = normalizeProduct(data);
        setFormData(nextProduct);
        setPreview(nextProduct.image || "");
        setError("");
      })
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    setError("");
    try {
      setUploadingImage(true);
      await handleLocalImageUpload(e, (nextImage) => {
        setFormData((prev) => ({ ...prev, image: nextImage }));
        setPreview(nextImage);
      });
    } catch (requestError) {
      setError(requestError.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData) {
      setSaving(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || "",
      status: formData.status,
    };

    if (!payload.name || !payload.category || !payload.description) {
      setError("Name, category, and description are required.");
      setSaving(false);
      return;
    }

    if (!payload.image) {
      setError("Please upload a product image before saving.");
      setSaving(false);
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      setError("Price must be a valid non-negative number.");
      setSaving(false);
      return;
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      setError("Stock must be a whole non-negative number.");
      setSaving(false);
      return;
    }

    try {
      await updateProduct(id, payload);
      navigate("/admin/products");
    } catch (requestError) {
      setError(requestError.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (!formData) {
    const message =
      error ||
      (id
        ? "Loading product…"
        : "Select a product from the products list to edit it.");
    return (
      <p role={error ? "alert" : "status"} className="p-6">
        {message}
      </p>
    );
  }

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

        <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Product</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update product information and inventory.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {error}
          </p>
        )}
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
              {categoryOptions.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
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
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Stock Quantity
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
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

          {/* Image Upload */}
          <div>
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
              {uploadingImage
                ? "Uploading image…"
                : "Upload a new image to replace the current one. Supported: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, AVIF, ICO."}
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
              placeholder="Describe the product..."
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
                  alt={formData.name}
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
            className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
