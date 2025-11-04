// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import QuizRoutes from "./apiRoutes/QuizRoutes.js";
import AuthRoutes from "./apiRoutes/AuthRoutes.js";
import BillingRoutes from "./apiRoutes/BillingRoutes.js";
import StripeWebhookRoutes from "./apiRoutes/StripeWebhookRoutes.js";

const app = express();

// --- Security headers
app.use(helmet());

// --- CORS: restrict to allowed origins from env
// e.g. CORS_ORIGINS="https://skoolio.app,https://www.skoolio.app"
const allowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --- Health check (for Sevalla)
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// --- Stripe webhook MUST come before express.json()
// keeps raw body for signature verification
app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  StripeWebhookRoutes
);

// --- JSON for all other routes
app.use(express.json({ limit: "1mb" }));

// --- Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/quiz", QuizRoutes);
app.use("/api/billing", BillingRoutes);

// --- Port: use platform-provided PORT or fallback
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
