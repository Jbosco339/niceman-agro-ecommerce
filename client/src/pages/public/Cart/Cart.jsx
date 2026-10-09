import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../../../context/CartContext";

function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartTotal;
  const deliveryFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    const validationMessage = (() => {
      if (!cartItems || cartItems.length === 0) {
        return "Your cart is empty. Add at least one product before proceeding to checkout.";
      }

      const invalidItem = cartItems.find(
        (item) =>
          !item ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0,
      );

      if (invalidItem) {
        return "One or more items in your cart have an invalid quantity. Please update them before checkout.";
      }

      return "";
    })();

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        deliveryFee,
        total,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-green-950 px-4 py-12 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold md:text-4xl">Shopping Cart</h1>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-4 py-12">
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-800">
              <ShoppingCart className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-600">
              You haven&apos;t added any products yet. Browse our shop to
              discover quality agricultural essentials.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-green-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold md:text-4xl">Shopping Cart</h1>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
              >
                {/* Image box */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Main details */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 truncate">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {item.category}
                  </p>

                  <div className="mt-2 flex items-center gap-4">
                    <p className="font-semibold text-green-800">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Item total: ₦
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded-lg border p-2 hover:bg-gray-100"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-6 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded-lg border p-2 hover:bg-gray-100"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 ml-2"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mt-6 space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="my-5 border-t" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="mt-6 w-full rounded-lg bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;
