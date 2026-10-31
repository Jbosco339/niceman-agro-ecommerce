import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useProducts from "../../../hooks/useProducts";
import { useCategoryContext } from "../../../context/CategoryContext";
import useWebsiteContent from "../../../hooks/useWebsiteContent";
import useReviews from "../../../hooks/useReviews";
import useAuth from "../../../hooks/useAuth";
import AnimateOnScroll from "../../../components/AnimateOnScroll";

import { getFeaturedPosts } from "../../../services/blogService";
import { formatArticleDate } from "../../../utils/formatDate";

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

const fallbackHeroSlides = [
  {
    title: ["Growing Better Crops.", "Building a Better Future."],
    description:
      "Quality agricultural inputs and practical farming knowledge helping farmers grow healthier crops and build more productive farm.",
    buttonText: "Shop Products",
    buttonLink: "/shop",
  },
  {
    title: ["Trusted Inputs.", "Sustainable Practices."],
    description:
      "Reliable products and expert guidance to support sustainable farming and increase yields.",
    buttonText: "Read Articles",
    buttonLink: "/blog",
  },
];

const homepageHeroButtons = [
  {
    text: "Shop Products",
    link: "/shop",
    secondaryText: "Learn & Grow",
    secondaryLink: "/#learn-and-grow",
  },
  {
    text: "Explore Products",
    link: "/shop",
    secondaryText: "Browse Categories",
    secondaryLink: "/categories",
  },
];

const normalizeSlide = (slide, fallbackSlide = {}, index = 0) => {
  const title = Array.isArray(slide?.title)
    ? slide.title
    : typeof slide?.title === "string" && slide.title.trim()
      ? [slide.title]
      : Array.isArray(fallbackSlide?.title)
        ? fallbackSlide.title
        : typeof fallbackSlide?.title === "string"
          ? [fallbackSlide.title]
          : [""];

  const image =
    typeof slide?.image === "string" && slide.image.trim() ? slide.image : "";

  const buttonConfig = homepageHeroButtons[index] || homepageHeroButtons[0];

  return {
    image,
    title,
    description:
      typeof slide?.subtitle === "string" && slide.subtitle.trim()
        ? slide.subtitle
        : typeof slide?.description === "string" && slide.description.trim()
          ? slide.description
          : typeof fallbackSlide?.subtitle === "string" &&
              fallbackSlide.subtitle.trim()
            ? fallbackSlide.subtitle
            : typeof fallbackSlide?.description === "string" &&
                fallbackSlide.description.trim()
              ? fallbackSlide.description
              : fallbackHeroSlides[0].description,
    buttonText: buttonConfig.text,
    buttonLink: buttonConfig.link,
    secondaryButtonText: buttonConfig.secondaryText,
    secondaryButtonLink: buttonConfig.secondaryLink,
  };
};

const getHeroSlides = (siteContent) => {
  const hero =
    siteContent && typeof siteContent === "object" ? siteContent.hero : null;
  const savedSlides = Array.isArray(hero?.slides)
    ? hero.slides.filter((slide) => slide && typeof slide === "object")
    : [];

  const legacySlide =
    hero && typeof hero === "object" && !savedSlides.length
      ? {
          title: hero.title,
          subtitle: hero.subtitle,
          image: hero.image,
        }
      : null;

  const normalizedSlides = [];

  if (savedSlides.length) {
    const limitedSlides = savedSlides.slice(0, 2);
    limitedSlides.forEach((slide, index) => {
      normalizedSlides.push(
        normalizeSlide(
          slide,
          fallbackHeroSlides[index] || fallbackHeroSlides[0],
          index,
        ),
      );
    });
    while (normalizedSlides.length < 2) {
      normalizedSlides.push(
        normalizeSlide(
          {},
          fallbackHeroSlides[normalizedSlides.length] || fallbackHeroSlides[0],
          normalizedSlides.length,
        ),
      );
    }
    return normalizedSlides.slice(0, 2);
  }

  if (legacySlide) {
    return [
      normalizeSlide(legacySlide, fallbackHeroSlides[0], 0),
      normalizeSlide({}, fallbackHeroSlides[1], 1),
    ];
  }

  return fallbackHeroSlides.map((slide, index) =>
    normalizeSlide(slide, slide, index),
  );
};

const fallbackHeroImage = "/images/hero/fallbackImg.jpg";

const getHeroBackgroundImage = (slide, loadedHeroImages) => {
  const candidateImage =
    typeof slide?.image === "string" && slide.image.trim()
      ? slide.image
      : fallbackHeroImage;

  const resolvedImage =
    loadedHeroImages[candidateImage] === false
      ? fallbackHeroImage
      : candidateImage;

  return {
    backgroundImage: `linear-gradient(90deg, rgba(3, 54, 31, 0.88), rgba(3, 54, 31, 0.30)), url("${resolvedImage}")`,
    backgroundColor: "#0f172a",
  };
};

const buildLoadedHeroImages = (slides = []) => {
  const nextLoaded = {};

  slides.forEach((slide) => {
    const image = typeof slide?.image === "string" ? slide.image.trim() : "";
    if (!image) {
      nextLoaded[fallbackHeroImage] = true;
      return;
    }

    nextLoaded[image] = false;
  });

  return nextLoaded;
};

const isHomePath = (pathname = "") => pathname === "/" || pathname === "/Home";

const getHashId = (value = "") => {
  const match = String(value || "").match(/#([A-Za-z0-9_-]+)/);
  return match ? match[1] : "";
};

const scrollToHashId = (targetId) => {
  const normalizedId = (targetId || "").replace(/^#/, "").trim();
  if (!normalizedId) return;

  const target = document.getElementById(normalizedId);
  if (!target) return;

  const header = document.querySelector("header");
  const headerOffset = header ? header.offsetHeight + 12 : 72;
  const top =
    target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top,
    left: 0,
    behavior: "smooth",
  });
};

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { activeCategories } = useCategoryContext();
  const { content: siteContent } = useWebsiteContent();
  const { getGeneralReviews } = useReviews();
  const { isAuthenticated } = useAuth();
  const approvedGeneralReviews = getGeneralReviews()
    .filter(
      (review) => review.type === "general" && review.status === "Approved",
    )
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });
  const reviews = approvedGeneralReviews.slice(0, 6);

  const slides = getHeroSlides(siteContent);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedHeroImages, setLoadedHeroImages] = useState(() =>
    buildLoadedHeroImages(slides),
  );

  useEffect(() => {
    const nextLoaded = buildLoadedHeroImages(slides);

    setLoadedHeroImages((current) => {
      const merged = { ...current };
      Object.keys(nextLoaded).forEach((key) => {
        if (!(key in merged)) {
          merged[key] = nextLoaded[key];
        }
      });
      return merged;
    });

    const imageLoaders = slides
      .map((slide) => {
        const image =
          typeof slide?.image === "string" ? slide.image.trim() : "";
        if (!image) return null;

        const img = new Image();
        img.src = image;
        return new Promise((resolve) => {
          img.onload = () => resolve({ image, loaded: true });
          img.onerror = () => resolve({ image, loaded: false });
        });
      })
      .filter(Boolean);

    if (!imageLoaders.length) return undefined;

    let active = true;

    Promise.all(imageLoaders).then((results) => {
      if (!active) return;

      setLoadedHeroImages((current) => {
        const next = { ...current };

        results.forEach(({ image, loaded }) => {
          next[image] = loaded;
        });

        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [slides]);

  useEffect(() => {
    if (!slides.length) return undefined;
    if (isPaused) return undefined;

    const id = setInterval(() => {
      setActive((s) => (s + 1) % slides.length);
    }, 5000);

    return () => clearInterval(id);
  }, [slides.length, isPaused]);

  const activeProducts = (products || []).filter((p) => p.status === "Active");
  const productsToShow = activeProducts.slice(0, 4);

  // Blog articles for Learn & Grow (show latest 3 published)
  const [articles, setArticles] = useState(null); // null = loading, [] = empty
  const [articlesError, setArticlesError] = useState(null);

  const normalizeFeaturedArticle = (post = {}) => {
    const slug =
      post.slug ||
      (post.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      String(post.id || "");

    return {
      ...post,
      slug,
    };
  };

  useEffect(() => {
    let mounted = true;

    getFeaturedPosts()
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res && res.data ? res.data : [])
          ? (res.data || []).map(normalizeFeaturedArticle)
          : [];
        setArticles(data.slice(0, 3));
      })
      .catch((err) => {
        if (!mounted) return;
        setArticlesError(err?.message || "Failed to load articles");
        setArticles([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHomePath(location.pathname)) return undefined;
    const hashId = getHashId(location.hash);
    if (!hashId) return undefined;

    const timer = window.setTimeout(() => {
      scrollToHashId(hashId);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);

  const handleHomeHashLink = (event, targetLink) => {
    const hashId = getHashId(targetLink);
    if (!hashId || !isHomePath(location.pathname)) return;

    event.preventDefault();

    const currentHashId = getHashId(location.hash);
    if (currentHashId === hashId) {
      window.setTimeout(() => scrollToHashId(hashId), 20);
      return;
    }

    navigate(targetLink.startsWith("/") ? targetLink : `/#${hashId}`);
    window.setTimeout(() => scrollToHashId(hashId), 140);
  };

  return (
    <main className="overflow-hidden bg-white text-slate-800">
      {/* HERO */}
      <section
        className="relative flex min-h-155 items-center justify-center overflow-hidden pt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides (backgrounds) */}
        <div className="absolute inset-0">
          {slides.map((slide, i) => {
            const missingImage = !slide.image;

            return (
              <div
                key={i}
                data-missing-image={missingImage ? "true" : undefined}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                style={getHeroBackgroundImage(slide, loadedHeroImages)}
              />
            );
          })}
        </div>

        <div className="relative flex h-full w-full items-center justify-center">
          {slides.map((slide, i) => (
            <div
              key={`${slide.image}-${i}`}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out z-10 ${
                i === active ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={i === active ? "false" : "true"}
            >
              <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10 sm:py-16 lg:py-20">
                <div className="mx-auto flex max-w-2xl flex-col items-center text-center text-white">
                  <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]">
                    Quality Agro Inputs
                  </span>

                  <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-7xl">
                    {Array.isArray(slide.title) ? (
                      slide.title.map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))
                    ) : (
                      <span>{slide.title}</span>
                    )}
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                    <Link
                      to={slide.buttonLink || "/shop"}
                      className="inline-flex min-h-12 items-center justify-center rounded-md bg-green-700 px-7 font-semibold text-white transition hover:bg-green-800"
                    >
                      {slide.buttonText || "Shop Products"}
                    </Link>

                    <Link
                      to={
                        slide.secondaryButtonLink || slide.buttonLink || "/shop"
                      }
                      onClick={(event) => {
                        const targetHref = slide.secondaryButtonLink || "#";
                        if (targetHref.includes("#")) {
                          handleHomeHashLink(event, targetHref);
                        }
                      }}
                      className="inline-flex min-h-12 items-center justify-center rounded-md border border-white px-7 font-semibold text-white transition hover:bg-white hover:text-green-800"
                    >
                      {slide.secondaryButtonText || "Explore Products"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About section that will appear after the hero before the product category */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: Introduction */}
            <div>
              <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.2em] text-[#1A4329]">
                About Niceman Agro & Farm
              </span>

              <h2 className="mb-6 text-3xl font-bold leading-tight text-[#1A4329] sm:text-4xl lg:text-5xl">
                Our Purpose — To Empower Farmers and Grow African Agriculture
              </h2>

              <p className="mb-5 text-base leading-8 text-gray-600 sm:text-lg">
                Our purpose is to empower farmers in Nigeria and Africa at large
                and improve agricultural productivity by providing access to
                quality agro inputs, reliable farming equipment, and practical
                agricultural knowledge. Through innovation, trusted
                partnerships, and customer-focused service, we aim to make
                farming more efficient, productive, and sustainable.
              </p>

              <p className="mb-8 text-base leading-8 text-gray-600 sm:text-lg">
                At Niceman Agro and Farm, we believe that stronger farmers build
                stronger communities. We are committed to helping farmers
                protect their crops, improve yields, adopt better farming
                practices, and contribute to Nigeria's food security and
                agricultural development.
              </p>

              <a
                href="/company"
                className="inline-flex items-center gap-3 rounded-md bg-[#1A4329] px-7 py-3.5 font-semibold text-white transition duration-300 hover:bg-[#245C39]"
              >
                Learn More About Us
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Right: Company Impact Statistics */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl bg-[#F3F7F1] p-6 sm:p-8">
                <h3 className="mb-2 text-3xl font-extrabold text-[#1A4329] sm:text-4xl">
                  Quality
                </h3>
                <p className="text-sm font-medium leading-6 text-gray-600 sm:text-base">
                  Agricultural Inputs
                </p>
              </div>

              <div className="rounded-xl bg-[#F3F7F1] p-6 sm:p-8">
                <h3 className="mb-2 text-3xl font-extrabold text-[#1A4329] sm:text-4xl">
                  Trusted
                </h3>
                <p className="text-sm font-medium leading-6 text-gray-600 sm:text-base">
                  Farmer Partnerships
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-[#1A4329] p-7 sm:p-9">
                <h3 className="mb-2 text-4xl font-extrabold text-white sm:text-5xl">
                  Sustainable
                </h3>
                <p className="max-w-md text-sm leading-7 text-green-100 sm:text-base">
                  Farming Solutions for Better Productivity, Stronger
                  Communities, and a More Food-Secure Nigeria.
                </p>
              </div>
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
              to="/shop"
              className="font-semibold text-green-700 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {activeCategories.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-white sm:h-36 lg:h-40">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="block h-full w-full object-contain object-center p-1.5 transition duration-300 group-hover:scale-105 sm:object-cover sm:p-0"
                  />
                </div>

                <div className="p-3 text-center sm:p-4">
                  <h3 className="text-sm font-semibold text-green-950 sm:text-base">
                    {category.name}
                  </h3>

                  <span className="mt-1 block text-[10px] font-bold text-green-700 sm:mt-2 sm:text-xs">
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {productsToShow.map((product, idx) => (
              <AnimateOnScroll
                as="article"
                key={product.id}
                delay={idx * 80}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block overflow-hidden bg-slate-50"
                >
                  <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-white sm:h-48 lg:h-56">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="block h-full w-full object-contain object-center p-2 transition duration-300 group-hover:scale-105 sm:p-4 lg:p-6"
                    />
                  </div>
                </Link>

                <div className="p-3 sm:p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-green-700 sm:text-[11px]">
                    {product.category}
                  </span>

                  <h3 className="mt-2 text-sm font-semibold leading-5 text-green-950 sm:text-base sm:leading-6">
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5 sm:gap-3">
                    <strong className="text-base text-green-950 sm:text-lg">
                      ₦{product.price}
                    </strong>

                    <Link
                      to={`/product/${product.id}`}
                      className="text-xs font-bold text-green-700 hover:underline sm:text-sm"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
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
              Why Choose Niceman Agro & Farm?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              We combine quality agricultural inputs with practical knowledge to
              help farmers make better decisions and achieve better results.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                className="rounded-lg bg-white p-3 text-center sm:p-7"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700 sm:h-13 sm:w-13 sm:text-xl">
                  {benefit.icon}
                </div>

                <h3 className="mt-3 text-sm font-bold text-green-950 sm:mt-5 sm:text-lg">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AGRICULTURAL KNOWLEDGE */}
      <section id="learn-and-grow" className="bg-white py-16 sm:py-20">
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
            {articles === null ? (
              // loading placeholders
              [0, 1, 2].map((i) => (
                <AnimateOnScroll
                  as="article"
                  key={i}
                  delay={i * 80}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="block aspect-video overflow-hidden bg-slate-100 animate-pulse" />

                  <div className="p-5">
                    <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-3 h-5 w-full max-w-65 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-5 h-4 w-20 rounded bg-slate-200 animate-pulse" />
                  </div>
                </AnimateOnScroll>
              ))
            ) : articlesError ? (
              <div className="rounded-lg border border-dashed border-green-200 bg-green-50 p-6 text-sm text-green-900 sm:col-span-3">
                <p className="font-semibold">Unable to load articles.</p>
                <p className="mt-2 text-green-800/80">{articlesError}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-green-200 bg-green-50 p-6 text-sm text-green-900 sm:col-span-3">
                <p className="font-semibold">No articles yet.</p>
                <p className="mt-2 text-green-800/80">
                  Check back later for new articles.
                </p>
              </div>
            ) : (
              (articles || []).map((post, idx) => (
                <AnimateOnScroll
                  as="article"
                  key={post.id || post.slug || idx}
                  delay={idx * 80}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <Link
                    to="/blog"
                    className="block aspect-video overflow-hidden"
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-green-50 flex items-center justify-center text-green-700 font-semibold">
                        Niceman Agro & Farms
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-green-700">
                      {post.category}
                    </span>

                    <h3 className="mt-3 text-lg font-bold leading-7 text-green-950">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {formatArticleDate(post.date)}
                      </span>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-bold text-green-700 hover:underline"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                Reviews
              </span>

              <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
                What Our Customers Are Saying
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Real feedback from customers who use our products and services.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {isAuthenticated && (
                <Link
                  to="/write-review"
                  className="inline-flex items-center rounded-md border border-green-700 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                  Write a Review
                </Link>
              )}
              <Link
                to="/reviews"
                className="inline-flex items-center rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Read All Reviews
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-green-200 bg-green-50 p-6 text-sm text-green-900 sm:col-span-2 lg:col-span-3">
                <p className="font-semibold">
                  No approved customer reviews yet.
                </p>
                <p className="mt-2 text-green-800/80">
                  Be the first to share your experience with Niceman Agro &
                  Farm.
                </p>
              </div>
            ) : (
              (reviews || []).map((r, i) => (
                <figure
                  key={r.id || i}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                      {r.customer
                        ? r.customer
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                        : (r.customer || r.name || "U").slice(0, 2)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-green-950">
                            {r.customer || r.name || "Anonymous"}
                          </p>
                          {r.location && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {r.location}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <svg
                                key={idx}
                                className={`h-4 w-4 ${idx < (r.rating || 5) ? "fill-current text-yellow-400" : "text-gray-200 stroke-current"}`}
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="mt-4 text-sm text-slate-700">
                        "{r.comment || r.review || "Great product!"}"
                      </blockquote>
                    </div>
                  </div>
                </figure>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Adding a by the numbers section here */}
      <section className="bg-[#1A4329] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-300 font-semibold tracking-[0.2em] text-sm mb-3">
              OUR IMPACT
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              By the Numbers
            </h2>
            <p className="text-gray-200 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Empowering farmers with quality agricultural products and reliable
              solutions for better farming and improved productivity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 lg:gap-8">
            {/* Statistic 1 */}
            <div className="text-center px-2">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-300 mb-3">
                400+
              </h3>
              <p className="text-white text-sm sm:text-base font-semibold">
                Agricultural Products
              </p>
            </div>

            {/* Statistic 2 */}
            <div className="text-center px-2">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-300 mb-3">
                All-Year
              </h3>
              <p className="text-white text-sm sm:text-base font-semibold">
                Support for Farmers
              </p>
            </div>

            {/* Statistic 3 */}
            <div className="text-center px-2">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-300 mb-3">
                100%
              </h3>
              <p className="text-white text-sm sm:text-base font-semibold">
                Commitment to Quality
              </p>
            </div>

            {/* Statistic 4 */}
            <div className="text-center px-2">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-300 mb-3">
                87,500+
              </h3>
              <p className="text-white text-sm sm:text-base font-semibold">
                Satisfied Farmers
              </p>
            </div>
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
              Niceman Agro & Farm
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
