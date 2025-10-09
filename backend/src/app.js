import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler.js';
import db from './models/index.js';
import { initRedis } from './utils/redisClient.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import roleRoutes from './routes/role.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());

/*
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
        db.sequelize.sync( { alter: true } ); //warning: 'alter' updates tables, 'force' deletes and recreates
        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Backend running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Error during initialization: ', err);
    }
};

if(process.env.NODE_ENV !== 'test'){
    startServer();
}

export default app;