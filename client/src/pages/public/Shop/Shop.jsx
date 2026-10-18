import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  ChevronDown,
  Heart,
  Check,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useCategoryContext } from "../../../context/CategoryContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { getProducts } from "../../../services/productService";

function formatPrice(price) {
  return `₦${price.toLocaleString("en-NG")}`;
}

const fallbackCategories = [
  "All Products",
  "Fertilizers",
  "Herbicides",
  "Insecticides",
  "Fungicides",
  "Seeds",
  "Farm Equipment",
];

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { activeCategories = [] } = useCategoryContext();
  const [addedProductId, setAddedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const categories = [
    "All Products",
    ...activeCategories
      .filter((category) => category?.name)
      .map((category) => category.name),
  ];

  const categoryOptions = categories.length ? categories : fallbackCategories;

  useEffect(() => {
    let active = true;

    getProducts()
      .then(({ data }) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (active)
          setProductsError(error.message || "Could not load products.");
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);

    window.setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1200);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All Products") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search),
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
      result.sort((a, b) => {
        const aTime = new Date(b.createdAt || b.id).getTime();
        const bTime = new Date(a.createdAt || a.id).getTime();
        return bTime - aTime;
      });
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortOption]);

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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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
            <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-base font-bold text-green-950">
                  Categories
                </h2>

                <div className="mt-5 space-y-1">
                  {categoryOptions.map((category) => {
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

                        {active && <span className="text-xs">✓</span>}
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
              {productsLoading ? (
                <p className="text-gray-500">Loading products…</p>
              ) : productsError ? (
                <p role="alert" className="text-red-700">
                  {productsError}
                </p>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain object-center p-1.5 transition duration-500 group-hover:scale-105 sm:object-cover sm:p-0"
                          />
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleFavorite(product)}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                          aria-label={`Save ${product.name} to favorites`}
                        >
                          <Heart
                            size={16}
                            fill={
                              isFavorite(product.id) ? "currentColor" : "none"
                            }
                            className={
                              isFavorite(product.id)
                                ? "text-red-500"
                                : "text-slate-700"
                            }
                          />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                            {product.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="mt-3 block"
                        >
                          <h3 className="text-lg font-bold text-slate-900 transition hover:text-green-700">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {product.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xl font-extrabold text-green-800">
                            {formatPrice(product.price)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center gap-2 rounded-md bg-green-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                          >
                            <ShoppingCart size={16} />
                            {addedProductId === product.id
                              ? "Added"
                              : "Add to Cart"}
                          </button>
                        </div>

                        {addedProductId === product.id && (
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">
                            <Check size={15} />
                            Added to cart
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    No products match your filters.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another category or search term.
                  </p>
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
