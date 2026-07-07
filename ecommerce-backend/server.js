const express = require('express');
const cors = require('cors');
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

const app = express();

app.use(express.json());

// server.js
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
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

app.get('/', (req, res) => {
  res.json({ message: 'Server running' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});