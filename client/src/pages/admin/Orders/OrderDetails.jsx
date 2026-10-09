import { Link, useParams } from "react-router-dom";
import useOrders from "../../../hooks/useOrders";

const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG")}`;

export default function OrderDetails() {
  const { id } = useParams();
  const { getOrder, updateOrder } = useOrders();
  const order = getOrder(id) || null;

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + order.deliveryFee;

  if (!order) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-green-600 hover:text-green-800"
          >
            ← Back to Orders
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateOrder(order.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-green-600 hover:text-green-800"
          >
            ← Back to Orders
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Order Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">Order #{id || order.id}</p>
        </div>

        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Customer */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Customer Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Name
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.customer.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Phone
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Delivery Address
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer.address}
              </p>
            </div>

            <Link
              to="/admin/customers/1"
              state={{ customer: order.customer }}
              className="inline-block text-sm font-semibold text-green-600 hover:text-green-800"
            >
              View Customer
            </Link>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Payment Information
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Payment Method
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.paymentMethod}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Payment Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {order.paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                Order Date
              </p>
              <p className="mt-1 text-sm text-gray-700">{order.date}</p>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-bold text-gray-900">Ordered Products</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Quantity
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Total
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {formatCurrency(item.price)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {item.quantity}
                  </td>

                  <td className="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Mark as Delivered
        </button>

        <button className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Update Status
        </button>

        <button className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
          Cancel Order
        </button>
      </div>

      {/* Backend Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <strong>Note:</strong> This page currently uses sample order data.
        Connect the order ID to your backend API later.
      </div>
    </div>
  );
}
