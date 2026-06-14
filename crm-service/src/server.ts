import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";
import { logger } from "./middleware/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import healthRoutes from "./routes/health.route.js";
import customerRoutes from "./routes/customer.route.js";
import orderRoutes from "./routes/order.route.js";
import segmentRoutes from "./routes/segment.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import receiptRoutes from "./routes/receipt.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import aiRoutes from "./routes/ai.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Welcome to Relay CRM Service" });
});

app.use("/api/health", healthRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/receipt", receiptRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorMiddleware);

app.listen(ENV.PORT, () => {
  console.log(` Relay CRM Service running at http://localhost:${ENV.PORT}`);
});
