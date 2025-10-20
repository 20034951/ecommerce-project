// backend/src/utils/orderCode.js
import { randomUUID } from 'crypto';

// Formato: ORD-YYYYMMDD-XXXX (XXXX de UUID)
export function generateOrderCode() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const short = randomUUID().split('-')[0].toUpperCase(); // primeras 8 (o usa slice(0,4))
    return `ORD-${y}${m}${day}-${short.slice(0, 4)}`;
}
