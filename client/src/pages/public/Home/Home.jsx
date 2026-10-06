import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fertilizers",
    image: "/images/categories/agro12.jpg",
  },
  {
    name: "Herbicides",
    image: "/images/categories/2.jpg",
  },
  {
    name: "Insecticides",
    image: "/images/categories/3.jpg",
  },
  {
    name: "Fungicides",
    image: "/images/categories/4.jpg",
  },
  {
    name: "Seeds",
    image: "/images/categories/1.jpg",
  },
  {
    name: "Farm Equipment",
    image: "/images/categories/2.jpg",
  },
];

const popularProducts = [
  {
    name: "Premium Crop Fertilizer",
    price: "₦25,000",
    image: "/images/products/agro12.jpg",
    category: "Fertilizer",
  },
  {
    name: "Crop Protection Herbicide",
    price: "₦18,500",
    image: "/images/products/7.jpg",
    category: "Herbicide",
  },
  {
    name: "Farm Insect Control",
    price: "₦14,500",
    image: "/images/products/8.jpg",
    category: "Insecticide",
  },
  {
    name: "Quality Maize Seeds",
    price: "₦12,000",
    image: "/images/products/9.jpg",
    category: "Seeds",
  },
];

const blogPosts = [
  {
    title: "How to Choose the Right Fertilizer for Your Crops",
    image: "/images/blog/17.jpg",
    category: "Crop Management",
  },
  {
    title: "Best Practices for Protecting Your Farm From Pests",
    image: "/images/blog/agro12.jpg",
    category: "Pest Management",
  },
  {
    title: "Important Tips for Better Farm Productivity",
    image: "/images/blog/5.jpg",
    category: "Agriculture",
  },
];

const faqs = [
  {
    question: "What agricultural products do you sell?",
    answer:
      "We provide agricultural inputs including fertilizers, seeds, herbicides, insecticides, fungicides, crop protection products, farm tools and equipment.",
  },
  {
    question: "Can I order products online?",
    answer:
      "Yes. You can browse our products, add items to your cart and proceed through checkout to place an order.",
  },
  {
    question: "Can I order without creating an account?",
    answer:
      "Yes. Guest checkout is available, so you can place an order without creating a customer account.",
  },
  {
    question: "Do you provide agricultural information?",
    answer:
      "Yes. Our agricultural knowledge section provides useful information about crops, farm management and agricultural products.",
  },
];

function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-800">

      {/* HERO */}
      <section
        className="relative flex min-h-[620px] items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(3, 54, 31, 0.88), rgba(3, 54, 31, 0.30)), url('/images/hero/agro12.jpg')",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-2xl text-white">
            <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]">
              Quality Agro Inputs
            </span>

            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-7xl">
              Growing Better Crops.
              <br />
              Building a Better Future.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Quality agricultural inputs and practical farming knowledge
              helping farmers grow healthier crops and build more productive
              farms.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-green-700 px-7 font-semibold text-white transition hover:bg-green-800"
              >
                Shop Products
              </Link>

              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white px-7 font-semibold text-white transition hover:bg-white hover:text-green-800"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                Shop
              </span>

              <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
                Product Categories
              </h2>
            </div>

            <Link
              to="/categories"
              className="font-semibold text-green-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/categories"
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-green-950">
                    {category.name}
                  </h3>

                  <span className="mt-2 block text-xs font-bold text-green-700">
                    Explore Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                Featured
              </span>

              <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
                Popular Products
              </h2>
            </div>

            <Link
              to="/shop"
              className="font-semibold text-green-700 hover:underline"
            >
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <article
                key={product.name}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  to="/shop"
                  className="block aspect-square overflow-hidden bg-slate-50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-6"
                  />
                </Link>

                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
                    {product.category}
                  </span>

                  <h3 className="mt-2 min-h-[44px] font-semibold leading-6 text-green-950">
                    {product.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <strong className="text-lg text-green-950">
                      {product.price}
                    </strong>

                    <Link
                      to="/shop"
                      className="text-sm font-bold text-green-700 hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-green-50 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
              Why Us
            </span>

            <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
              Why Choose Niceman Agro & Farms?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              We combine quality agricultural inputs with practical knowledge
              to help farmers make better decisions and achieve better results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "✓",
                title: "Quality Products",
                text: "Reliable agricultural inputs selected to support healthy crops and productive farming.",
              },
              {
                icon: "◆",
                title: "Practical Knowledge",
                text: "Useful agricultural information to help farmers understand products and improve farm practices.",
              },
              {
                icon: "★",
                title: "Customer Focused",
                text: "A simple shopping experience designed around the needs of farmers and agricultural businesses.",
              },
              {
                icon: "↗",
                title: "Better Farming",
                text: "Our goal is to support better crop production and a stronger agricultural future.",
              },
            ].map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-lg bg-white p-7 text-center"
              >
                <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                  {benefit.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-green-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AGRICULTURAL KNOWLEDGE */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                Learn & Grow
              </span>

              <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
                Agricultural Knowledge
              </h2>
            </div>

            <Link
              to="/blog"
              className="font-semibold text-green-700 hover:underline"
            >
              View All Articles
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <Link
                  to="/blog"
                  className="block aspect-video overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </Link>

                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
                    {post.category}
                  </span>

                  <h3 className="mt-3 text-lg font-bold leading-7 text-green-950">
                    {post.title}
                  </h3>

                  <Link
                    to="/blog"
                    className="mt-5 inline-block text-sm font-bold text-green-700 hover:underline"
                  >
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
              FAQ
            </span>

            <h2 className="mt-2 text-3xl font-bold leading-tight text-green-950 sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Find answers to some of the common questions about our products,
              ordering process and agricultural services.
            </p>

            <Link
              to="/faq"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-green-700 px-6 font-semibold text-white transition hover:bg-green-800"
            >
              View All FAQs
            </Link>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 font-semibold text-green-950">
                  <span>{faq.question}</span>

                  <span className="text-xl font-normal text-green-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="px-5 pb-5 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="bg-cover bg-center py-16 sm:py-20"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(3, 91, 48, 0.96), rgba(3, 91, 48, 0.72)), url('/images/hero/hero.jpg')",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-200">
              Niceman Agro & Farms
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Quality Farm Inputs. Healthier Crops. A Greener Future.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/80">
              Explore our agricultural products and discover useful knowledge
              for better farming.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-white px-7 font-bold text-green-700 transition hover:bg-green-50"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;