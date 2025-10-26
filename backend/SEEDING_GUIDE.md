# 🌱 Guía de Seeding - E-commerce Project

## 📋 Resumen

Este proyecto utiliza un sistema de **seeding idempotente** que permite ejecutar los seeders múltiples veces sin duplicar datos. Los datos se pueden controlar mediante parámetros personalizables.

## 🎯 Características Principales

- ✅ **Idempotente**: Ejecuta los seeders cuantas veces quieras sin duplicados
- ✅ **Configurable**: Controla cuántos registros crear en cada ejecución
- ✅ **Rate Limiting**: Delay automático de 3-5 segundos entre requests a Pexels API
- ✅ **Datos reales**: Imágenes de productos desde Pexels API
- ✅ **Tropicalizado**: Datos específicos para Guatemala

## 🚀 Métodos de Ejecución

### 1. Via Línea de Comandos

```bash
# Usar valores por defecto (50 usuarios, 10 productos/categoría, 5 órdenes/usuario)
npm run seed

# Especificar cantidades personalizadas
npm run seed 100 20 10
# Esto crea: 100 usuarios, 20 productos por categoría, 10 órdenes por usuario
```

**Parámetros:**
- `[usuarios]`: Número de usuarios clientes a crear (default: 50)
- `[productos/categoría]`: Productos por cada categoría (default: 10)
- `[órdenes/usuario]`: Órdenes por cada cliente (default: 5)

### 2. Via API REST

#### Seed Completo con Parámetros

```bash
POST http://localhost:5005/api/seed/all
Content-Type: application/json

{
  "usersCount": 100,
  "productsPerCategory": 20,
  "ordersPerUser": 10
}
```

#### Seed Individual de Usuarios

```bash
POST http://localhost:5005/api/seed/users
Content-Type: application/json

{
  "count": 50
}
```

#### Verificar Estado de la Base de Datos

```bash
GET http://localhost:5005/api/seed/status
```

Respuesta:
```json
{
  "success": true,
  "message": "📊 Estado actual de la base de datos",
  "data": {
    "users": 503,
    "categories": 20,
    "products": 200,
    "orders": 2515,
    "orderItems": 13825,
    "orderStatusHistory": 12575,
    "shippingMethods": 5,
    "carts": 0,
    "addresses": 1006
  }
}
```

## 📊 Datos Generados

### Usuarios
- **3 usuarios fijos** (no se duplican):
  - Admin: `admin@ecommerce.com` / `admin123`
  - Editor: `editor@ecommerce.com` / `editor123`
  - Cliente: `cliente@ecommerce.com` / `cliente123`
- **N usuarios aleatorios** según parámetro `usersCount`
- Cada usuario tiene 1-3 direcciones en Guatemala

### Categorías
- **20 categorías fijas** incluyendo:
  - Electrónica
  - Ropa y Calzado
  - Hogar y Muebles
  - Deportes y Aire Libre
  - Libros y Medios
  - Juguetes y Videojuegos
  - Belleza y Salud
  - Alimentos y Bebidas
  - **Artesanías Guatemaltecas** (específica de Guatemala)
  - Y más...

### Productos
- **N productos por categoría** según `productsPerCategory`
- Imágenes reales desde Pexels API
- Precios y stock según tipo de categoría
- SKU único generado automáticamente

### Órdenes
- **N órdenes por usuario** según `ordersPerUser`
- 1-10 productos aleatorios por orden
- Distribución realista de estados:
  - 40% Entregados
  - 25% Enviados
  - 15% En proceso
  - 10% Pagados
  - 5% Pendientes
  - 5% Cancelados
- Tracking numbers con transportistas guatemaltecos (FORZA, CARGO, GUATEX, KINGO, UBER)

## ⚠️ Rate Limiting de Pexels API

### Límites de la API
- **200 requests por hora** (límite gratuito de Pexels)
- **25,000 requests por mes**

### Protección Implementada
- ✅ **Delay automático**: 3-5 segundos entre cada request
- ✅ **Contador de requests**: Registra cuántas llamadas se han hecho
- ✅ **Fallback**: Si falla Pexels, usa `faker.image.url()`

### Cálculo de Tiempo

Si creas productos con imágenes de Pexels:
- 10 productos = ~40-50 segundos (10 × 4 segundos promedio)
- 100 productos = ~6-8 minutos
- 200 productos (20 categorías × 10) = ~13-16 minutos

**Recomendación**: Para seeders grandes, usa `productsPerCategory` bajo (5-10) para no exceder el límite.

## 🔄 Ejecución Múltiple

Puedes ejecutar el seeder **tantas veces como quieras**:

```bash
# Primera ejecución: crea 50 usuarios, 10 productos/categoría, 5 órdenes/usuario
npm run seed 50 10 5

# Segunda ejecución: crea OTROS 50 usuarios, 10 productos más por categoría, etc.
npm run seed 50 10 5

# Tercera ejecución con otros números
npm run seed 100 5 3
```

Los datos **NO se duplican** porque:
- Los emails de usuarios son únicos
- Los nombres de productos se verifican antes de crear
- Las categorías y métodos de envío son fijos

## 📈 Ejemplos de Uso

### Desarrollo Local (Pocos datos)
```bash
npm run seed 20 5 3
# 20 usuarios, 5 productos/categoría, 3 órdenes/usuario
# ~100 productos, ~60 órdenes
# Tiempo: ~8-10 minutos
```

### Testing (Datos Medianos)
```bash
npm run seed 100 10 5
# 100 usuarios, 10 productos/categoría, 5 órdenes/usuario
# ~200 productos, ~500 órdenes
# Tiempo: ~15-20 minutos
```

### Staging/Demo (Muchos datos)
```bash
npm run seed 500 20 10
# 500 usuarios, 20 productos/categoría, 10 órdenes/usuario
# ~400 productos, ~5000 órdenes
# Tiempo: ~30-40 minutos
```

## 🛠️ Troubleshooting

### Error: "Too Many Requests" de Pexels
- **Causa**: Excediste los 200 requests/hora
- **Solución**: Espera 1 hora o reduce `productsPerCategory`

### Productos sin imágenes
- **Causa**: Error en Pexels API
- **Solución**: Automáticamente usa `faker.image.url()` como fallback

### Seeder muy lento
- **Causa**: Delay de 3-5 segundos por producto
- **Solución**: Normal, es para evitar rate limit. Reduce `productsPerCategory`

### Emails duplicados
- **Causa**: Intentando crear más usuarios de los que Faker puede generar únicamente
- **Solución**: El seeder tiene protección, pero limita a ~1000-2000 usuarios por ejecución

## 📝 Logs y Monitoreo

El seeder muestra progreso en tiempo real:

```
🌱 Iniciando proceso de seeding IDEMPOTENTE...
📊 Parámetros: 50 usuarios, 10 productos/categoría, 5 órdenes/usuario

👥 Seeding usuarios...
   ✨ Usuario Admin creado
   ✨ 47 nuevos clientes creados (65 intentos)
✅ Proceso completado (50 usuarios totales)

📦 Seeding productos...
   🎨 Iniciando seeding de 10 productos por categoría con imágenes de Pexels...
   ⏱️  Nota: Hay un delay de 3-5 segundos entre cada consulta a Pexels API
   
   📦 Procesando categoría: Electrónica
      ✅ 10 productos creados hasta ahora...
   ✨ Completado Electrónica: 10 productos nuevos
```

## 🎯 Recomendaciones

1. **Primera vez**: Usa valores pequeños para probar (10, 5, 3)
2. **Producción/Demo**: Ejecuta durante la noche con valores grandes
3. **Development**: Mantén valores bajos para velocidad
4. **Rate Limit**: Nunca excedas 200 productos en una hora
5. **Multiple Runs**: Espera completar una ejecución antes de iniciar otra

---

**Nota**: Este sistema fue diseñado para ser flexible y seguro. Los delays son intencionales para respetar los límites de APIs externas.
