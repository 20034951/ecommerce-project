import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import db from "./models/index.js";
import { initRedis } from "./utils/redisClient.js";

dotenv.config();

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/", (req, res) => res.json({ message: "Backend running" }));

const startServer = async () => {
  try {
    // Redis (idealmente con fail-open adentro de initRedis)
    await initRedis();

    // Import dinámico de rutas
    const categoryRoutes = (await import("./routes/category.js")).default;
    const productRoutes = (await import("./routes/product.js")).default;
    const roleRoutes = (await import("./routes/role.js")).default;
    const userRoutes = (await import("./routes/user.js")).default;
    const authRoutes = (await import("./routes/register.js")).default;

    // Montar rutas
    app.use("/api", authRoutes); // /api/register, etc.
    app.use("/api/categories", categoryRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/roles", roleRoutes);
    app.use("/api/users", userRoutes); // <-- NECESARIA para /api/users

    // Sincronizar BD (esperar a que termine)
    await db.sequelize.sync({ alter: true });

    // Error handler al final
    app.use(errorHandler);

    const port = process.env.PORT || 5005;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (err) {
    console.error("Error during initialization:", err);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
