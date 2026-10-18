import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOrders } from "../services/adminService";

export const initialOrders = [];

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getOrders()
      .then(({ data }) => {
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateOrder = (id, changes) => {
    setOrders((current) =>
      current.map((order) =>
        String(order.id) === String(id) ? { ...order, ...changes } : order,
      ),
    );
  };

  const getOrder = (id) => orders.find((o) => String(o.id) === String(id));

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      loading,
      updateOrder,
      getOrder,
    }),
    [orders, loading],
  );

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
