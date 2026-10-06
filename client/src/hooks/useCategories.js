import { useState } from "react";

const initialCategories = [
  {
    id: 1,
    name: "Fresh Vegetables",
    slug: "vegetables",
    description: "Fresh and locally sourced vegetables.",
    image: "/images/categories/vegetables.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Fruits",
    slug: "fruits",
    description: "Fresh and healthy fruits from local farms.",
    image: "/images/categories/fruits.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Grains & Cereals",
    slug: "grains",
    description: "Quality grains and cereals for everyday use.",
    image: "/images/categories/grains.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Tubers",
    slug: "tubers",
    description: "Fresh and quality tubers from local farms.",
    image: "/images/categories/tubers.jpg",
    status: "Active",
  },
  {
    id: 5,
    name: "Livestock",
    slug: "livestock",
    description: "Quality livestock products.",
    image: "/images/categories/livestock.jpg",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Poultry",
    slug: "poultry",
    description: "Fresh poultry products from trusted farms.",
    image: "/images/categories/poultry.jpg",
    status: "Active",
  },
];

export default function useCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now(),
    };

    setCategories((current) => [...current, newCategory]);

    return newCategory;
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === Number(id)
          ? { ...category, ...updatedCategory }
          : category
      )
    );
  };

  const deleteCategory = (id) => {
    setCategories((current) =>
      current.filter((category) => category.id !== Number(id))
    );
  };

  const getCategory = (id) => {
    return categories.find(
      (category) => category.id === Number(id)
    );
  };

  const getCategoryBySlug = (slug) => {
    return categories.find(
      (category) => category.slug === slug
    );
  };

  const toggleStatus = (id) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === Number(id)
          ? {
              ...category,
              status:
                category.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : category
      )
    );
  };

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  );

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive"
  );

  return {
    categories,
    activeCategories,
    inactiveCategories,
    loading,
    setLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategoryBySlug,
    toggleStatus,
  };
}