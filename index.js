require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to DB first
connectDB().then(() => console.log("DB connected")).catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => {
  res.send("API Server is running successfully!");
});

// Only start server if running locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}

// Export app for serverless Vercel deployment
module.exports = app;
