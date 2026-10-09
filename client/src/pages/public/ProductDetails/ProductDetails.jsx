import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useFavorites } from "../../../context/FavoritesContext";
import useProducts from "../../../hooks/useProducts";
import useReviews from "../../../hooks/useReviews";

function ProductDetails() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { getProductReviews, addReview } = useReviews();

  const product = getProduct(id);

  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Remove local `quantity` state; derive from cartItems (single source of truth)
  const [addFeedback, setAddFeedback] = useState("");
  const [reviewForm, setReviewForm] = useState({
    customer: "",
    rating: 5,
    review: "",
  });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const defaultCustomerName = (() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return "";

      const user = JSON.parse(savedUser);
      return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    } catch (error) {
      console.error("Unable to read saved customer for product review", error);
      return "";
    }
  })();

  useEffect(() => {
    if (defaultCustomerName && !reviewForm.customer) {
      setReviewForm((current) => ({
        ...current,
        customer: defaultCustomerName,
      }));
    }
  }, [defaultCustomerName, reviewForm.customer]);

  const productReviews = product
    ? getProductReviews(product.id).filter((item) => item.status === "Approved")
    : [];

  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((total, review) => total + review.rating, 0) /
          productReviews.length
        ).toFixed(1)
      : "0.0";

  const formatPrice = (price) => `₦${price.toLocaleString("en-NG")}`;

  if (!product) {
    return (
      <section className="min-h-[60vh] bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            The product you are looking for could not be found.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const increaseQuantity = () => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      const next = existing.quantity + 1;
      updateQuantity(product.id, next);
    } else {
      addToCart(product, 1);
    }
  };

  const decreaseQuantity = () => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      const currentQty = existing.quantity;
      if (currentQty > 1) {
        updateQuantity(product.id, currentQty - 1);
      } else if (currentQty === 1) {
        removeFromCart(product.id);
      }
    }
  };

  const isProductInCart = cartItems.find((item) => item.id === product.id);
  const quantity = isProductInCart ? isProductInCart.quantity : 0;

  const handleAddToCart = () => {
    if (isProductInCart) {
      // increase existing quantity by 1
      updateQuantity(product.id, isProductInCart.quantity + 1);
      setAddFeedback(
        `${product.name} quantity increased (${isProductInCart.quantity + 1} in cart)`,
      );
    } else {
      // add new product with quantity 1
      addToCart(product, 1);
      setAddFeedback(`${product.name} added to cart (1 in cart)`);
    }

    window.setTimeout(() => setAddFeedback(""), 1200);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!product || !product.id) {
      setReviewError(
        "This product review cannot be submitted because the product is missing.",
      );
      return;
    }

    const customerName = reviewForm.customer.trim();
    const reviewText = reviewForm.review.trim();

    if (!customerName) {
      setReviewError("Please enter your name before submitting a review.");
      return;
    }

    if (!reviewText) {
      setReviewError("Please write your review before submitting.");
      return;
    }

    if (reviewText.length < 20) {
      setReviewError(
        "Please provide at least 20 characters so your review is useful to others.",
      );
      return;
    }

    addReview({
      type: "product",
      productId: Number(product.id),
      customer: customerName,
      rating: Number(reviewForm.rating),
      review: reviewText,
      status: "Pending",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    setReviewForm({ customer: customerName, rating: 5, review: "" });
    setReviewError("");
    setReviewMessage(
      "Your product review has been submitted and is awaiting admin approval.",
    );
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-green-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/shop"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>

          <p className="text-sm font-semibold uppercase tracking-wider text-green-300">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              {product.category}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(Number(averageRating))
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      star <= Math.round(Number(averageRating))
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-gray-500">
                {averageRating} ({productReviews.length} review
                {productReviews.length === 1 ? "" : "s"})
              </span>
            </div>

            {/* Price */}
            <p className="mt-6 text-3xl font-bold text-green-800">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900">
                Product Features
              </h3>

              <ul className="mt-4 space-y-3">
                {(product.features || []).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-gray-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Check size={13} />
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Quantity
              </p>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-11 w-11 items-center justify-center rounded-l-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
                >
                  <Minus size={17} />
                </button>

                <div className="flex h-11 w-14 items-center justify-center border-y border-gray-300 text-sm font-semibold text-gray-900">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="flex h-11 w-11 items-center justify-center rounded-r-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-800 px-6 py-3.5 font-semibold text-white transition hover:bg-green-900"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-3.5 font-semibold transition ${
                  isFavorite(product.id)
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={19}
                  fill={isFavorite(product.id) ? "currentColor" : "none"}
                />
                {isFavorite(product.id) ? "Saved" : "Wishlist"}
              </button>
            </div>

            {addFeedback && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
                <Check size={16} />
                {addFeedback}
              </div>
            )}

            {/* Delivery Info */}
            <div className="mt-8 rounded-xl border border-green-100 bg-green-50 p-5">
              <p className="font-semibold text-green-900">
                Quality agricultural products
              </p>

              <p className="mt-1 text-sm leading-6 text-green-800">
                Product availability, delivery options, and other order details
                will be connected to the store system later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Customer Reviews
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {productReviews.length > 0
                  ? `${productReviews.length} approved review${productReviews.length === 1 ? "" : "s"} for this product.`
                  : "No approved reviews yet for this product."}
              </p>
            </div>

            {productReviews.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-green-800 shadow-sm">
                <span className="text-yellow-500">★</span>
                {averageRating} average rating
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h4 className="text-md font-semibold text-gray-900">
              Leave a Review
            </h4>

            <form
              onSubmit={handleReviewSubmit}
              className="mt-4 space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>

                <input
                  type="text"
                  id="customerName"
                  value={reviewForm.customer}
                  onChange={(e) => {
                    setReviewForm({ ...reviewForm, customer: e.target.value });
                    setReviewError("");
                    setReviewMessage("");
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm outline-none focus:border-green-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>

                <select
                  id="rating"
                  value={reviewForm.rating}
                  onChange={(e) => {
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    });
                    setReviewError("");
                    setReviewMessage("");
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm outline-none focus:border-green-500"
                  required
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reviewText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Review
                </label>

                <textarea
                  id="reviewText"
                  rows="4"
                  value={reviewForm.review}
                  onChange={(e) => {
                    setReviewForm({ ...reviewForm, review: e.target.value });
                    setReviewError("");
                    setReviewMessage("");
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm outline-none focus:border-green-500"
                  placeholder="Tell us how this product performed for you."
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-green-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                Submit Review
              </button>
            </form>

            {reviewError && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {reviewError}
              </div>
            )}

            {reviewMessage && (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {reviewMessage}
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="mt-10 space-y-6">
            {productReviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                No approved reviews for this product yet. Be the first to share
                your experience.
              </div>
            ) : (
              productReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                        {review.customer
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {review.customer}
                        </p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          fill={index < review.rating ? "currentColor" : "none"}
                          className={
                            index < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    “{review.review}”
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
