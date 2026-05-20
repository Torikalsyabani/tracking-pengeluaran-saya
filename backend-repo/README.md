# Financial Integrity — Backend API

REST API untuk aplikasi **Financial Integrity** (Personal Finance Tracker).  
Dibangun dengan **Express.js**, siap deploy ke **Vercel**.

---

## 🚀 Deploy ke Vercel (3 langkah)

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/financial-integrity-backend.git
git push -u origin main
```

### 2. Import di Vercel
1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **Import** → pilih repo `financial-integrity-backend`
3. Klik **Deploy** — tidak perlu konfigurasi tambahan

### 3. Selesai 🎉
URL API kamu akan jadi:
```
https://financial-integrity-backend.vercel.app/api
```

---

## 💻 Jalankan Lokal

```bash
npm install
npm run dev    # http://localhost:3001/api
```

---

## 📋 API Endpoints

### Transactions
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/transactions` | List semua transaksi |
| GET | `/api/transactions?type=expense` | Filter by type |
| GET | `/api/transactions?categoryId=c1` | Filter by kategori |
| GET | `/api/transactions?search=grab` | Search |
| GET | `/api/transactions?page=1&limit=20` | Pagination |
| GET | `/api/transactions?from=2023-10-01&to=2023-10-31` | Filter by tanggal |
| GET | `/api/transactions/:id` | Detail transaksi |
| GET | `/api/transactions/summary/monthly?year=2023&month=10` | Ringkasan bulanan |
| POST | `/api/transactions` | Tambah transaksi baru |
| PUT | `/api/transactions/:id` | Update transaksi |
| DELETE | `/api/transactions/:id` | Hapus transaksi |

**Body POST/PUT:**
```json
{
  "date": "2023-10-24",
  "description": "Whole Foods Market",
  "note": "Weekly groceries",
  "categoryId": "c1",
  "method": "Credit Card",
  "amount": -142500,
  "type": "expense"
}
```

---

### Categories
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/categories` | List semua kategori |
| GET | `/api/categories?type=expense` | Filter by type |
| GET | `/api/categories/:id` | Detail kategori |
| POST | `/api/categories` | Buat kategori baru |
| PUT | `/api/categories/:id` | Update kategori |
| DELETE | `/api/categories/:id` | Nonaktifkan kategori |

**Body POST/PUT:**
```json
{
  "name": "Groceries",
  "icon": "shopping_cart",
  "color": "#F59E0B",
  "type": "expense",
  "description": "Belanja bulanan"
}
```

---

### Budget & Limits
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/budget` | Semua budget + realisasi |
| GET | `/api/budget/global` | Global monthly limit |
| PUT | `/api/budget/global` | Update global limit |
| POST | `/api/budget` | Set budget per kategori |
| PUT | `/api/budget/:id` | Update budget |
| DELETE | `/api/budget/:id` | Hapus budget |

**Body PUT global:**
```json
{ "limit": 20000000, "period": "monthly" }
```

---

### Reports
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/reports/summary?year=2023&month=10` | Ringkasan periode |
| GET | `/api/reports/monthly-trend?year=2023` | Trend 12 bulan |
| GET | `/api/reports/top-spending?limit=5&year=2023&month=10` | Top pengeluaran |

---

## ⚠️ Catatan Penting

> **In-memory storage**: Data reset setiap kali serverless function cold start.  
> Untuk data persisten, integrasikan database seperti:
> - **Vercel Postgres** (gratis, mudah setup)
> - **PlanetScale** / **Neon** (MySQL/Postgres serverless)
> - **MongoDB Atlas** (NoSQL)

---

## 🔌 Menghubungkan ke Frontend

Setelah deploy, ganti base URL di frontend:
```javascript
const API_BASE = "https://financial-integrity-backend.vercel.app";

// Contoh fetch transaksi
const res = await fetch(`${API_BASE}/api/transactions`);
const { data } = await res.json();
```

Untuk production, update CORS di `api/index.js`:
```javascript
cors({ origin: "https://your-frontend-domain.vercel.app" })
```
