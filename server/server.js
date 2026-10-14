import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import errorMiddleware from "./middlewares/errorMiddleware.js";
import express from "express";
import userRouter from "./routes/userRoutes.js";
import productsRouter from "./routes/productsRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import clientContentRouter from "./routes/clientContentRoutes.js";
import customerCommerceRouter from "./routes/customerCommerceRoutes.js";
import morgan from "morgan";
import connect from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import uploadRoutes from "./routes/uploadRoutes.js";
import helmet from "helmet";
import { releaseExpiredReservations } from "./services/paystack.js";

const app = express();
const validateRequiredConfiguration = () => {
  const required = ["MONGODB_URL", "JWT_SECRET"];
  if (process.env.NODE_ENV === "production") {
    required.push("CLIENT_URL", "API_URL", "EMAIL_USER", "EMAIL_PASS");
  }
  const missing = required.filter((key) => !process.env[key]);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  if (missing.length)
    throw new Error(
      `Missing required environment configuration: ${missing.join(", ")}`,
    );
};
validateRequiredConfiguration();
const normalizeOrigin = (value) => {
  if (!value) return "";
  return value.replace(/\/+$/, "");
};

const clientOrigins = [
  normalizeOrigin(process.env.CLIENT_URL),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

const allowedOrigins = clientOrigins.map((origin) => {
  try {
    return new URL(origin).origin;
  } catch {
    return origin;
  }
});

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = (() => {
        try {
          return new URL(origin).origin;
        } catch {
          return origin;
        }
      })();
      const allowed = allowedOrigins.includes(normalizedOrigin);
      if (allowed) return callback(null, true);
      console.warn(`CORS rejected origin: ${origin}`);
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.options(
  /^(.*)$/,
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = (() => {
        try {
          return new URL(origin).origin;
        } catch {
          return origin;
        }
      })();
      if (allowedOrigins.includes(normalizedOrigin))
        return callback(null, true);
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buffer) => {
      req.rawBody = Buffer.from(buffer);
    },
  }),
);
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(
  morgan("tiny", {
    skip: (req) =>
      process.env.NODE_ENV === "production" ||
      /\/(login|register|refresh-token|verify-email|reset-password)\b/.test(
        req.path,
      ),
  }),
);
app.use(cookieParser());
app.use(limiter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1", productsRouter);
app.use("/api/v1", clientContentRouter);
app.use("/api/v1", customerCommerceRouter);
app.use("/api/v1/files", uploadRoutes);
app.use("/api/v1/admin", adminRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
connect()
  .then(() => {
    const reservationCleanup = setInterval(() => {
      releaseExpiredReservations().catch((error) => {
        console.error(
          "Unable to release expired inventory reservations:",
          error.message,
        );
      });
    }, 60 * 1000);
    reservationCleanup.unref();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "Unable to start server because database initialization failed",
    );
    process.exitCode = 1;
    throw error;
  });
