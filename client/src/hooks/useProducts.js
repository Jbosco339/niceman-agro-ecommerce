import { useContext, useState, useMemo } from "react";
import { ProductContext } from "../context/ProductContext";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "Fertilizers",
    price: 3500,
    stock: 45,
    description:
      "Fresh, locally sourced tomatoes suitable for everyday cooking.",
    image: "/images/products/tomatoes.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Premium Rice",
    category: "Herbicides",
    price: 45000,
    stock: 8,
    description: "High-quality premium rice for everyday meals.",
    image: "/images/products/rice.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Irish Potatoes",
    category: "Insecticides",
    price: 6000,
    stock: 0,
    description: "Fresh Irish potatoes sourced from trusted farms.",
    image: "/images/products/potatoes.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Fresh Chicken",
    category: "Seeds",
    price: 8500,
    stock: 25,
    description: "Fresh and quality poultry products.",
    image: "/images/products/chicken.jpg",
    status: "Active",
  },
  {
    id: 5,
    name: "Fresh Mangoes",
    category: "Farm Equipment",
    price: 5000,
    stock: 12,
    description: "Fresh, sweet and naturally sourced mangoes.",
    image: "/images/products/mangoes.jpg",
    status: "Inactive",
  },
];

export default function useProducts() {
  // Read shared product context (if provided). We still initialize
  // local hooks so hook call order stays consistent across renders.
  const ctx = useContext(ProductContext);

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      price: Number(product.price),
      stock: Number(product.stock),
    };

    setProducts((current) => [...current, newProduct]);

    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === Number(id)
          ? {
              ...product,
              ...updatedProduct,
              price: Number(updatedProduct.price ?? product.price),
              stock: Number(updatedProduct.stock ?? product.stock),
            }
          : product,
      ),
    );
  };

  const deleteProduct = (id) => {
    setProducts((current) =>
      current.filter((product) => product.id !== Number(id)),
    );
  };

  const getProduct = (id) => {
    return products.find((product) => product.id === Number(id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  };

  const toggleStatus = (id) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === Number(id)
          ? {
              ...product,
              status: product.status === "Active" ? "Inactive" : "Active",
            }
          : product,
      ),
    );
  };

  const updateStock = (id, quantity) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === Number(id)
          ? { ...product, stock: Math.max(0, product.stock + Number(quantity)) }
          : product,
      ),
    );
  };

  const activeProducts = useMemo(
    () => products.filter((product) => product.status === "Active"),
    [products],
  );
  const inactiveProducts = useMemo(
    () => products.filter((product) => product.status === "Inactive"),
    [products],
  );
  const inStockProducts = useMemo(
    () => products.filter((product) => product.stock > 10),
    [products],
  );
  const lowStockProducts = useMemo(
    () =>
      products.filter((product) => product.stock > 0 && product.stock <= 10),
    [products],
  );
  const outOfStockProducts = useMemo(
    () => products.filter((product) => product.stock === 0),
    [products],
  );

  const localValue = {
    products,
    setProducts,
    loading,
    setLoading,

    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsByCategory,
    toggleStatus,
    updateStock,

    activeProducts,
    inactiveProducts,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
  };

  return ctx || localValue;
}
