const express = require("express");
const cors    = require("cors");

const transactionsRouter = require("./routes/transactions");
const categoriesRouter   = require("./routes/categories");
const budgetsRouter      = require("./routes/budgets");
const dashboardRouter    = require("./routes/dashboard");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

/* ── CORS ──────────────────────────────────────────────────
   Allow all origins (handles preflight OPTIONS too)
──────────────────────────────────────────────────────────── */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Health check ──────────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({
    service: "Financial Integrity API",
    version: "1.0.0",
    status: "ok",
    endpoints: {
      dashboard: "/api/dashboard",
      transactions: "/api/transactions",
      categories: "/api/categories",
      budgets: "/api/budgets",
    },
  });
});

/* ── Routes ─────────────────────────────────────────────── */
app.use("/api/dashboard",    dashboardRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories",   categoriesRouter);
app.use("/api/budgets",      budgetsRouter);

/* ── Error handlers ─────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ── Start server (skipped when imported by Vercel) ─────── */
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅  Financial Integrity API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
