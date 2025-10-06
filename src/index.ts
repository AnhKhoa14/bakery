import dotenv from "dotenv";
import express from "express";
// import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { seedRoles } from "./data/seedRole.js";
import { seedCategories } from "./data/seedCategory.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewsRoutes from "./routes/reviewRoutes.js";
import { seedOrderStatuses } from "./data/seedOrderStatus.js";
import { seedPaymentMethods } from "./data/seedPaymentMethod.js";
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewsRoutes)
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
// Connect to the database
connectDB()
  .then(async () => {
    // await seedRoles();
    // await seedCategories();
    // await seedOrderStatuses();
    // await seedPaymentMethods();
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
