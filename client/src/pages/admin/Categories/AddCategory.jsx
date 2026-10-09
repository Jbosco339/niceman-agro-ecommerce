import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategories from "../../../hooks/useCategories";
import { handleLocalImageUpload } from "../../../utils/localImageUpload";

const AddCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: "Active",
  });

  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const { addCategory } = useCategories();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    setSaving(true);

    try {
      // add to shared CategoryContext
      addCategory({
        name: formData.name,
        description: formData.description,
        image: formData.image,
        status: formData.status || "Active",
      });

      setSaving(false);
      navigate("/admin/categories");
    } catch (err) {
      // keep original UI behavior: stop saving and log
      console.error("Failed to add category", err);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          to="/admin/categories"
          className="text-sm text-green-700 hover:text-green-800"
        >
          ← Back to Categories
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
          Add Category
        </h1>

        <p className="text-gray-500 mt-1">
          Create a new product category for Niceman Agro & Farms.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-5 sm:p-8"
      >
        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Fresh Vegetables"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe this product category..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Image
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

            {preview && (
              <img
                src={preview}
                alt="Category preview"
                className="mt-4 w-48 h-48 object-cover rounded-xl border border-gray-200 bg-gray-50"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
          >
            {saving ? "Saving..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
