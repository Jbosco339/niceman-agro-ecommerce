import { useState } from "react";

const initialOrders = [
  {
    id: "NA-2026-00125",
    customerName: "John Doe",
    email: "johndoe@example.com",
    items: [
      { name: "Fresh Tomatoes", quantity: 2, price: 3500 },
      { name: "Premium Rice", quantity: 1, price: 45000 },
    ],
    total: 53500,
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    status: "Processing",
    date: "October 6, 2026",
  },
  {
    id: "NA-2026-00124",
    customerName: "Sarah Williams",
    email: "sarah@example.com",
    items: [
      { name: "Premium Rice", quantity: 1, price: 45000 },
      { name: "Fresh Mangoes", quantity: 2, price: 5000 },
    ],
    total: 78000,
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "October 5, 2026",
  },
  {
    id: "NA-2026-00123",
    customerName: "Michael Johnson",
    email: "michael@example.com",
    items: [
      { name: "Fresh Chicken", quantity: 1, price: 32000 },
    ],
    total: 32000,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "Pending",
    date: "October 5, 2026",
  },
];

export default function useOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(false);

  const getOrder = (id) => {
    return orders.find((order) => order.id === id);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: order.id || `NA-${Date.now()}`,
      date:
        order.date ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    };

    setOrders((current) => [newOrder, ...current]);

    return newOrder;
  };

  const updateOrder = (id, updatedData) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, ...updatedData }
          : order
      )
    );
  };

  const updateOrderStatus = (id, status) => {
    updateOrder(id, { status });
  };

  const updatePaymentStatus = (id, paymentStatus) => {
    updateOrder(id, { paymentStatus });
  };

  const deleteOrder = (id) => {
    setOrders((current) =>
      current.filter((order) => order.id !== id)
    );
  };

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  );

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );

  const totalSales = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((total, order) => total + order.total, 0);

  return {
    orders,
    setOrders,
    loading,
    setLoading,
    getOrder,
    addOrder,
    updateOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    totalSales,
  };
}