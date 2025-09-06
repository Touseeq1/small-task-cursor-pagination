import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import taskRoute from "./routes/taskRoute.js";
const app = express();

import cors from "cors";


// Allow React frontend (port 5173) to call backend
app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true,                // if you use cookies or auth headers
}));



// for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/config.env" });
}

connectDatabase();

// Middleware
app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1", taskRoute);


// Serve frontend in production
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// Error middleware
app.use(errorMiddleware);

// Server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handle uncaught exceptions & rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
