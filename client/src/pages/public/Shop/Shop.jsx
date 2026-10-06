import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Crop Fertilizer",
    category: "Fertilizers",
    price: 25000,
    image: "/images/products/agro12.jpg",
    description: "Quality fertilizer formulated to support healthy crop growth.",
    featured: true,
  },
  {
    id: 2,
    name: "Crop Protection Herbicide",
    category: "Herbicides",
    price: 18500,
    image: "/images/products/agro12.jpg",
    description: "Effective weed control solution for agricultural crops.",
    featured: true,
  },
  {
    id: 3,
    name: "Farm Insect Control",
    category: "Insecticides",
    price: 14500,
    image: "/images/products/insecticide.jpg",
    description: "Reliable protection against common agricultural pests.",
    featured: true,
  },
  {
    id: 4,
    name: "Quality Maize Seeds",
    category: "Seeds",
    price: 12000,
    image: "/images/products/seeds.jpg",
    description: "Quality maize seeds selected for productive farming.",
    featured: true,
  },
  {
    id: 5,
    name: "NPK Fertilizer",
    category: "Fertilizers",
    price: 22000,
    image: "/images/products/fertilizer.jpg",
    description: "Balanced NPK fertilizer for improved crop nutrition.",
    featured: false,
  },
  {
    id: 6,
    name: "Broad Spectrum Herbicide",
    category: "Herbicides",
    price: 16500,
    image: "/images/products/herbicide.jpg",
    description: "Agricultural herbicide for effective weed management.",
    featured: false,
  },
  {
    id: 7,
    name: "Agricultural Insecticide",
    category: "Insecticides",
    price: 13500,
    image: "/images/products/insecticide.jpg",
    description: "Crop protection product for controlling harmful insects.",
    featured: false,
  },
  {
    id: 8,
    name: "Improved Vegetable Seeds",
    category: "Seeds",
    price: 9500,
    image: "/images/products/seeds.jpg",
    description: "Selected vegetable seeds for productive farm cultivation.",
    featured: false,
  },
];

const categories = [
  "All Products",
  "Fertilizers",
  "Herbicides",
  "Insecticides",
  "Fungicides",
  "Seeds",
  "Farm Equipment",
];

function formatPrice(price) {
  return `₦${price.toLocaleString("en-NG")}`;
}

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All Products") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
      );
    }

    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "featured") {
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [selectedCategory, searchTerm, sortOption]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Page Header */}
      <section className="bg-green-950 py-14 text-white sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-300">
              Niceman Agro & Farms
            </p>

            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Shop Agricultural Products
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-green-100/80 sm:text-base">
              Explore quality agricultural inputs and products selected to
              support healthier crops and more productive farming.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">

          {/* Search + Sort */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="h-12 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-500 sm:block">
                Sort by
              </span>

              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="h-12 appearance-none rounded-md border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name</option>
                  <option value="price-low">
                    Price: Low to High
                  </option>
                  <option value="price-high">
                    Price: High to Low
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="mt-5 flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 lg:hidden"
          >
            <SlidersHorizontal size={17} />
            {showFilters ? "Hide Categories" : "Show Categories"}
          </button>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">

            {/* Category Sidebar */}
            <aside
              className={`${showFilters ? "block" : "hidden"} lg:block`}
            >
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-base font-bold text-green-950">
                  Categories
                </h2>

                <div className="mt-5 space-y-1">
                  {categories.map((category) => {
                    const active = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "bg-green-700 font-semibold text-white"
                            : "text-slate-600 hover:bg-green-50 hover:text-green-800"
                        }`}
                      >
                        <span>{category}</span>

                        {active && (
                          <span className="text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Products */}
            <div>
              {/* Result Header */}
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-green-950">
                    {selectedCategory}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="self-start text-sm font-semibold text-green-700 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <Link
                          to={`/shop/product/${product.id}`}
                          className="block h-full w-full"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-7 transition duration-300 group-hover:scale-105"
                          />
                        </Link>

                        {product.featured && (
                          <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            Featured
                          </span>
                        )}

                        <button
                          type="button"
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-red-500"
                          aria-label={`Add ${product.name} to wishlist`}
                        >
                          <Heart size={17} />
                        </button>
                      </div>

                      {/* Product Information */}
                      <div className="p-5">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
                          {product.category}
                        </span>

                        <Link
                          to={`/shop/product/${product.id}`}
                          className="mt-2 block"
                        >
                          <h3 className="min-h-[48px] text-base font-bold leading-6 text-green-950 transition hover:text-green-700">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {product.description}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <strong className="text-lg font-bold text-green-950">
                            {formatPrice(product.price)}
                          </strong>

                          <button
                            type="button"
                            className="flex h-10 items-center gap-2 rounded-md bg-green-700 px-4 text-sm font-semibold text-white transition hover:bg-green-800"
                          >
                            <ShoppingCart size={16} />
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
                    <Search size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-green-950">
                    No products found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    We couldn't find any products matching your search or
                    selected category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Products");
                    }}
                    className="mt-5 font-semibold text-green-700 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-300"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-green-700 text-sm font-semibold text-white"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-green-600 hover:text-green-700"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-green-600 hover:text-green-700"
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-green-600 hover:text-green-700"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;