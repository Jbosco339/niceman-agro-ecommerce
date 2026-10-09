import { Link } from "react-router-dom";
import { useCategoryContext } from "../../../context/CategoryContext";

const Categories = () => {
  const { activeCategories } = useCategoryContext();

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-105 items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/categories/6.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-green-950/70" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8">
          <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[3px] text-yellow-400">
            Niceman Agro & Farms
          </span>

          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Product Categories
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Explore our wide range of agricultural input categories designed to
            support productive and sustainable farming.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-green-700">
              Shop by Category
            </span>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Are You Looking For?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Find the right agricultural inputs for your crop protection,
              growth, and farm productivity needs.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategories.map((category) => (
              <Link
                key={category.name}
                to={`/categories/${encodeURIComponent(category.slug)}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-5">
                    <h3 className="text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="min-h-[48px] text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center font-bold text-green-700 transition group-hover:text-green-900">
                    Explore Category
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-900 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted Agricultural Inputs for Every Farm
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Shop quality agricultural products and crop protection solutions
            from Niceman Agro & Farms.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-lg bg-yellow-500 px-7 py-3.5 font-bold text-green-950 transition hover:bg-yellow-400"
          >
            Shop All Products
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Categories;
