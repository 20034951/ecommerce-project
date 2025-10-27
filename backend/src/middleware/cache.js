import { getRedisClient } from "../utils/redisClient.js";

/**
 * 
 * @param {string|function} cacheKeyPrefix - Key or Prefix of cache
 * @param {number|object} ttlSeconds - Cache time to live (in seconds) or object with {admin, store}
 * @returns 
 */
export const cacheMiddleware = (cacheKeyOrFunction, ttlSeconds = 60) => {
    return async (req, res, next) => {

        let redisClient;

        try {
            redisClient = getRedisClient();
        } catch (err) {
            console.warn('Redis Client not initialized - proceeding without cache');
            return next();
        }

        try {
            const cacheKey = typeof cacheKeyOrFunction === 'function' ? cacheKeyOrFunction(req) : cacheKeyOrFunction;

            // Determinar TTL según el rol del usuario
            let effectiveTTL = ttlSeconds;

            // Si ttlSeconds es un objeto con configuración admin/store
            if (typeof ttlSeconds === 'object' && ttlSeconds !== null) {
                const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'editor');
                effectiveTTL = isAdmin ? (ttlSeconds.admin || 5) : (ttlSeconds.store || 30);
            } else if (typeof ttlSeconds === 'number') {
                // Si es un número simple, verificar si es admin para ajustar
                const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'editor');
                effectiveTTL = isAdmin ? 5 : ttlSeconds;
            }

            const cached = await redisClient.get(cacheKey);

            if (cached) {
                console.log(`Cache hit: ${cacheKey} (TTL: ${effectiveTTL}s, Role: ${req.user?.role || 'guest'})`);
                return res.status(200).json(JSON.parse(cached));
            }

            //Getting real response
            const originalJson = res.json.bind(res);

            res.json = async (data) => {
                try {
                    await redisClient.setEx(cacheKey, effectiveTTL, JSON.stringify(data));
                    console.log(`Cache set: ${cacheKey} (TTL: ${effectiveTTL}s, Role: ${req.user?.role || 'guest'})`);
                } catch (err) {
                    console.error('Error setting cache: ', err.message);
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
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cache invalidated for keys: ${keys.join(', ')}`);
        }
    } catch (err) {
        console.error('Error invalidating cache: ', err);
    }
}

/**
 * 
 * @param {string} prefix - Key prefix to remove
 */
export async function invalidateCacheByPrefix(prefix) {
    try {
        const redisClient = getRedisClient();
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cache invalidated for keys: ${keys.join(', ')}`);
        }
    } catch (err) {
        console.error('Error invalidating cache: ', err);
    }
}