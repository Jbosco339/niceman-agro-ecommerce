import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCustomers } from "../services/adminService";

export const initialCustomers = [];

export const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    getCustomers()
      .then(({ data }) => {
        if (!active) return;
        setCustomers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setCustomers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const addCustomer = (customer) => {
    const next = {
      id: customer.id || Date.now(),
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      joined: customer.joined || new Date().toLocaleDateString(),
      orders: customer.orders || 0,
      totalSpent: customer.totalSpent || 0,
      status: customer.status || "Active",
    };

    setCustomers((cur) => [next, ...cur]);
    return next;
  };

  const updateCustomer = (id, changes) => {
    setCustomers((cur) =>
      cur.map((c) => (String(c.id) === String(id) ? { ...c, ...changes } : c)),
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((cur) => cur.filter((c) => String(c.id) !== String(id)));
  };

  const getCustomer = (id) =>
    customers.find((c) => String(c.id) === String(id));

  const activeCustomers = useMemo(
    () => customers.filter((c) => c.status === "Active"),
    [customers],
  );
  const inactiveCustomers = useMemo(
    () => customers.filter((c) => c.status === "Inactive"),
    [customers],
  );

  const value = useMemo(
    () => ({
      customers,
      setCustomers,
      loading,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getCustomer,
      activeCustomers,
      inactiveCustomers,
    }),
    [customers, loading, activeCustomers, inactiveCustomers],
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext() {
  const ctx = useContext(CustomerContext);
  if (!ctx)
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider",
    );
  return ctx;
}
