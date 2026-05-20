const express = require("express");
const cors = require("cors");

const transactionsRouter = require("./routes/transactions");
const categoriesRouter = require("./routes/categories");
const budgetRouter = require("./routes/budget");
const reportsRouter = require("./routes/reports");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*", // Ganti dengan domain frontend kamu saat production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    name: "Financial Integrity API",
    version: "1.0.0",
    status: "ok",
    endpoints: [
      "GET  /api/transactions",
      "POST /api/transactions",
      "PUT  /api/transactions/:id",
      "DELETE /api/transactions/:id",
      "GET  /api/transactions/summary/monthly",
      "GET  /api/categories",
      "POST /api/categories",
      "PUT  /api/categories/:id",
      "DELETE /api/categories/:id",
      "GET  /api/budget",
      "GET  /api/budget/global",
      "PUT  /api/budget/global",
      "POST /api/budget",
      "PUT  /api/budget/:id",
      "DELETE /api/budget/:id",
      "GET  /api/reports/summary",
      "GET  /api/reports/monthly-trend",
      "GET  /api/reports/top-spending",
    ],
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/reports", reportsRouter);

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// Local dev server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀  API running at http://localhost:${PORT}/api`));
}

module.exports = app;
