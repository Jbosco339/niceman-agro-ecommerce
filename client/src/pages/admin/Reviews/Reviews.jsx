import { useMemo, useState } from "react";
import { Eye, Search, Star, Trash2, CheckCheck, XCircle } from "lucide-react";
import useProducts from "../../../hooks/useProducts";
import useReviews from "../../../hooks/useReviews";

const tabs = [
  "All Reviews",
  "General Reviews",
  "Product Reviews",
  "Pending",
  "Approved",
  "Rejected",
];

export default function Reviews() {
  const { reviews, approveReview, rejectReview, deleteReview } = useReviews();
  const { getProduct } = useProducts();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const filteredReviews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const productName =
        review.type === "product"
          ? getProduct(review.productId)?.name ||
            review.productName ||
            review.product ||
            ""
          : "";

      const searchable = [
        review.customer,
        review.email,
        review.product,
        review.productName,
        productName,
        review.review,
        review.comment,
        review.type,
        review.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchable.includes(normalizedSearch);

      const matchesTab =
        activeTab === "All Reviews"
          ? true
          : activeTab === "General Reviews"
            ? review.type === "general"
            : activeTab === "Product Reviews"
              ? review.type === "product"
              : review.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [reviews, search, activeTab, getProduct]);

  const totalReviews = reviews.length;
  const generalReviews = reviews.filter(
    (review) => review.type === "general",
  ).length;
  const productReviews = reviews.filter(
    (review) => review.type === "product",
  ).length;
  const approvedReviews = reviews.filter(
    (review) => review.status === "Approved",
  ).length;
  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending",
  ).length;
  const rejectedReviews = reviews.filter(
    (review) => review.status === "Rejected",
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const selectedReview =
    reviews.find((review) => String(review.id) === String(selectedReviewId)) ||
    null;

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= Number(rating || 0) ? "text-yellow-400" : "text-gray-300"
          }
          fill={star <= Number(rating || 0) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );

  const getStatusClasses = (status) => {
    if (status === "Approved")
      return "bg-green-100 text-green-700 border border-green-200";
    if (status === "Rejected")
      return "bg-red-100 text-red-700 border border-red-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const getTypeClasses = (type) =>
    type === "product"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-sky-100 text-sky-700 border border-sky-200";

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );
    if (!confirmed) return;

    deleteReview(id);
    if (selectedReviewId === id) setSelectedReviewId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reviews Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer experience feedback and product reviews from one
            shared review store.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {totalReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Average
          </p>
          <div className="mt-2 flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {averageRating}
            </h2>
            <Star size={16} className="text-yellow-400" fill="currentColor" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            General
          </p>
          <h2 className="mt-2 text-2xl font-bold text-sky-600">
            {generalReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Product
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            {productReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Approved
          </p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {approvedReviews}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Pending
          </p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {pendingReviews}
          </h2>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-green-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              aria-label="Search reviews"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reviews..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-green-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-xs text-gray-500">
          <span>{filteredReviews.length} review(s) shown</span>
          <span>{rejectedReviews} rejected</span>
        </div>
      </div>

      {selectedReview && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeClasses(selectedReview.type)}`}
                >
                  {selectedReview.type === "product"
                    ? "Product Review"
                    : "General Review"}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(selectedReview.status)}`}
                >
                  {selectedReview.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedReview.customer}
                </p>
                <p className="text-xs text-gray-500">{selectedReview.date}</p>
              </div>

              <div className="flex items-center gap-2">
                {renderStars(selectedReview.rating)}
                <span className="text-sm font-medium text-gray-700">
                  {selectedReview.rating}/5
                </span>
              </div>

              {selectedReview.type === "product" && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Product:</span>{" "}
                  {getProduct(selectedReview.productId)?.name ||
                    selectedReview.productName ||
                    selectedReview.product ||
                    "Unknown product"}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedReview.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => approveReview(selectedReview.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    <CheckCheck size={14} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectReview(selectedReview.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedReviewId(null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close details
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-700">
            “
            {selectedReview.review ||
              selectedReview.comment ||
              "No review text available."}
            ”
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-semibold text-gray-800">
              No reviews match this filter.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or switch to a different review group.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const reviewProductName =
              review.type === "product"
                ? getProduct(review.productId)?.name ||
                  review.productName ||
                  review.product ||
                  "Unknown product"
                : null;

            return (
              <div
                key={review.id}
                className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {review.customer}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {review.email || "No email provided"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getTypeClasses(review.type)}`}
                        >
                          {review.type === "product"
                            ? "Product Review"
                            : "General Review"}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(review.status)}`}
                        >
                          {review.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      “
                      {review.review ||
                        review.comment ||
                        "No review text available."}
                      ”
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>{review.date}</span>
                      {review.type === "product" && reviewProductName && (
                        <span>Product: {reviewProductName}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 xl:min-w-[180px] xl:items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedReviewId((current) =>
                          current === review.id ? null : review.id,
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={14} />
                      {selectedReviewId === review.id
                        ? "Hide details"
                        : "View details"}
                    </button>

                    {review.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => approveReview(review.id)}
                          className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                        >
                          <CheckCheck size={14} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectReview(review.id)}
                          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
