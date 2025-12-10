require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to DB first
connectDB().then(() => console.log("DB connected")).catch(err => console.error(err));

const webhookRoute = require("./routes/webhook");
app.use("/webhook", webhookRoute);

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://course-master-client.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or tools without origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/checkout", require("./routes/checkout"));
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courseRoutes");
const adminCourseRoutes = require("./routes/adminCourseRoutes");
const adminAssignmentRoutes = require("./routes/adminAssignmentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/assignments", adminAssignmentRoutes);

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


module.exports = app;
