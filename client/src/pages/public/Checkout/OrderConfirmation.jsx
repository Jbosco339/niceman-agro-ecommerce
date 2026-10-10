
import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No order to display</h1>
        <Link to="/checkout" className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Return to checkout</Link>
      </main>
    );
  }

  const customerName = order.customerName || (typeof order.customer === "object" ? order.customer?.name : order.customer) || "Customer";
  const customerEmail = order.email || order.customer?.email || "";
  const deliveryAddress = typeof order.deliveryAddress === "string"
    ? order.deliveryAddress
    : [order.deliveryAddress?.address, order.deliveryAddress?.city, order.deliveryAddress?.state].filter(Boolean).join(", ");
  const paid = order.paymentStatus === "Paid";

  const formatPrice = (price) => `₦${price.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Success */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {paid ? "Order Confirmed!" : "Order Received"}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            {paid
              ? "Thank you for your order. Your payment has been received and we will begin processing it shortly."
              : "Thank you for your order. Payment is still pending; we will process it after payment is confirmed."}
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Order Number */}
          <div className="bg-green-900 px-6 py-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
              Order Number
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {order.orderNumber}
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            {/* Customer */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Customer Information
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="mt-1 break-all font-semibold text-gray-800">
                    {customerEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-b border-gray-100 py-6">
              <h3 className="text-lg font-bold text-gray-900">
                Ordered Items
              </h3>

              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id || item.product || item.name}
                    className="flex items-center gap-4"
                  >
                    {item.image && <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />}

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-gray-900">
                        {item.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-green-700">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="border-b border-gray-100 py-6">
              <h3 className="text-lg font-bold text-gray-900">
                Delivery Address
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {deliveryAddress || "Address on file"}
              </p>
            </div>

            {/* Payment & Total */}
            <div className="py-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Payment Method
                </span>

                <span className="font-semibold text-gray-800">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {paid ? "Total Paid" : "Order Total"}
                </span>

                <span className="text-2xl font-extrabold text-green-800">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <p className="font-bold text-green-800">
                Your order is being processed.
              </p>

              <p className="mt-1 text-sm text-green-700">
                You will receive updates about your order via email or phone.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                to="/shop"
                className="rounded-lg bg-green-700 px-6 py-3 text-center font-bold text-white transition hover:bg-green-800"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center font-bold text-gray-700 transition hover:border-green-700 hover:text-green-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
