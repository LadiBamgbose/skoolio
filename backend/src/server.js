import 'dotenv/config';
import express from "express";
import cors from "cors";
import QuizRoutes from "./apiRoutes/QuizRoutes.js";
import AuthRoutes from "./apiRoutes/AuthRoutes.js";
import BillingRoutes from "./apiRoutes/BillingRoutes.js"
import StripeWebhookRoutes from "./apiRoutes/StripeWebhookRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors());

// Stripe webhook route MUST come before express.json()
// Needs raw body for signature verification
app.use(
  "/api/billing/webhook",
  express.raw({ type: 'application/json' }),
  StripeWebhookRoutes
);

// Parse JSON for all other routes
app.use(express.json());

// Auth routes
app.use("/api/auth", AuthRoutes);
// Quiz routes
app.use("/api/quiz", QuizRoutes);
// billing routes
app.use("/api/billing", BillingRoutes);

app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

