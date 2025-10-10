import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import db from "./models/index.js";
import { initRedis } from "./utils/redisClient.js";

// Import routes dynamically
import authRoutes from "./routes/register.js";

dotenv.config();

const app = express();

// Enable CORS globally for all routes
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

const startServer = async () => {
  try {
    // Initialize Redis connection
    await initRedis();

    // Dynamically import routes for categories, products, roles, and users
    const categoryRoutes = (await import("./routes/category.js")).default;
    const productRoutes = (await import("./routes/product.js")).default;
    const roleRoutes = (await import("./routes/role.js")).default;
    const userRoutes = (await import("./routes/user.js")).default;

    // Use routes
    app.use("/api", authRoutes);
    app.use("/api/categories", categoryRoutes); // Now this should work
    app.use("/api/products", productRoutes);
    app.use("/api/roles", roleRoutes);
    app.use("/api/users", userRoutes);

    // Synchronize DB (Alter tables if needed)
    await db.sequelize.sync({ alter: true });

    // Start the backend server
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error during initialization: ", err);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
