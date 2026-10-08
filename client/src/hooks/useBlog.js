import { useMemo, useState, useContext } from "react";
import { BlogContext } from "../context/BlogContext";

const dummyBlogs = [
  {
    id: 1,
    title: "How to Choose Fresh Farm Produce",
    slug: "how-to-choose-fresh-farm-produce",
    excerpt:
      "Learn simple ways to identify fresh, healthy and quality farm produce before buying.",
    content:
      "Choosing fresh farm produce is important for your health and overall cooking experience. At Niceman Agro & Farms, we believe customers should have access to quality agricultural products.",
    category: "Farming Tips",
    author: "Niceman Agro & Farms",
    date: "October 2, 2026",
    readTime: "5 min read",
    image: "/images/blog/2.jpg",
  },

  {
    id: 2,
    title: "Benefits of Eating Fresh Farm Products",
    slug: "benefits-of-eating-fresh-farm-products",
    excerpt:
      "Discover the benefits of including fresh farm products in your everyday meals.",
    content:
      "Fresh farm products can provide important nutrients and form an important part of a balanced diet. Fruits, vegetables and other agricultural products can contribute to healthy eating.",
    category: "Healthy Living",
    author: "Niceman Agro & Farms",
    date: "September 28, 2026",
    readTime: "4 min read",
    image: "/images/blog/16.jpg",
  },

  {
    id: 3,
    title: "Understanding Modern Farming",
    slug: "understanding-modern-farming",
    excerpt:
      "Take a look at how modern farming practices are helping farmers produce better food.",
    content:
      "Modern farming combines traditional agricultural knowledge with improved techniques and technology. These methods can help farmers improve productivity and manage resources more efficiently.",
    category: "Agriculture",
    author: "Niceman Agro & Farms",
    date: "September 20, 2026",
    readTime: "6 min read",
    image: "/images/blog/6.jpg",
  },

  {
    id: 4,
    title: "Why Supporting Local Farmers Matters",
    slug: "why-supporting-local-farmers-matters",
    excerpt:
      "Learn why buying from local farmers can benefit communities and the agricultural industry.",
    content:
      "Supporting local farmers helps strengthen agricultural communities and creates opportunities within the agricultural sector. Buying locally produced food can also contribute to the local economy.",
    category: "Farm Stories",
    author: "Niceman Agro & Farms",
    date: "September 15, 2026",
    readTime: "5 min read",
    image: "/images/blog/3.jpg",
  },

  {
    id: 5,
    title: "Simple Ways to Store Fresh Produce",
    slug: "simple-ways-to-store-fresh-produce",
    excerpt:
      "Use these simple storage tips to keep your fruits and vegetables fresh for longer.",
    content:
      "Proper storage can help reduce food waste and keep farm produce fresh. Different fruits and vegetables require different storage conditions, so understanding how to store them properly is important.",
    category: "Farming Tips",
    author: "Niceman Agro & Farms",
    date: "September 10, 2026",
    readTime: "4 min read",
    image: "/images/blog/7.jpg",
  },

  {
    id: 6,
    title: "From Our Farm to Your Table",
    slug: "from-our-farm-to-your-table",
    excerpt:
      "See how agricultural products move from the farm through the supply chain to consumers.",
    content:
      "From planting and harvesting to packaging and delivery, several steps are involved in getting agricultural products from the farm to the customer. This is the journey from our farm to your table.",
    category: "Agriculture",
    author: "Niceman Agro & Farms",
    date: "September 5, 2026",
    readTime: "7 min read",
    image: "/images/blog/11.jpg",
  },
];

function useBlog() {
  const ctx = useContext(BlogContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const source = ctx?.posts || dummyBlogs;

  const categories = useMemo(() => {
    return ["All", ...new Set(source.map((blog) => blog.category))];
  }, [source]);

  const filteredBlogs = useMemo(() => {
    return source.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        (blog.title || "").toLowerCase().includes(search) ||
        (blog.excerpt || "").toLowerCase().includes(search) ||
        (blog.category || "").toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, source]);

  const getBlogBySlug = (slug) => {
    return source.find(
      (blog) => blog.slug === slug || String(blog.id) === String(slug),
    );
  };

  return {
    blogs: filteredBlogs,
    allBlogs: source,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    getBlogBySlug,
  };
}

export default useBlog;
