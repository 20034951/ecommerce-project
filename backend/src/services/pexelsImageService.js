import https from "https";
import dotenv from "dotenv";
dotenv.config();

export default class PexelsService {
    constructor() {
        this.apiKey = process.env.PEXELS_API_KEY_TEST;
        this.baseUrl = "https://api.pexels.com/v1";
        this.requestCount = 0;
        this.maxRequestsPerHour = 200; // Límite de Pexels API
        this.rateLimitExceeded = false; // Flag para detectar rate limit
    }

    /**
     * Sleep aleatorio entre 3 y 5 segundos para evitar rate limit
     */
    async sleep() {
        const seconds = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    /**
     * Realiza una solicitud GET a la API de Pexels con rate limiting
     * @param {string} path - Ruta del endpoint
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise<Object>} - Respuesta de la API
     */
    async request(path, params = {}) {
        // Si ya se detectó rate limit, no hacer más requests
        if (this.rateLimitExceeded) {
            throw new Error('RATE_LIMIT_EXCEEDED');
        }

        // Sleep aleatorio entre 3-5 segundos antes de cada request
        await this.sleep();

        this.requestCount++;
        return new Promise((resolve, reject) => {
            // Construir query string
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseUrl}${path}${queryString ? '?' + queryString : ''}`;

            const options = {
                headers: {
                    'Authorization': this.apiKey
                }
            };

            https.get(url, options, (res) => {
                let data = '';

                // Acumular chunks de datos
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // Procesar respuesta completa
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (error) {
                            reject(new Error(`Error al parsear respuesta: ${error.message}`));
                        }
                    } else if (res.statusCode === 429 || res.statusCode === 401) {
                        // Detectar "Too Many Requests"
                        this.rateLimitExceeded = true;
                        reject(new Error('RATE_LIMIT_EXCEEDED'));
                    } else {
                        reject(new Error(`Error HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            }).on('error', (error) => {
                reject(new Error(`Error en la solicitud: ${error.message}`));
            });
        });
    }

    /**
     * Realiza una búsqueda de fotos en Pexels.
     * @param {Object} params - Parámetros del query
     * @param {string} params.query - Término de búsqueda (requerido)
     * @param {string} [params.orientation] - landscape | portrait | square
     * @param {string} [params.size] - large | medium | small
     * @param {string} [params.color] - red | blue | #ffffff | etc.
     * @param {string} [params.locale] - en-US | es-ES | etc.
     * @param {number} [params.page=1]
     * @param {number} [params.per_page=15]
     */
    async searchPhotos(params) {
        if (!params.query) throw new Error("El parámetro 'query' es requerido");
        try {
            const response = await this.request("/search", params);
            return response.photos;
        } catch (error) {
            // Re-lanzar el error para que pueda ser manejado por el seeder
            throw error;
        }
    }

    /**
     * Verifica si se ha alcanzado el límite de rate
     * @returns {boolean}
     */
    isRateLimitExceeded() {
        return this.rateLimitExceeded;
    }

    /**
     * Resetea el flag de rate limit (útil para testing o nuevas sesiones)
     */
    resetRateLimit() {
        this.rateLimitExceeded = false;
        this.requestCount = 0;
    }
}
