import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";
import { logger } from "./middleware/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import healthRoutes from "./routes/health.route.js";
import sendRoutes from "./routes/send.route.js";

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

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to Relay Channel Service",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/send", sendRoutes);

/*
|--------------------------------------------------------------------------
| Error Handling — must be registered last
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(ENV.PORT, () => {
  console.log(`Relay Channel Service running at http://localhost:${ENV.PORT}`);
});
