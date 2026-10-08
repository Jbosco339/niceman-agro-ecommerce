import { useState } from "react";

const initialCategories = [
  {
    id: 1,
    name: "Fertilizers",
    slug: "fertilizers",
    description: "Nutrient-rich fertilizer solutions for healthy crop growth.",
    image: "/images/categories/fertiliser.jpg",
    status: "Active",
  },
  {
    id: 2,
    name: "Herbicides",
    slug: "herbicides",
    description: "Effective crop protection products for weed control.",
    image: "/images/categories/herbicides.jpg",
    status: "Active",
  },
  {
    id: 3,
    name: "Insecticides",
    slug: "insecticides",
    description: "Reliable solutions for tackling common agricultural pests.",
    image: "/images/categories/18.jpg",
    status: "Active",
  },
  {
    id: 4,
    name: "Fungicides",
    slug: "fungicides",
    description: "Crop protection products for disease and fungal control.",
    image: "/images/categories/fungicide.jpg",
    status: "Active",
  },
  {
    id: 5,
    name: "Seeds",
    slug: "seeds",
    description: "High-quality seeds selected for productive farming.",
    image: "/images/categories/12.jpg",
    status: "Active",
  },
  {
    id: 6,
    name: "Farm Equipment",
    slug: "farm-equipment",
    description: "Practical farm tools and equipment for daily operations.",
    image: "/images/categories/tools.jpg",
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
          : category,
      ),
    );
  };

  const deleteCategory = (id) => {
    setCategories((current) =>
      current.filter((category) => category.id !== Number(id)),
    );
  };

  const getCategory = (id) => {
    return categories.find((category) => category.id === Number(id));
  };

  const getCategoryBySlug = (slug) => {
    return categories.find((category) => category.slug === slug);
  };

  const toggleStatus = (id) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === Number(id)
          ? {
              ...category,
              status: category.status === "Active" ? "Inactive" : "Active",
            }
          : category,
      ),
    );
  };

  const activeCategories = categories.filter(
    (category) => category.status === "Active",
  );

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive",
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
