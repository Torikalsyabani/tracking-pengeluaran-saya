const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const store = require("../data/seed");

// GET /api/budget — list all category budgets + global limit
router.get("/", (req, res) => {
  // Enrich budgets with current spend
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const enriched = store.budgets.map((b) => {
    const spent = store.transactions
      .filter((t) => t.categoryId === b.categoryId && t.type === "expense" && t.date.startsWith(monthPrefix))
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const percentage = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
    return { ...b, spent, percentage, overBudget: spent > b.limit };
  });

  res.json({ global: store.globalBudget, categories: enriched });
});

// GET /api/budget/global
router.get("/global", (req, res) => {
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const totalSpent = store.transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(monthPrefix))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const percentage = store.globalBudget.limit > 0 ? Math.round((totalSpent / store.globalBudget.limit) * 100) : 0;
  res.json({ ...store.globalBudget, spent: totalSpent, percentage });
});

// PUT /api/budget/global
router.put("/global", (req, res) => {
  const { limit, period } = req.body;
  if (limit !== undefined) store.globalBudget.limit = Number(limit);
  if (period) store.globalBudget.period = period;
  res.json(store.globalBudget);
});

// POST /api/budget — create a category budget
router.post("/", (req, res) => {
  const { categoryId, limit, period, label } = req.body;
  if (!categoryId || limit === undefined) return res.status(400).json({ error: "categoryId and limit are required" });
  const existing = store.budgets.findIndex((b) => b.categoryId === categoryId);
  if (existing !== -1) {
    store.budgets[existing] = { ...store.budgets[existing], limit: Number(limit), period: period || "monthly", label: label || store.budgets[existing].label };
    return res.json(store.budgets[existing]);
  }
  const newItem = { id: uuidv4(), categoryId, limit: Number(limit), period: period || "monthly", label: label || "" };
  store.budgets.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/budget/:id
router.put("/:id", (req, res) => {
  const idx = store.budgets.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Budget not found" });
  store.budgets[idx] = { ...store.budgets[idx], ...req.body, id: req.params.id };
  res.json(store.budgets[idx]);
});

// DELETE /api/budget/:id
router.delete("/:id", (req, res) => {
  const idx = store.budgets.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Budget not found" });
  store.budgets.splice(idx, 1);
  res.json({ success: true, id: req.params.id });
});

module.exports = router;
