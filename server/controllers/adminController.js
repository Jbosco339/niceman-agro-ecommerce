import bcrypt from "bcrypt";
import { User } from "../models/userSchema.js";
import { AdminRecord } from "../models/AdminRecord.js";
import { Product } from "../models/Product.js";
import { accessToken, refreshToken } from "../utils/jwt.js";
import { clearAuthCookies, setAuthCookies } from "../utils/authCookies.js";
import { emailVerificationEnabled } from "../utils/verification.js";

const safeAdmin = (user) => ({
  id: user._id,
  userName: user.userName,
  email: user.email,
  role: user.role,
});

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ status: "failed", message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );
  if (!user || user.role !== "admin") {
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid email or password." });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid email or password." });
  }

  if (emailVerificationEnabled() && !user.isVerified) {
    return res.status(403).json({
      status: "failed",
      message: "Please verify your email before signing in.",
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      status: "failed",
      message: "This administrator account is inactive. Contact your system administrator.",
    });
  }

  setAuthCookies(
    res,
    accessToken({ id: user._id }),
    refreshToken({ id: user._id }),
  );
  return res.status(200).json({ status: "success", data: safeAdmin(user) });
};

export const logoutAdmin = (_req, res) => {
  clearAuthCookies(res);
  return res.status(200).json({ status: "success", message: "Logged out" });
};

export const getCurrentAdmin = (req, res) =>
  res.status(200).json({ status: "success", data: safeAdmin(req.user) });

export const getAdminDashboard = async (_req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const validOrderStatuses = [
    "Pending",
    "Processing",
    "Delivered",
    "Cancelled",
  ];

  const [
    customers,
    newCustomers,
    products,
    lowStock,
    orders,
    revenueResult,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    blogPosts,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "user", createdAt: { $gte: thirtyDaysAgo } }),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 10 } }),
    AdminRecord.countDocuments({ resource: "order" }),
    AdminRecord.aggregate([
      {
        $match: {
          resource: "order",
          "payload.paymentStatus": "Paid",
          "payload.status": { $ne: "Cancelled" },
        },
      },
      {
        $addFields: {
          totalValue: {
            $convert: {
              input: "$payload.total",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalValue" } } },
    ]),
    AdminRecord.countDocuments({
      resource: "order",
      "payload.status": "Pending",
    }),
    AdminRecord.countDocuments({
      resource: "order",
      "payload.status": "Processing",
    }),
    AdminRecord.countDocuments({
      resource: "order",
      "payload.status": "Delivered",
    }),
    AdminRecord.countDocuments({
      resource: "order",
      "payload.status": "Cancelled",
    }),
    AdminRecord.countDocuments({
      resource: "article",
      "payload.status": "Published",
    }),
    AdminRecord.find({ resource: "order" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const revenue = Number(revenueResult?.[0]?.total ?? 0);
  const summaryStatus = {
    Pending: pendingOrders,
    Processing: processingOrders,
    Delivered: deliveredOrders,
    Cancelled: cancelledOrders,
  };

  const normalizedRecentOrders = recentOrders
    .filter(
      (record) =>
        record?.payload && validOrderStatuses.includes(record.payload.status),
    )
    .map((record) => {
      const total = Number(record.payload?.total ?? 0);
      const customer =
        typeof record.payload?.customer === "string"
          ? record.payload.customer
          : (record.payload?.customer?.name ??
            record.payload?.email ??
            "Guest");

      return {
        ...record.payload,
        id: record._id.toString(),
        amount: total,
        total,
        customer,
        date: record.payload?.date ?? record.createdAt,
      };
    });

  return res.status(200).json({
    status: "success",
    data: {
      customers,
      newCustomers,
      products,
      lowStock,
      orders,
      revenue,
      orderStatus: summaryStatus,
      blogPosts,
      recentOrders: normalizedRecentOrders,
    },
  });
};
