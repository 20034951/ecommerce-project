import passwordResetService from '../services/passwordResetService.js';

/**
 * Middleware para limpiar tokens expirados automáticamente
 * Se ejecuta cada cierto tiempo para mantener la base de datos limpia
 */
class TokenCleanupMiddleware {
    constructor() {
        this.lastCleanup = new Date();
        this.cleanupInterval = 60 * 60 * 1000; // 1 hora en milisegundos
    }

    /**
     * Middleware que limpia tokens expirados si ha pasado el tiempo suficiente
     */
    cleanup = async (req, res, next) => {
        try {
            const now = new Date();
            const timeSinceLastCleanup = now - this.lastCleanup;

            // Solo limpiar si ha pasado el intervalo especificado
            if (timeSinceLastCleanup >= this.cleanupInterval) {
                console.log('🧹 Limpiando tokens de recuperación expirados...');
                
                const deletedCount = await passwordResetService.cleanExpiredTokens();
                
                if (deletedCount > 0) {
                    console.log(`✅ Se eliminaron ${deletedCount} tokens expirados`);
                }
                
                this.lastCleanup = now;
            }
        } catch (error) {
            console.error('❌ Error al limpiar tokens expirados:', error);
            // No interrumpir la solicitud principal si falla la limpieza
        }
        
        next();
    };

    /**
     * Inicia la limpieza automática con setInterval
     */
    startAutomaticCleanup() {
        setInterval(async () => {
            try {
                console.log('🧹 Limpieza automática de tokens expirados...');
                const deletedCount = await passwordResetService.cleanExpiredTokens();
                
                if (deletedCount > 0) {
                    console.log(`✅ Limpieza automática: eliminados ${deletedCount} tokens expirados`);
                }
            } catch (error) {
                console.error('❌ Error en limpieza automática:', error);
            }
        }, this.cleanupInterval);

        console.log(`🔄 Limpieza automática de tokens iniciada (cada ${this.cleanupInterval / 60000} minutos)`);
    }
}

export default new TokenCleanupMiddleware();