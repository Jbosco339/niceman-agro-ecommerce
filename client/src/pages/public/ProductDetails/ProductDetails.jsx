import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import useAuth from "../../../hooks/useAuth";
import { getProduct } from "../../../services/productService";
import {
  createReview,
  getProductReviews,
} from "../../../services/reviewService";
import { useFavorites } from "../../../context/FavoritesContext";

const emptyReview = {
  rating: 5,
  review: "",
  location: "",
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data } = await getProduct(id);
        if (!active) return;
        setProduct(data);
        setError("");
      } catch {
        if (!active) return;
        setError("Failed to load product.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchReviews = async () => {
      setReviewsLoading(true);

      try {
        const { data } = await getProductReviews(id);
        if (!active) return;

        const approvedReviews = Array.isArray(data)
          ? data.filter((review) => review?.status === "Approved")
          : [];
        setProductReviews(approvedReviews);
      } catch {
        if (!active) return;
        setProductReviews([]);
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };

    void fetchReviews();

    return () => {
      active = false;
    };
  }, [id]);

  const isWishlisted = !!product && isFavorite(product.id);
  const [addFeedback, setAddFeedback] = useState("");

  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0,
          ) / productReviews.length
        ).toFixed(1)
      : "5.0";

  const formatPrice = (price) => `₦${price.toLocaleString("en-NG")}`;

  const existingCartItem = product
    ? cartItems.find((item) => String(item.id) === String(product.id))
    : null;
  const quantity = existingCartItem ? existingCartItem.quantity : 1;

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
    if (reviewError) setReviewError("");
    if (reviewSuccess) setReviewSuccess("");
  };

  const handleProductReviewSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/account/login", {
        state: { from: `/products/${id}` },
      });
      return;
    }

    if (!product?.id) {
      setReviewError("Product information is unavailable to submit a review.");
      return;
    }

    const trimmedReview = reviewForm.review.trim();

    if (!trimmedReview) {
      setReviewError("Please write a short review before submitting.");
      return;
    }

    if (trimmedReview.length < 10) {
      setReviewError(
        "Please share a bit more detail so your review is helpful.",
      );
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const payload = {
        type: "product",
        product: String(product.id),
        customer: "",
        location: reviewForm.location.trim(),
        email: "",
        rating: Number(reviewForm.rating),
        review: trimmedReview,
        comment: trimmedReview,
        status: "Pending",
        date: new Date().toISOString(),
      };

      const { data } = await createReview(payload);
      setReviewSuccess("Thanks for your review");
      setReviewForm(emptyReview);
      setProductReviews((current) => {
        const next = current.filter((item) => item.id !== data?.id);
        return next;
      });
    } catch (requestError) {
      setReviewError(
        requestError?.message || "Unable to submit your review right now.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const increaseQuantity = () => {
    if (existingCartItem) {
      const next = existingCartItem.quantity + 1;
      updateQuantity(product.id, next);
      return;
    }

    addToCart(product, 1);
  };

  const decreaseQuantity = () => {
    if (!existingCartItem) {
      return;
    }

    const currentQty = existingCartItem.quantity;

    if (currentQty > 1) {
      updateQuantity(product.id, currentQty - 1);
      return;
    }

    removeFromCart(product.id);
  };

  const handleAddToCart = () => {
    if (existingCartItem) {
      const nextQty = existingCartItem.quantity + 1;
      updateQuantity(product.id, nextQty);
      setAddFeedback(`${product.name} quantity increased (${nextQty} in cart)`);
    } else {
      addToCart(product, 1);
      setAddFeedback(`${product.name} added to cart (1 in cart)`);
    }

    window.setTimeout(() => setAddFeedback(""), 1200);
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-gray-600">Loading product...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-[60vh] bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            {error || "The product you are looking for could not be found."}
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
            <div className="aspect-square overflow-hidden p-2 sm:p-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain object-center transition duration-300"
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
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
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
                {(
                  product.features || [
                    "Quality agricultural product",
                    "Suitable for farm use",
                    "Follow application instructions",
                    "Store in a cool, dry place",
                  ]
                ).map((feature) => (
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
                onClick={() => {
                  if (!product) return;
                  toggleFavorite(product);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-3.5 font-semibold transition ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={19}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
                {isWishlisted ? "Saved" : "Wishlist"}
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

              {/* <p className="mt-1 text-sm leading-6 text-green-800">
                Product availability, delivery options, and other order details
                will be connected to the store system later.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                Product Reviews
              </p>
              <h3 className="mt-2 text-2xl font-bold text-green-950">
                Customer feedback
              </h3>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
              Loading reviews...
            </div>
          ) : productReviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-600">
              No review available for this product yet.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {productReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.customer || "Anonymous"}
                      </h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-700">
                    “{review.comment || review.review || "Great product."}”
                  </p>
                  {review.location && (
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      {review.location}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-green-950">
                Leave a review for this product
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {isAuthenticated
                  ? "Share your experience with this product."
                  : "Sign in to share your experience with this product."}
              </p>
            </div>

            {!isAuthenticated ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  You need to be logged in to submit a review.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/account/login", {
                      state: { from: `/products/${id}` },
                    })
                  }
                  className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleProductReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((current) => ({
                            ...current,
                            rating: star,
                          }))
                        }
                        className={`text-2xl ${
                          star <= reviewForm.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        aria-label={`Rate ${star} out of 5`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your review
                  </label>
                  <textarea
                    id="product-review"
                    name="review"
                    rows={5}
                    value={reviewForm.review}
                    onChange={handleReviewChange}
                    placeholder="Tell other customers about your experience with this product."
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="product-location"
                    name="location"
                    type="text"
                    value={reviewForm.location}
                    onChange={handleReviewChange}
                    placeholder="Lagos, Abuja, Ogun, Kaduna..."
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>

                {reviewError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {reviewError}
                  </div>
                )}

                {reviewSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {reviewSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-500"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
