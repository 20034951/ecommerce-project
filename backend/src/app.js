import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import tokenCleanup from "./middleware/tokenCleanup.js";
import db from "./models/index.js";
import { initRedis } from "./utils/redisClient.js";
import seedDatabase from "./seedDatabase.js";
import orderRoutes from "./routes/order.js";

dotenv.config();

const app = express();

// Configuración CORS para permitir frontend
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares base
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para limpiar tokens expirados
app.use(tokenCleanup.cleanup);

// Middleware para obtener IP real
app.use((req, res, next) => {
  req.clientIP =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    req.ip;
  next();
});

// Healthcheck
app.get("/", (req, res) =>
  res.json({
    message: "Backend running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
);

const startServer = async () => {
  try {
    console.log("🚀 Iniciando servidor...");

    // Redis (opcional)
    try {
      console.log("🔄 Inicializando Redis...");
      await initRedis();
      console.log("✅ Redis inicializado correctamente");
    } catch (redisError) {
      console.log("⚠️ Redis no disponible, continuando sin cache");
    }

    // Import dinámico de rutas
    const categoryRoutes = (await import("./routes/category.js")).default;
    const productRoutes = (await import("./routes/product.js")).default;
    const userRoutes = (await import("./routes/user.js")).default;
    const customerRoutes = (await import("./routes/customer.js")).default;
    const authRoutes = (await import("./routes/register.js")).default;
    const passwordResetRoutes = (await import("./routes/passwordReset.js"))
      .default;
    const orderRoutes = (await import("./routes/order.js")).default;
    const seedRoutes = (await import("./routes/seed.js")).default;

    // Montar rutas
    app.use("/api/auth", authRoutes);
    app.use("/api/auth", passwordResetRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/orders", orderRoutes);

    // Ruta para poblar la base de datos (solo desarrollo)
    if (process.env.NODE_ENV === "development") {
      app.post("/api/seed", async (req, res) => {
        try {
          await seedDatabase();
          res.json({ message: "Base de datos poblada exitosamente" });
        } catch (error) {
          console.error("Error al poblar BD:", error);
          res.status(500).json({ error: "Error al poblar la base de datos" });
        }
      });
    }

    // Sincronizar BD
    console.log("🔄 Sincronizando base de datos...");
    await db.sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada");

    // Error handler al final
    app.use(errorHandler);

    const port = process.env.PORT || 5005;
    app.listen(port, "0.0.0.0", () => {
      console.log(`🌐 Backend ejecutándose en puerto ${port}`);
      console.log(`📍 Acceso local: http://localhost:${port}`);
      console.log(
        `📡 Variables de entorno cargadas: ${process.env.NODE_ENV || "desarrollo"}`
      );

      // Iniciar limpieza automática de tokens
      tokenCleanup.startAutomaticCleanup();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n💡 Rutas de seeding disponibles:');
        console.log(`   POST http://localhost:${port}/api/seed/all - Ejecutar todos los seeders`);
        console.log(`   POST http://localhost:${port}/api/seed/users - Solo usuarios`);
        console.log(`   POST http://localhost:${port}/api/seed/orders - Solo pedidos`);
        console.log(`   POST http://localhost:${port}/api/seed/legacy - Seeder antiguo`);
        console.log(`   GET  http://localhost:${port}/api/seed/status - Estado de la BD`);
      }
    });
  } catch (err) {
    console.error("❌ Error durante la inicialización:", err);
    process.exit(1);
  }
};

startServer();

export default app;
