import React, { createContext, useContext, useMemo, useState } from "react";

export const initialCategories = [
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

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "category";

export const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  const addCategory = (category) => {
    const nextCategory = {
      ...category,
      id: Date.now(),
      name: category.name?.trim() || "New Category",
      slug: category.slug || slugify(category.name || "New Category"),
      description: category.description || "",
      image: category.image || "",
      status: category.status || "Active",
    };

    setCategories((current) => [...current, nextCategory]);
    return nextCategory;
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === Number(id)
          ? {
              ...category,
              ...updatedCategory,
              name: updatedCategory.name?.trim() || category.name,
              slug:
                updatedCategory.slug ||
                slugify(updatedCategory.name || category.name),
              status: updatedCategory.status || category.status,
            }
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
    const target = String(slug || "").toLowerCase();
    return categories.find(
      (category) => String(category.slug || "").toLowerCase() === target,
    );
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

  const activeCategories = useMemo(
    () => categories.filter((category) => category.status === "Active"),
    [categories],
  );

  const inactiveCategories = useMemo(
    () => categories.filter((category) => category.status === "Inactive"),
    [categories],
  );

  const value = {
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

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider",
    );
  }
  return ctx;
}
