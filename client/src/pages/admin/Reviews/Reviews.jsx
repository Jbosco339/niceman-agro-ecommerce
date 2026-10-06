import { useState } from "react";
import { Link } from "react-router-dom";

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "John Doe",
      email: "johndoe@example.com",
      product: "Fresh Tomatoes",
      rating: 5,
      comment: "Very fresh tomatoes and excellent quality. Will order again.",
      date: "Oct 5, 2026",
      status: "Approved",
    },
    {
      id: 2,
      customer: "Sarah Williams",
      email: "sarah@example.com",
      product: "Premium Rice",
      rating: 4,
      comment: "Good quality rice and fast delivery.",
      date: "Oct 4, 2026",
      status: "Approved",
    },
    {
      id: 3,
      customer: "Michael Johnson",
      email: "michael@example.com",
      product: "Fresh Chicken",
      rating: 3,
      comment: "The product was okay but delivery took longer than expected.",
      date: "Oct 3, 2026",
      status: "Pending",
    },
    {
      id: 4,
      customer: "Grace Okafor",
      email: "grace@example.com",
      product: "Fresh Mangoes",
      rating: 2,
      comment: "The mangoes were not as fresh as I expected.",
      date: "Oct 2, 2026",
      status: "Pending",
    },
    {
      id: 5,
      customer: "David Williams",
      email: "david@example.com",
      product: "Irish Potatoes",
      rating: 5,
      comment: "Excellent quality. Everything arrived fresh.",
      date: "Oct 1, 2026",
      status: "Approved",
    },
  ]);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const approveReview = (id) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status: "Approved" } : review
      )
    );
  };

  const rejectReview = (id) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status: "Rejected" } : review
      )
    );
  };

  const deleteReview = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    setReviews((current) =>
      current.filter((review) => review.id !== id)
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.email.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "All" ||
      review.rating === Number(ratingFilter);

    const matchesStatus =
      statusFilter === "All" || review.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(
    (review) => review.status === "Approved"
  ).length;
  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Reviews
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage customer feedback about your products.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="mt-2 flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {averageRating}
            </h2>
            <span className="text-xl text-yellow-400">★</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {approvedReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Pending Review</p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {pendingReviews}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search customer, product or review..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Review Content */}
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.customer}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {review.email}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {review.product}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {renderStars(review.rating)}

                  <span className="text-sm font-medium text-gray-700">
                    {review.rating}/5
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  "{review.comment}"
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  Submitted {review.date}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 lg:w-52 lg:justify-end">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    review.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : review.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {review.status}
                </span>

                {review.status === "Pending" && (
                  <>
                    <button
                      onClick={() => approveReview(review.id)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectReview(review.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="rounded-xl bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
            No reviews found.
          </div>
        )}
      </div>

      {/* Backend Note */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        Review data is currently stored locally for development. Connect this
        page to the backend API when the server is ready.
      </div>
    </div>
  );
}