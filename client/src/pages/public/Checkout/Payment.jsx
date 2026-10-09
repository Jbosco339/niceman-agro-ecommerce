import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [processing, setProcessing] = useState(false);

  const total = order?.total || 53500;

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Connect Paystack/backend here later
    setTimeout(() => {
      navigate("/checkout/order-confirmation", {
        state: {
          order: {
            ...order,
            paymentMethod:
              paymentMethod === "paystack" ? "Paystack" : "Cash on Delivery",
            paymentStatus:
              paymentMethod === "paystack" ? "Paid" : "Payment Pending",
          },
        },
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-700">
            Niceman Agro & Farms
          </Link>

          <Link
            to="/checkout"
            className="text-sm text-gray-600 hover:text-green-700"
          >
            ← Back to Checkout
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">
            Choose your preferred payment method to complete your order.
          </p>
        </div>

        <form onSubmit={handlePayment} className="grid lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              {/* Paystack */}
              <label
                className={`block border rounded-xl p-5 cursor-pointer transition ${
                  paymentMethod === "paystack"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-green-600"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-900">Paystack</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay securely with your card, bank transfer or USSD.
                    </p>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`block border rounded-xl p-5 cursor-pointer transition ${
                  paymentMethod === "cash"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-green-600"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Cash on Delivery
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay when your order is delivered to you.
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Security Notice */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                🔒 Your payment information is securely processed. We do not
                store your card details.
              </p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-8 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition"
            >
              {processing
                ? "Processing..."
                : paymentMethod === "paystack"
                  ? `Pay ₦${Number(total).toLocaleString()}`
                  : "Place Order"}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {order?.items?.length ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ₦
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Your order details will appear here.
              </p>
            )}

            <div className="border-t mt-6 pt-5 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-green-700">
                ₦{Number(total).toLocaleString()}
              </span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Payment;
