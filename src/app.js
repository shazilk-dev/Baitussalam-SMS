import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

import indexRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import attendanceRoutes from "./routes/attendance.js";

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/attendance", attendanceRoutes);

app.use((err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.status || err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).render("pages/error", {
    title: `Error ${statusCode}`,
    statusCode: statusCode,
    error: statusCode === 500 ? "Internal Server Error" : errorMessage,
    message:
      statusCode === 500
        ? "We encountered an unexpected error. Please try again later."
        : errorMessage,
  });
});

app.use((req, res, next) => {
  res.status(404).render("pages/404");
});

export { app };
