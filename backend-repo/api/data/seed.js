// In-memory data store (resets on cold start — swap with DB for persistence)
let transactions = [
  { id: "t1", date: "2023-10-24", description: "Whole Foods Market", note: "Weekly groceries", categoryId: "c1", method: "Credit Card", amount: -142500, type: "expense" },
  { id: "t2", date: "2023-10-22", description: "Gojek Top-Up", note: "", categoryId: "c3", method: "Bank Transfer", amount: -50000, type: "expense" },
  { id: "t3", date: "2023-10-21", description: "Netflix Subscription", note: "Monthly plan", categoryId: "c4", method: "Credit Card", amount: -54000, type: "expense" },
  { id: "t4", date: "2023-10-20", description: "Salary - October", note: "Net salary", categoryId: "c5", method: "Bank Transfer", amount: 24500000, type: "income" },
  { id: "t5", date: "2023-10-18", description: "Makan siang kantor", note: "", categoryId: "c1", method: "Cash", amount: -45000, type: "expense" },
  { id: "t6", date: "2023-10-17", description: "Freelance Project", note: "Landing page design", categoryId: "c5", method: "Bank Transfer", amount: 3500000, type: "income" },
  { id: "t7", date: "2023-10-15", description: "Spotify Premium", note: "", categoryId: "c4", method: "Credit Card", amount: -54000, type: "expense" },
  { id: "t8", date: "2023-10-14", description: "Grab Car", note: "To airport", categoryId: "c3", method: "GoPay", amount: -120000, type: "expense" },
];

let categories = [
  { id: "c1", name: "Food & Dining", icon: "restaurant", color: "#F59E0B", type: "expense", description: "Meals, groceries, coffee", status: "active" },
  { id: "c2", name: "Housing", icon: "home", color: "#6366F1", type: "expense", description: "Rent, utilities, maintenance", status: "active" },
  { id: "c3", name: "Transport", icon: "directions_car", color: "#10B981", type: "expense", description: "Fuel, ride-hailing, parking", status: "active" },
  { id: "c4", name: "Entertainment", icon: "sports_esports", color: "#EC4899", type: "expense", description: "Streaming, games, hobbies", status: "active" },
  { id: "c5", name: "Income", icon: "payments", color: "#0EA5E9", type: "income", description: "Salary, freelance, dividends", status: "active" },
  { id: "c6", name: "Healthcare", icon: "health_and_safety", color: "#EF4444", type: "expense", description: "Doctor, medicine, insurance", status: "active" },
];

let budgets = [
  { id: "b1", categoryId: "c1", limit: 5000000, period: "monthly", label: "Food & Dining" },
  { id: "b2", categoryId: "c3", limit: 2000000, period: "monthly", label: "Transport" },
  { id: "b3", categoryId: "c4", limit: 2000000, period: "monthly", label: "Entertainment" },
  { id: "b4", categoryId: "c2", limit: 8000000, period: "monthly", label: "Housing" },
];

let globalBudget = { limit: 20000000, period: "monthly" };

module.exports = { transactions, categories, budgets, globalBudget };
