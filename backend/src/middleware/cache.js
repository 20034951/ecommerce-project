import { getRedisClient } from "../utils/redisClient.js";

/**
 * 
 * @param {string|function} cacheKeyPrefix - Key or Prefix of cache
 * @param {number} ttlSeconds - Cache time to live (in seconds)
 * @returns 
 */
export const cacheMiddleware = (cacheKeyOrFunction, ttlSeconds = 60) => {
    return async (req, res, next) => {
        try {
            const redisClient = getRedisClient();
            const cacheKey = typeof cacheKeyOrFunction === 'function' ? cacheKeyOrFunction(req) : cacheKeyOrFunction;
            const cached = await redisClient.get(cacheKey);

            if(cached){
                console.log(`Cache hit: ${cacheKey}`);
                return res.status(200).json(JSON.parse(cached));
            }

            //Getting real response
            const originalJson = res.json.bind(res);
            
            res.json = async(data) => {
                try{
                    await redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(data));
                    console.log(`Cache set: ${cacheKey}`);
                } catch (err) {
                    console.log('Error setting cache: ', err);
                }
                return originalJson(data);
            };

            next();
        } catch (err) {
            console.error('Redis cache middleware error: ', err);
            next();
        }
    };
};

/**
 * 
 * @param {string[]} keys - Key list to remove
 */
export const invalidateCache = async (keys = []) => {
    try {
        const redisClient = getRedisClient();
        if(keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cache invalidated for keys: ${keys.join(', ')}`);
        }
    } catch (err) {
        console.error('Error invalidating cache: ', err);
    }
}