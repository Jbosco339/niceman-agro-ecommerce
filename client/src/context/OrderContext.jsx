import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ordersSeed,
  readLocalStorage,
  writeLocalStorage,
} from "../data/mockData";

export const initialOrders = ordersSeed;

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = readLocalStorage("niceman-orders", ordersSeed);
    return saved && saved.length ? saved : ordersSeed;
  });

  useEffect(() => {
    writeLocalStorage("niceman-orders", orders);
  }, [orders]);

  const updateOrder = (id, changes) => {
    setOrders((current) =>
      current.map((order) =>
        String(order.id) === String(id) ? { ...order, ...changes } : order,
      ),
    );
  };

  const getOrder = (id) => orders.find((o) => String(o.id) === String(id));

  const value = {
    orders,
    setOrders,
    updateOrder,
    getOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx)
    throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
}
