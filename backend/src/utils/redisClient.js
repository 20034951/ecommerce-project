import { createClient } from 'redis';

let redisClient;

export const initRedis = async () => {

    if(process.env.NODE_ENV === 'test'){
        console.log("[Redis Mock] using in-memory mock client for tests");
        redisClient = {
            get: async () => null,
            setEx: async () => {},
            del: async () => {},
            connect: async () => {},
            disconnect: async () => {}
        };
        return redisClient;
    }

    if(!redisClient){
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://redis:6379'
        });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        await redisClient.connect();
        redisClient.on('connect', () => console.log('Connected to Redis Client'));
    }
    return redisClient;
};


export const getRedisClient = () => {
    if(!redisClient) {
        throw new Error('Redis client not initialized. Call initRedis() first.');
    }
    return redisClient;
} 