import { createClient } from 'redis';

let redisClient;

export const initRedis = async () => {
    if(!redisClient){
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://redis:6379'
        });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        await redisClient.connect();
        console.log('Redis connected');
    }
    return redisClient;
};


export const getRedisClient = () => {
    if(!redisClient) {
        throw new Error('Redis client not initialized. Call initRedis() first.');
    }
    return redisClient;
} 