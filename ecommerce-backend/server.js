const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const testRoutes = require("./routes/test");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/addresses");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const blogRoutes = require("./routes/blog");
const projectRoutes = require('./routes/projects');
const queryRoutes = require('./routes/queries');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(express.json());

// ---------------------------------------------------------------------
// CORS - single source of truth. Add any new Vite dev ports here if
// your frontend/admin ever spins up on a different port.
// ---------------------------------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", reviewRoutes);
app.use("/api/blog", blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/stats', statsRoutes);

// ---------------------------------------------------------------------
// Serve the built React apps so both the storefront and the admin panel
// live on this ONE server/domain. This is what makes "/admin" at the end
// of the address work in the browser:
//   https://yourdomain.com/          -> frontend (customer store)
//   https://yourdomain.com/admin     -> admin dashboard
//
// Build both apps first:
//   cd frontend && npm run build
//   cd admin/AdminDashboard && npm run build
// Each produces a `dist` folder, which is what gets served below.
// ---------------------------------------------------------------------
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');
const ADMIN_DIST = path.join(__dirname, '..', 'admin', 'AdminDashboard', 'dist');

// --- Admin app: everything under /admin ---
if (fs.existsSync(ADMIN_DIST)) {
  app.use('/admin', express.static(ADMIN_DIST));
  // SPA fallback: any /admin/* route that isn't a static file (e.g.
  // /admin/products, a refresh on /admin/orders) should still return the
  // admin app's index.html so React Router can take over client-side.
  app.get('/admin/*splat', (req, res) => {
    res.sendFile(path.join(ADMIN_DIST, 'index.html'));
  });
}

// --- Storefront: everything else ---
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  // SPA fallback for the storefront's own client-side routes
  // (e.g. /products, /cart, a page refresh on /checkout).
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
} else {
  // Fallback while you haven't built the frontend yet, so the API is
  // still reachable and you can confirm the server itself is running.
  app.get('/', (req, res) => {
    res.json({ message: 'Server running' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5000",
  "https://jelectronics.store",
  "https://www.jelectronics.store",
];
