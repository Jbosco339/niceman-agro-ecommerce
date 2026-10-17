import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getReviews as fetchReviews } from "../services/adminService";

export const initialReviews = [];

const normalizeReview = (review, fallbackId = Date.now()) => {
  if (!review || typeof review !== "object") return null;

  const safeType = review.type === "product" ? "product" : "general";
  const safeStatus =
    review.status === "Approved" || review.status === "Rejected"
      ? review.status
      : "Pending";

  const safeComment = review.review || review.comment || "";
  const safeEmail = review.email || "";
  const safeProductName =
    review.productName ||
    review.product ||
    (safeType === "product" ? "Product Review" : "General Experience");
  const safeProduct =
    safeType === "product" ? safeProductName : "General Experience";

  return {
    id: review.id || `review-${fallbackId}`,
    type: safeType,
    customer: review.customer || review.name || "Anonymous",
    email: safeEmail,
    product: safeProduct,
    productName: safeProductName,
    rating: Math.min(5, Math.max(1, Number(review.rating || 5))),
    review: safeComment,
    comment: safeComment,
    date:
      review.date ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    status: safeStatus,
    productId:
      safeType === "product"
        ? Number(review.productId ?? review.product_id)
        : null,
  };
};

export const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    fetchReviews()
      .then(({ data }) => {
        if (!active) return;
        const next = Array.isArray(data)
          ? data.map(normalizeReview).filter(Boolean)
          : [];
        setReviews(next);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        setReviews([]);
        setError(requestError?.message || "Failed to load reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateReview = (id, changes) => {
    setReviews((current) =>
      current.map((review) =>
        String(review.id) === String(id)
          ? normalizeReview({ ...review, ...changes }, String(id))
          : review,
      ),
    );
  };

  const addReview = (review) => {
    const nextReview = normalizeReview(
      {
        ...review,
        id:
          review.id ||
          `review-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        type: review.type === "product" ? "product" : "general",
        status: review.status || "Pending",
      },
      Date.now(),
    );

    setReviews((current) => [nextReview, ...current]);
    return nextReview;
  };

  const deleteReview = (id) => {
    setReviews((current) =>
      current.filter((review) => String(review.id) !== String(id)),
    );
  };

  const approveReview = (id) => updateReview(id, { status: "Approved" });
  const rejectReview = (id) => updateReview(id, { status: "Rejected" });

  const getReviewsState = () => reviews;
  const getGeneralReviews = () =>
    reviews.filter((review) => review.type === "general");
  const getProductReviews = (productId) =>
    reviews.filter(
      (review) =>
        review.type === "product" &&
        String(review.productId) === String(productId),
    );

  const value = useMemo(
    () => ({
      reviews,
      setReviews,
      loading,
      error,
      addReview,
      updateReview,
      deleteReview,
      approveReview,
      rejectReview,
      getReviews: getReviewsState,
      getGeneralReviews,
      getProductReviews,
    }),
    [reviews, loading, error],
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export function useReviewContext() {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReviewContext must be used within a ReviewProvider");
  }

  return context;
}
