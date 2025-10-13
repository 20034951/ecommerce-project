import { createClient } from 'redis';

let redisClient;

export const initRedis = async () => {
    if(process.env.NODE_ENV === 'test'){
        console.log("⚡ [Redis Mock] usando cliente simulado para pruebas");
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
        try {
            // Configurar URL de Redis basada en el entorno
            const redisHost = process.env.REDIS_HOST || 'localhost';
            const redisPort = process.env.REDIS_PORT || '6379';
            const redisPassword = process.env.REDIS_PASSWORD || '';
            
            let redisUrl;
            if (redisPassword) {
                redisUrl = `redis://:${redisPassword}@${redisHost}:${redisPort}`;
            } else {
                redisUrl = `redis://${redisHost}:${redisPort}`;
            }

            redisClient = createClient({
                url: redisUrl,
                socket: {
                    connectTimeout: 5000,
                    lazyConnect: true
                }
            });
            
            redisClient.on('error', (err) => {
                console.log('⚠️ Redis error (continuando sin cache):', err.message);
            });

            redisClient.on('connect', () => console.log('✅ Conectado a Redis'));
            redisClient.on('ready', () => console.log('✅ Redis listo para usar'));

            // Intentar conectar con timeout
            const connectPromise = redisClient.connect();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout de conexión a Redis')), 3000)
            );

            await Promise.race([connectPromise, timeoutPromise]);
            
        } catch (error) {
            console.log('⚠️ No se pudo conectar a Redis, continuando sin cache:', error.message);
            
            // Crear un cliente mock para que la aplicación continue funcionando
            redisClient = {
                get: async () => null,
                setEx: async () => {},
                del: async () => {},
                connect: async () => {},
                disconnect: async () => {}
            };
        }
    }
    return redisClient;
};

export const getRedisClient = () => redisClient; 