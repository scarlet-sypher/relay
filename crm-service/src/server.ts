import express from "express";
import cors from "cors";

import { PORT } from "./config/env.js";

import healthRoutes from "./routes/health.route.js";

import { logger } from "./middleware/logger.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(express.json());

app.use(logger);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CRM Service",
  });
});

app.use("/api/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
