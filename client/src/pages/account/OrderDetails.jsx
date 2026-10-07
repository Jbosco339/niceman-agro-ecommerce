
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { orderId } = useParams();

  // Frontend placeholder data for now.
  // This can be replaced with backend order data later.
  const order = {
    id: orderId || "NFA-2026-0001",
    date: "October 5, 2026",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Card Payment",
    deliveryMethod: "Standard Delivery",

    customer: {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+234 800 000 0000",
    },

    deliveryAddress: {
      address: "12 Example Street",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
    },

    items: [
      {
        id: 1,
        name: "Fresh Organic Tomatoes",
        quantity: 2,
        price: 3500,
      },
      {
        id: 2,
        name: "Premium Maize",
        quantity: 1,
        price: 8500,
      },
    ],

    subtotal: 15500,
    deliveryFee: 1500,
    discount: 0,
  };

  const total = order.subtotal + order.deliveryFee - order.discount;

  const formatPrice = (amount) =>
    `₦${amount.toLocaleString("en-NG")}`;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            to="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/account/orders"
            className="transition hover:text-green-700"
          >
            My Orders
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-700">
            Order Details
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Order #{order.id}
            </p>
          </div>

          <Link
            to="/account/orders"
            className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Order Status */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Order Date
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {order.date}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Order Status
              </p>

              <span className="mt-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                {order.status}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Status
              </p>

              <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {order.paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {order.paymentMethod}
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Order Items */}
          <section className="lg:col-span-2">
            <div className="rounded-xl bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Ordered Items
                </h2>
              </div>

              <div className="divide-y divide-slate-200">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-6"
                  >
                    {/* Product Image Placeholder */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-green-50 text-2xl">
                      🌱
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-slate-800">
                          {formatPrice(item.price)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatPrice(item.price * item.quantity)} total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Order Summary */}
          <aside>
            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-semibold text-slate-800">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-medium text-slate-800">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Discount
                    </span>

                    <span className="font-medium text-green-700">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-800">
                      Total
                    </span>

                    <span className="text-xl font-bold text-green-700">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </aside>

        </div>

        {/* Delivery Information */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* Customer */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Customer Information
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Name</p>
                <p className="font-medium text-slate-700">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Email</p>
                <p className="font-medium text-slate-700">
                  {order.customer.email}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Phone</p>
                <p className="font-medium text-slate-700">
                  {order.customer.phone}
                </p>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Delivery Information
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">Delivery Method</p>
                <p className="font-medium text-slate-700">
                  {order.deliveryMethod}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Address</p>
                <p className="font-medium text-slate-700">
                  {order.deliveryAddress.address}
                </p>
                <p className="font-medium text-slate-700">
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state}
                </p>
                <p className="font-medium text-slate-700">
                  {order.deliveryAddress.country}
                </p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}

export default OrderDetails;

