import { useState } from "react";
import useBlogPosts from "../../../hooks/useBlogPosts";

const BlogManagement = () => {
  const { posts, addPost, updatePost, deletePost } = useBlogPosts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Agriculture",
    author: "",
    content: "",
    status: "Draft",
  });

  const categories = [
    "Agriculture",
    "Farming Tips",
    "Healthy Living",
    "Market News",
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || post.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPost) {
      updatePost(editingPost.id, {
        title: formData.title,
        category: formData.category,
        author: formData.author,
        status: formData.status,
      });
    } else {
      const newPost = {
        // id will be assigned by addPost if not provided
        title: formData.title,
        category: formData.category,
        author: formData.author || "Admin",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: formData.status,
      };

      addPost(newPost);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Agriculture",
      author: "",
      content: "",
      status: "Draft",
    });

    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);

    setFormData({
      title: post.title,
      category: post.category,
      author: post.author,
      content: "",
      status: post.status,
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id);
    }
  };

  const toggleStatus = (id) => {
    const p = posts.find((x) => String(x.id) === String(id));
    if (!p) return;
    updatePost(id, {
      status: p.status === "Published" ? "Draft" : "Published",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Blog Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage Niceman Agro & Farms blog posts.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">Total Posts</p>
          <h2 className="text-2xl font-bold mt-1">{posts.length}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">Published</p>
          <h2 className="text-2xl font-bold text-green-700 mt-1">
            {posts.filter((post) => post.status === "Published").length}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-gray-500 text-sm">Drafts</p>
          <h2 className="text-2xl font-bold text-yellow-600 mt-1">
            {posts.filter((post) => post.status === "Draft").length}
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Author
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {post.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{post.category}</td>

                    <td className="px-6 py-4 text-gray-600">{post.author}</td>

                    <td className="px-6 py-4 text-gray-600">{post.date}</td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? "Edit Blog Post" : "Create Blog Post"}
              </h2>

              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Post Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter blog title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Author
                  </label>

                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>

                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="7"
                  required
                  placeholder="Write your blog post..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold"
                >
                  {editingPost ? "Update Post" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
