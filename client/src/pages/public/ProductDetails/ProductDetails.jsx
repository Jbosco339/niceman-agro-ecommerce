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
import { getProduct } from "../../../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then(({ data }) => {
        setProduct(data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load product.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addFeedback, setAddFeedback] = useState("");

  const formatPrice = (price) => `₦${price.toLocaleString("en-NG")}`;

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

  const increaseQuantity = () => {
    if (quantity < (product.stock || 0)) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const isProductInCart = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    const existingQty = isProductInCart ? isProductInCart.quantity : 0;
    const nextQty = existingQty + quantity;
    setAddFeedback(`${product.name} added to cart (${nextQty} in cart)`);

    window.setTimeout(() => setAddFeedback(""), 1200);
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
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>

              <span className="text-sm text-gray-500">
                5.0 (Customer rating)
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
                onClick={() => setIsWishlisted((current) => !current)}
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

              <p className="mt-1 text-sm leading-6 text-green-800">
                Product availability, delivery options, and other order details
                will be connected to the store system later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
