const express = require("express");
const router = express.Router();
const store = require("../data/seed");

// GET /api/reports/summary?year=2023&month=10
router.get("/summary", (req, res) => {
  const { year, month } = req.query;
  let data = store.transactions;

  if (year && month) {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    data = data.filter((t) => t.date.startsWith(prefix));
  } else if (year) {
    data = data.filter((t) => t.date.startsWith(year));
  }

  const totalIncome = data.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  // By category
  const byCategory = {};
  data
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!byCategory[t.categoryId]) {
        const cat = store.categories.find((c) => c.id === t.categoryId);
        byCategory[t.categoryId] = { categoryId: t.categoryId, label: cat?.name || t.categoryId, color: cat?.color || "#999", total: 0, count: 0 };
      }
      byCategory[t.categoryId].total += Math.abs(t.amount);
      byCategory[t.categoryId].count += 1;
    });

  const categoryBreakdown = Object.values(byCategory)
    .map((c) => ({ ...c, percentage: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);

  res.json({ totalIncome, totalExpense, netBalance: totalIncome - totalExpense, transactionCount: data.length, categoryBreakdown });
});

// GET /api/reports/monthly-trend?year=2023
router.get("/monthly-trend", (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  const months = Array.from({ length: 12 }, (_, i) => {
    const prefix = `${year}-${String(i + 1).padStart(2, "0")}`;
    const monthData = store.transactions.filter((t) => t.date.startsWith(prefix));
    const income = monthData.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = monthData.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
    return { month: i + 1, monthLabel: new Date(year, i, 1).toLocaleString("default", { month: "short" }), income, expense, net: income - expense };
  });
  res.json(months);
});

// GET /api/reports/top-spending?limit=5&year=2023&month=10
router.get("/top-spending", (req, res) => {
  const { limit = 5, year, month } = req.query;
  let data = store.transactions.filter((t) => t.type === "expense");

  if (year && month) {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    data = data.filter((t) => t.date.startsWith(prefix));
  }

  const byCategory = {};
  data.forEach((t) => {
    if (!byCategory[t.categoryId]) {
      const cat = store.categories.find((c) => c.id === t.categoryId);
      const budget = store.budgets.find((b) => b.categoryId === t.categoryId);
      byCategory[t.categoryId] = { categoryId: t.categoryId, label: cat?.name || t.categoryId, color: cat?.color || "#999", icon: cat?.icon || "label", total: 0, budgetLimit: budget?.limit || 0 };
    }
    byCategory[t.categoryId].total += Math.abs(t.amount);
  });

  const result = Object.values(byCategory)
    .sort((a, b) => b.total - a.total)
    .slice(0, Number(limit))
    .map((c) => ({ ...c, percentage: c.budgetLimit > 0 ? Math.round((c.total / c.budgetLimit) * 100) : null }));

  res.json(result);
});

module.exports = router;
