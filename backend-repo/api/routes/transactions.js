const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const store = require("../data/seed");

// GET /api/transactions
router.get("/", (req, res) => {
  let { type, categoryId, method, from, to, search, page = 1, limit = 20 } = req.query;
  let data = [...store.transactions];

  if (type) data = data.filter((t) => t.type === type);
  if (categoryId) data = data.filter((t) => t.categoryId === categoryId);
  if (method) data = data.filter((t) => t.method === method);
  if (from) data = data.filter((t) => t.date >= from);
  if (to) data = data.filter((t) => t.date <= to);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((t) => t.description.toLowerCase().includes(q) || (t.note || "").toLowerCase().includes(q));
  }

  data.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = data.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = data.slice(start, start + Number(limit));

  res.json({ data: paginated, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
});

// GET /api/transactions/:id
router.get("/:id", (req, res) => {
  const item = store.transactions.find((t) => t.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Transaction not found" });
  res.json(item);
});

// POST /api/transactions
router.post("/", (req, res) => {
  const { date, description, note, categoryId, method, amount, type } = req.body;
  if (!date || !description || !categoryId || amount === undefined || !type) {
    return res.status(400).json({ error: "date, description, categoryId, amount, type are required" });
  }
  const newItem = { id: uuidv4(), date, description, note: note || "", categoryId, method: method || "Cash", amount: Number(amount), type };
  store.transactions.unshift(newItem);
  res.status(201).json(newItem);
});

// PUT /api/transactions/:id
router.put("/:id", (req, res) => {
  const idx = store.transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transaction not found" });
  store.transactions[idx] = { ...store.transactions[idx], ...req.body, id: req.params.id };
  res.json(store.transactions[idx]);
});

// DELETE /api/transactions/:id
router.delete("/:id", (req, res) => {
  const idx = store.transactions.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Transaction not found" });
  store.transactions.splice(idx, 1);
  res.json({ success: true, id: req.params.id });
});

// GET /api/transactions/summary/monthly
router.get("/summary/monthly", (req, res) => {
  const { year, month } = req.query;
  let data = store.transactions;

  if (year && month) {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    data = data.filter((t) => t.date.startsWith(prefix));
  }

  const totalIncome = data.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  res.json({ totalIncome, totalExpense, netBalance: totalIncome - totalExpense, count: data.length });
});

module.exports = router;
