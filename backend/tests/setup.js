import dotenv from 'dotenv';
dotenv.config({ path: '../.env.test'})
import { initRedis, getRedisClient } from '../src/utils/redisClient.js';
import db from '../src/models/index.js';

beforeAll(async () => {
    try{
        await db.sequelize.sync({ force: true }); // creates clean tables
        await initRedis();
    }catch(err){
        console.error('Error during DB setup: ', err);
        throw err;
    }
    
}, 20000);

afterAll(async () => {
    try{
        await new Promise(resolve => setTimeout(resolve, 500));
        await db.sequelize.close();
        const client = getRedisClient();
        if(client && typeof client.disconnect === 'function'){
            await client.disconnect();
        }
    }catch(err){
        console.error('Error closing DB connection: ', err);
    }
});