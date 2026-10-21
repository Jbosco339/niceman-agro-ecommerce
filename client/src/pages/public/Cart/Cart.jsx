import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../../../context/CartContext";

const formatCurrency = (value) => `₦${Number(value).toLocaleString("en-NG")}`;

function Cart() {
  const { cartItems, cartTotal, updateQuantity } = useCart();
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

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.9fr)] lg:items-start">
          <div className="space-y-3 min-w-0">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:gap-4 sm:p-3.5"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-24 sm:w-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain object-center p-1.5"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-green-700 sm:text-[11px]">
                      {item.category}
                    </p>
                    <h2 className="mt-1 wrap-break-word text-sm font-bold leading-5 text-slate-900 sm:text-base">
                      {item.name}
                    </h2>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-2 sm:gap-3">
                    <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                          Unit price
                        </p>
                        <p className="mt-1 text-xs font-bold text-green-800 sm:text-sm">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[10px] font-medium text-slate-500 sm:text-[11px]">
                          Item total:
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-900 sm:text-sm">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-green-600 hover:text-green-700 sm:h-9 sm:w-9"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <span className="flex h-8 min-w-[2.1rem] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1 text-sm font-semibold text-slate-800 sm:h-9 sm:min-w-[2.3rem]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-green-600 hover:text-green-700 sm:h-9 sm:w-9"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-4">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-medium text-slate-800">
                  {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-slate-200" />

            <div className="flex items-center justify-between gap-3 text-base font-bold text-slate-900 sm:text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="mt-5 h-12 w-full rounded-lg bg-green-800 px-4 text-sm font-semibold text-white transition hover:bg-green-900 sm:text-base"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Cart;
