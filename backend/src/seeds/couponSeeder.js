/**
 * Seeder de cupones (IDEMPOTENTE)
 * Crea cupones de descuento de muestra
 * Los cupones se crean solo si no existen (por código único)
 */

import db from "../models/index.js";

const { Coupon } = db;

export const seedCoupons = async () => {
    console.log("   💳 Creando cupones de descuento...");

    const coupons = [
        // Descuentos por porcentaje
        {
            code: "BIENVENIDA10",
            discount: 10.0,
            type: "percent",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 1000,
            used_count: 0,
            status: "active",
            description: "10% de descuento para nuevos clientes",
        },
        {
            code: "VERANO15",
            discount: 15.0,
            type: "percent",
            valid_from: "2024-06-01",
            valid_until: "2025-08-31",
            usage_limit: 500,
            used_count: 0,
            status: "active",
            description: "15% de descuento en temporada de verano",
        },
        {
            code: "BLACKFRIDAY20",
            discount: 20.0,
            type: "percent",
            valid_from: "2024-11-01",
            valid_until: "2025-11-30",
            usage_limit: 2000,
            used_count: 0,
            status: "active",
            description: "20% de descuento especial Black Friday",
        },
        {
            code: "NAVIDAD25",
            discount: 25.0,
            type: "percent",
            valid_from: "2024-12-01",
            valid_until: "2025-12-31",
            usage_limit: 1500,
            used_count: 0,
            status: "active",
            description: "25% de descuento especial de Navidad",
        },

        // Descuentos de monto fijo
        {
            code: "AHORRA50",
            discount: 50.0,
            type: "fixed",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 500,
            used_count: 0,
            status: "active",
            description: "Q50 de descuento en tu compra",
        },
        {
            code: "DESCUENTO100",
            discount: 100.0,
            type: "fixed",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 300,
            used_count: 0,
            status: "active",
            description: "Q100 de descuento en compras mayores a Q500",
        },
        {
            code: "PRIMERACOMPRA",
            discount: 75.0,
            type: "fixed",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 1000,
            used_count: 0,
            status: "active",
            description: "Q75 de descuento en tu primera compra",
        },

        // Cupones especiales
        {
            code: "VIP30",
            discount: 30.0,
            type: "percent",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 100,
            used_count: 0,
            status: "active",
            description: "30% de descuento exclusivo para clientes VIP",
        },
        {
            code: "ENVIOGRATIS",
            discount: 35.0,
            type: "fixed",
            valid_from: "2024-01-01",
            valid_until: "2025-12-31",
            usage_limit: 2000,
            used_count: 0,
            status: "active",
            description: "Cubre el costo promedio de envío",
        },

        // Cupón inactivo (para pruebas)
        {
            code: "EXPIRADO",
            discount: 50.0,
            type: "percent",
            valid_from: "2023-01-01",
            valid_until: "2023-12-31",
            usage_limit: 100,
            used_count: 100,
            status: "expired",
            description: "Cupón expirado (para pruebas)",
        },
    ];

    const createdCoupons = [];

    for (const couponData of coupons) {
        const [coupon, created] = await Coupon.findOrCreate({
            where: { code: couponData.code },
            defaults: couponData,
        });

        if (created) {
            console.log(
                `      ✅ Cupón creado: ${couponData.code} (${couponData.type === "percent" ? couponData.discount + "%" : "Q" + couponData.discount})`
            );
        } else {
            console.log(`      ⏭️  Cupón existente: ${couponData.code}`);
        }

        createdCoupons.push(coupon);
    }

    // Obtener todos los cupones activos
    const activeCoupons = await Coupon.findAll({
        where: { status: "active" },
    });

    console.log(
        `   ✅ Total de cupones activos disponibles: ${activeCoupons.length}`
    );

    return createdCoupons;
};

export default seedCoupons;
