export const categoriesSeed = [
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

export const productsSeed = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "Fertilizers",
    sku: "NAG-FRT-001",
    price: 3500,
    stock: 45,
    description:
      "Fresh, locally sourced tomatoes suitable for everyday cooking.",
    image: "/images/products/tomatoes.jpg",
    status: "Active",
    featured: true,
  },
  {
    id: 2,
    name: "Premium Rice",
    category: "Herbicides",
    sku: "NAG-PRC-002",
    price: 45000,
    stock: 8,
    description: "High-quality premium rice for everyday meals.",
    image: "/images/products/rice.jpg",
    status: "Active",
    featured: true,
  },
  {
    id: 3,
    name: "Irish Potatoes",
    category: "Insecticides",
    sku: "NAG-ITP-003",
    price: 6000,
    stock: 0,
    description: "Fresh Irish potatoes sourced from trusted farms.",
    image: "/images/products/potatoes.jpg",
    status: "Active",
    featured: false,
  },
  {
    id: 4,
    name: "Fresh Chicken",
    category: "Seeds",
    sku: "NAG-FCH-004",
    price: 8500,
    stock: 25,
    description: "Fresh and quality poultry products.",
    image: "/images/products/chicken.jpg",
    status: "Active",
    featured: false,
  },
  {
    id: 5,
    name: "Fresh Mangoes",
    category: "Farm Equipment",
    sku: "NAG-FMG-005",
    price: 5000,
    stock: 12,
    description: "Fresh, sweet and naturally sourced mangoes.",
    image: "/images/products/mangoes.jpg",
    status: "Inactive",
    featured: false,
  },
];

export const ordersSeed = [
  {
    id: "NA-2026-00125",
    customer: {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+234 801 234 5678",
      address: "12 Farm Road, Lagos, Nigeria",
    },
    date: "October 6, 2026",
    status: "Processing",
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    deliveryFee: 3000,
    items: [
      { id: 1, name: "Fresh Tomatoes", quantity: 2, price: 3500 },
      { id: 2, name: "Premium Rice", quantity: 1, price: 45000 },
    ],
  },
  {
    id: "NA-2026-00124",
    customer: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+234 803 456 7890",
      address: "45 Market Street, Lagos, Nigeria",
    },
    date: "October 5, 2026",
    status: "Delivered",
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    deliveryFee: 2500,
    items: [
      { id: 2, name: "Premium Rice", quantity: 1, price: 45000 },
      { id: 5, name: "Fresh Mangoes", quantity: 2, price: 5000 },
    ],
  },
  {
    id: "NA-2026-00123",
    customer: {
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+234 805 678 9012",
      address: "78 Garden Ave, Lagos, Nigeria",
    },
    date: "October 5, 2026",
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    deliveryFee: 2000,
    items: [{ id: 4, name: "Fresh Chicken", quantity: 1, price: 32000 }],
  },
  {
    id: "NA-2026-00122",
    customer: {
      name: "Grace Okafor",
      email: "grace@example.com",
      phone: "+234 806 789 0123",
      address: "22 Farm Lane, Lagos, Nigeria",
    },
    date: "October 4, 2026",
    status: "Delivered",
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    deliveryFee: 3000,
    items: [
      { id: 3, name: "Irish Potatoes", quantity: 2, price: 6000 },
      { id: 5, name: "Fresh Mangoes", quantity: 2, price: 5000 },
    ],
  },
  {
    id: "NA-2026-00121",
    customer: {
      name: "David Williams",
      email: "david@example.com",
      phone: "+234 807 890 1234",
      address: "11 Harvest Road, Lagos, Nigeria",
    },
    date: "October 3, 2026",
    status: "Cancelled",
    paymentMethod: "Paystack",
    paymentStatus: "Paid",
    deliveryFee: 3000,
    items: [
      { id: 1, name: "Fresh Tomatoes", quantity: 1, price: 3500 },
      { id: 3, name: "Irish Potatoes", quantity: 3, price: 6000 },
    ],
  },
];

export const customersSeed = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+234 801 234 5678",
    orders: 8,
    totalSpent: 245000,
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+234 803 456 7890",
    orders: 12,
    totalSpent: 380000,
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+234 805 678 9012",
    orders: 5,
    totalSpent: 125000,
    status: "Active",
  },
  {
    id: 4,
    name: "Grace Okafor",
    email: "grace@example.com",
    phone: "+234 806 789 0123",
    orders: 3,
    totalSpent: 87000,
    status: "Inactive",
  },
];

export const blogPostsSeed = [
  {
    id: 1,
    title: "5 Benefits of Eating Fresh Farm Produce",
    category: "Healthy Living",
    author: "Admin",
    date: "Oct 2, 2026",
    status: "Published",
  },
  {
    id: 2,
    title: "How to Store Fresh Vegetables Properly",
    category: "Farming Tips",
    author: "Admin",
    date: "Sep 28, 2026",
    status: "Published",
  },
  {
    id: 3,
    title: "Understanding Sustainable Agriculture",
    category: "Agriculture",
    author: "Admin",
    date: "Sep 20, 2026",
    status: "Draft",
  },
];

export const promotionsSeed = [
  {
    id: 1,
    name: "Fresh Produce Discount",
    code: "FRESH20",
    type: "Percentage",
    value: 20,
    startDate: "Oct 1, 2026",
    endDate: "Oct 15, 2026",
    usage: 34,
    status: "Active",
  },
  {
    id: 2,
    name: "New Customer Discount",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    startDate: "Sep 1, 2026",
    endDate: "Dec 31, 2026",
    usage: 58,
    status: "Active",
  },
  {
    id: 3,
    name: "Rice Special Offer",
    code: "RICE5000",
    type: "Fixed",
    value: 5000,
    startDate: "Sep 20, 2026",
    endDate: "Oct 10, 2026",
    usage: 21,
    status: "Active",
  },
  {
    id: 4,
    name: "Harvest Season Sale",
    code: "HARVEST25",
    type: "Percentage",
    value: 25,
    startDate: "Aug 1, 2026",
    endDate: "Aug 31, 2026",
    usage: 76,
    status: "Expired",
  },
];

export const reviewsSeed = [
  {
    id: 1,
    type: "general",
    customer: "John Doe",
    email: "johndoe@example.com",
    rating: 5,
    review: "Very fresh tomatoes and excellent quality. Will order again.",
    comment: "Very fresh tomatoes and excellent quality. Will order again.",
    date: "Oct 5, 2026",
    status: "Approved",
    product: "General Experience",
    productName: "General Experience",
  },
  {
    id: 2,
    type: "general",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    rating: 4,
    review: "Good quality rice and fast delivery.",
    comment: "Good quality rice and fast delivery.",
    date: "Oct 4, 2026",
    status: "Approved",
    product: "General Experience",
    productName: "General Experience",
  },
  {
    id: 3,
    type: "product",
    customer: "Michael Johnson",
    email: "michael@example.com",
    product: "Fresh Chicken",
    productName: "Fresh Chicken",
    productId: 3,
    rating: 3,
    review: "The product was okay but delivery took longer than expected.",
    comment: "The product was okay but delivery took longer than expected.",
    date: "Oct 3, 2026",
    status: "Pending",
  },
  {
    id: 4,
    type: "general",
    customer: "Grace Okafor",
    email: "grace@example.com",
    rating: 2,
    review: "The mangoes were not as fresh as I expected.",
    comment: "The mangoes were not as fresh as I expected.",
    date: "Oct 2, 2026",
    status: "Pending",
    product: "General Experience",
    productName: "General Experience",
  },
  {
    id: 5,
    type: "general",
    customer: "David Williams",
    email: "david@example.com",
    rating: 5,
    review: "Excellent quality. Everything arrived fresh.",
    comment: "Excellent quality. Everything arrived fresh.",
    date: "Oct 1, 2026",
    status: "Approved",
    product: "General Experience",
    productName: "General Experience",
  },
];

export const websiteContentSeed = {
  hero: {
    // Maintain backward-compatible top-level hero fields while introducing
    // a slides array so we can support multiple hero slides in the admin.
    // The existing content is preserved as Slide 1.
    slides: [
      {
        title: "Fresh From Our Farm to Your Table",
        subtitle: "Quality farm produce delivered fresh to your doorstep.",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        image: "/images/5.jpg",
      },
      {
        title: "Discover Our Farm Products",
        subtitle: "Naturally grown and carefully selected produce.",
        buttonText: "Learn More",
        buttonLink: "/about",
        image: "/images/hero-2.jpg",
      },
    ],
    // Keep the original top-level keys for compatibility with existing
    // components that read `content.hero.title`, etc. These mirror Slide 1.
    title: "Fresh From Our Farm to Your Table",
    subtitle: "Quality farm produce delivered fresh to your doorstep.",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/images/5.jpg",
  },
  about: {
    title: "About Niceman Agro & Farms",
    description:
      "We provide farm inputs and fresh, quality agricultural products sourced from trusted farms and delivered to customers with care.",
    image: "/images/6.jpg",
  },
  contact: {
    phone: "+234 8067030126",
    email: "info@nicemanagro.com",
    address: "Uyo, Nigeria",
    whatsapp: "+234 8067030126",
  },
  footer: {
    description: "Quality inputs delivered to your doorstep.",
    copyright: "© 2026 Niceman Agro & Farms. All rights reserved.",
  },
};

export function readLocalStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage`, error);
    return fallback;
  }
}

export function writeLocalStorage(key, value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
}
