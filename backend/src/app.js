import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import db from './models/index.js';
import { initRedis } from './utils/redisClient.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import roleRoutes from './routes/role.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error middleware (always at the end)
app.use(errorHandler);

const startServer = async () => {
    try {
        await initRedis();
        //db.sequelize.sync( { force: true } ); // alter: true warning: 'alter' updates tables, 'force' deletes and recreates
        db.syncDatabase(process.env.NODE_ENV !== 'production')
        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Backend running on port ${process.env.PORT}`);

            process.on('unhandledRejection', (err) => {
                console.error('[UNHANDLED REJECTION]', err && (err.stack || err));
            });
            process.on('uncaughtException', (err) => {
                console.error('[UNCAUGHT EXCEPTION]', err && (err.stack || err));
            });
        });
    } catch (err) {
        console.error('Error during initialization: ', err);
    }
};

if(process.env.NODE_ENV !== 'test'){
    startServer();
}

export default app;