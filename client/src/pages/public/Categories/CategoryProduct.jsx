
import { Link, useParams } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "vegetables",
    price: "₦3,500",
    image: "/images/products/tomatoes.jpg",
    description: "Fresh, healthy and naturally grown tomatoes.",
  },
  {
    id: 2,
    name: "Fresh Pepper",
    category: "vegetables",
    price: "₦2,500",
    image: "/images/products/pepper.jpg",
    description: "Fresh farm-grown pepper with great flavor.",
  },
  {
    id: 3,
    name: "Fresh Carrots",
    category: "vegetables",
    price: "₦2,000",
    image: "/images/products/carrots.jpg",
    description: "Crisp and nutritious fresh carrots.",
  },
  {
    id: 4,
    name: "Premium Rice",
    category: "grains",
    price: "₦45,000",
    image: "/images/products/rice.jpg",
    description: "Quality locally sourced premium rice.",
  },
  {
    id: 5,
    name: "Yellow Corn",
    category: "grains",
    price: "₦15,000",
    image: "/images/products/corn.jpg",
    description: "Fresh and carefully selected maize.",
  },
  {
    id: 6,
    name: "Fresh Yam",
    category: "tubers",
    price: "₦4,500",
    image: "/images/products/yam.jpg",
    description: "Fresh quality yam directly from the farm.",
  },
  {
    id: 7,
    name: "Cassava",
    category: "tubers",
    price: "₦3,000",
    image: "/images/products/cassava.jpg",
    description: "Freshly harvested cassava.",
  },
  {
    id: 8,
    name: "Fresh Chicken",
    category: "poultry",
    price: "₦12,000",
    image: "/images/products/chicken.jpg",
    description: "Quality farm-raised chicken.",
  },
  {
    id: 9,
    name: "Farm Eggs",
    category: "poultry",
    price: "₦6,500",
    image: "/images/products/eggs.jpg",
    description: "Fresh eggs from healthy farm-raised birds.",
  },
  {
    id: 10,
    name: "Fresh Oranges",
    category: "fruits",
    price: "₦4,000",
    image: "/images/products/oranges.jpg",
    description: "Fresh and juicy farm-grown oranges.",
  },
  {
    id: 11,
    name: "Fresh Pineapple",
    category: "fruits",
    price: "₦3,000",
    image: "/images/products/pineapple.jpg",
    description: "Sweet and naturally grown pineapple.",
  },
  {
    id: 12,
    name: "Farm Goat",
    category: "livestock",
    price: "₦85,000",
    image: "/images/products/goat.jpg",
    description: "Healthy and well-raised farm goat.",
  },
];

const categoryNames = {
  vegetables: "Fresh Vegetables",
  fruits: "Fresh Fruits",
  grains: "Grains & Cereals",
  tubers: "Tubers",
  livestock: "Livestock",
  poultry: "Poultry",
};

const CategoryByProduct = () => {
  const { category } = useParams();

  const currentCategory = category?.toLowerCase();

  const categoryProducts = products.filter(
    (product) => product.category === currentCategory
  );

  const categoryName =
    categoryNames[currentCategory] || "Products";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/images/categories-bg.jpg')",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Link
            to="/categories"
            className="mb-6 inline-flex items-center text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
          >
            ← Back to Categories
          </Link>

          <span className="block text-sm font-bold uppercase tracking-[3px] text-yellow-400">
            Niceman Agro & Farms
          </span>

          <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
            {categoryName}
          </h1>

          <p className="mt-4 max-w-2xl text-white/75">
            Explore our selection of quality {categoryName.toLowerCase()}{" "}
            sourced from trusted farms and suppliers.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-green-700">
              Our Products
            </span>

            <h2 className="mt-1 text-3xl font-extrabold text-gray-900">
              {categoryName}
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "product" : "products"} available
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
                      Fresh
                    </span>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-green-700">
                    {categoryName}
                  </span>

                  <h3 className="mt-1 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-green-800">
                      {product.price}
                    </span>

                    <Link
                      to={`/product/${product.id}`}
                      className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
              🌱
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No Products Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              We currently don't have products available in this category.
              Please check back later.
            </p>

            <Link
              to="/categories"
              className="mt-6 inline-flex rounded-lg bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
            >
              Browse Categories
            </Link>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-green-900 px-5 py-14 text-center sm:px-8">
        <h2 className="text-3xl font-extrabold text-white">
          Looking for Something Else?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-white/75">
          Browse our other agricultural product categories and find exactly
          what you need.
        </p>

        <Link
          to="/categories"
          className="mt-6 inline-flex rounded-lg bg-yellow-500 px-7 py-3 font-bold text-green-950 transition hover:bg-yellow-400"
        >
          View All Categories
        </Link>
      </section>
    </main>
  );
};

export default CategoryByProduct;
