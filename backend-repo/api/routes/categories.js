const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const store = require("../data/seed");

// GET /api/categories
router.get("/", (req, res) => {
  const { type, status } = req.query;
  let data = [...store.categories];
  if (type) data = data.filter((c) => c.type === type);
  if (status) data = data.filter((c) => c.status === status);
  res.json(data);
});

// GET /api/categories/:id
router.get("/:id", (req, res) => {
  const item = store.categories.find((c) => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Category not found" });
  res.json(item);
});

// POST /api/categories
router.post("/", (req, res) => {
  const { name, icon, color, type, description } = req.body;
  if (!name || !type) return res.status(400).json({ error: "name and type are required" });
  const newItem = {
    id: uuidv4(),
    name,
    icon: icon || "label",
    color: color || "#6366F1",
    type,
    description: description || "",
    status: "active",
  };
  store.categories.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/categories/:id
router.put("/:id", (req, res) => {
  const idx = store.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  store.categories[idx] = { ...store.categories[idx], ...req.body, id: req.params.id };
  res.json(store.categories[idx]);
});

// DELETE /api/categories/:id
router.delete("/:id", (req, res) => {
  const idx = store.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  // Soft-delete: set status to inactive
  store.categories[idx].status = "inactive";
  res.json({ success: true, id: req.params.id });
});

module.exports = router;
