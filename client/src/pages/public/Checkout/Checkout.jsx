import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const bankDetails = {
  accountName: "Niceman Agro & Farms",
  bankName: "Access Bank",
  accountNumber: "1234567890",
};

const Checkout = () => {
  const location = useLocation();
  const { cartItems: cartContextItems, cartTotal } = useCart();

  const cartItems = location.state?.cartItems ?? cartContextItems ?? [];
  const subtotal = location.state?.subtotal ?? cartTotal ?? 0;
  const deliveryFee =
    location.state?.deliveryFee ?? (subtotal >= 50000 ? 0 : 3000);
  const total = location.state?.total ?? subtotal + deliveryFee;

  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      customer: formData,
      items: cartItems,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
    };

    console.log("Order:", orderData);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="bg-green-900 px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/cart"
              className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
            >
              ← Back to Cart
            </Link>

            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Checkout
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-3 text-gray-600">
              Add a product before continuing to checkout.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-900"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-900 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/cart"
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Cart
          </Link>

          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-2 text-white/70">
            Complete your order and choose your preferred payment method.
          </p>
        </div>
      </section>

      {/* Checkout */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Side */}
            <div className="space-y-8 lg:col-span-2">
              {/* Customer Information */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700">
                    Step 1
                  </span>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Customer Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter the details we will use to process your order.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      First Name
                    </label>

                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Last Name
                    </label>

                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700">
                    Step 2
                  </span>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Delivery Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter your full delivery address"
                      required
                      className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* City */}
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        City
                      </label>

                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label
                        htmlFor="state"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        State
                      </label>

                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                      >
                        <option value="">Select state</option>
                        <option value="Abia">Abia</option>
                        <option value="Adamawa">Adamawa</option>
                        <option value="Akwa Ibom">Akwa Ibom</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Bauchi">Bauchi</option>
                        <option value="Bayelsa">Bayelsa</option>
                        <option value="Benue">Benue</option>
                        <option value="Borno">Borno</option>
                        <option value="Cross River">Cross River</option>
                        <option value="Delta">Delta</option>
                        <option value="Ebonyi">Ebonyi</option>
                        <option value="Edo">Edo</option>
                        <option value="Ekiti">Ekiti</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Gombe">Gombe</option>
                        <option value="Imo">Imo</option>
                        <option value="Jigawa">Jigawa</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Kano">Kano</option>
                        <option value="Katsina">Katsina</option>
                        <option value="Kebbi">Kebbi</option>
                        <option value="Kogi">Kogi</option>
                        <option value="Kwara">Kwara</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Nasarawa">Nasarawa</option>
                        <option value="Niger">Niger</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Ondo">Ondo</option>
                        <option value="Osun">Osun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Plateau">Plateau</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Sokoto">Sokoto</option>
                        <option value="Taraba">Taraba</option>
                        <option value="Yobe">Yobe</option>
                        <option value="Zamfara">Zamfara</option>
                        <option value="FCT">FCT Abuja</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Order Notes
                      <span className="ml-1 font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special delivery instructions?"
                      className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700">
                    Step 3
                  </span>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Paystack */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === "paystack"
                        ? "border-green-700 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-green-700"
                    />

                    <div>
                      <p className="font-bold text-gray-900">Pay Online</p>

                      <p className="text-sm text-gray-500">
                        Pay securely with card, bank transfer or USSD.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <div className="space-y-3">
                    <label
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                        paymentMethod === "bank-transfer"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank-transfer"
                        checked={paymentMethod === "bank-transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 accent-green-700"
                      />

                      <div>
                        <p className="font-bold text-gray-900">Bank Transfer</p>

                        <p className="text-sm text-gray-500">
                          Transfer payment to our company account.
                        </p>
                      </div>
                    </label>

                    {paymentMethod === "bank-transfer" && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-500">
                              Account Name
                            </span>
                            <span className="font-semibold text-gray-900">
                              {bankDetails.accountName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-500">
                              Bank Name
                            </span>
                            <span className="font-semibold text-gray-900">
                              {bankDetails.bankName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-gray-500">
                              Account Number
                            </span>
                            <span className="font-semibold text-gray-900">
                              {bankDetails.accountNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="mt-6 space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 border-b border-gray-100 pb-5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 font-bold text-green-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>

                    <span className="font-semibold text-gray-800">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  {deliveryFee === 0 && (
                    <p className="text-xs font-medium text-green-700">
                      You qualify for free delivery.
                    </p>
                  )}
                </div>

                <div className="my-5 border-t border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>

                  <span className="text-2xl font-extrabold text-green-800">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  className="mt-7 w-full rounded-lg bg-green-700 py-4 font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 hover:-translate-y-0.5"
                >
                  Place Order
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                  By placing your order, you agree to our terms and conditions.
                </p>

                <Link
                  to="/shop"
                  className="mt-4 block text-center text-sm font-semibold text-green-700 hover:text-green-900"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Checkout;
