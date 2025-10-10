import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import db from './models/index.js';
import { initRedis } from './utils/redisClient.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Backend running' });
});
*/

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Error middleware (always at the end)
app.use(errorHandler);

const startServer = async () => {
    try {
        await initRedis();

        const categoryRoutes = (await import('./routes/category.js')).default;
        const productRoutes = (await import('./routes/product.js')).default;

        app.use('/api/categories', categoryRoutes);
        app.use('/api/products', productRoutes);

        db.sequelize.sync( { alter: true } ); //warning: 'alter' updates tables, 'force' deletes and recreates

        // Error middleware (always at the end)
        app.use(errorHandler);

        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Backend running on port ${process.env.PORT}`);
        });

    } catch (err) {
        console.error('Error during initialization: ', err);
    }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
