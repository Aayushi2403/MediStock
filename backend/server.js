const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const medicineRoutes = require("./routes/medicineRoutes");
const saleRoutes = require("./routes/saleRoutes");
const restockRoutes = require("./routes/restockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/medicines", medicineRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/restocks", restockRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});