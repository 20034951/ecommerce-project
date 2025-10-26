# Manejo de Rate Limit de Pexels API

## 📋 Descripción General

El sistema de seeding de productos utiliza la API de Pexels para obtener imágenes reales de alta calidad. Sin embargo, Pexels tiene un límite de 200 requests por hora. Para manejar esto de manera robusta, se implementó un sistema de fallback automático a Faker cuando se alcanza el límite.

## 🔄 Funcionamiento

### 1. Detección de Rate Limit

El servicio `PexelsImageService` ahora detecta automáticamente cuando se recibe un error `429 Too Many Requests`:

```javascript
if (res.statusCode === 429) {
    // Detectar "Too Many Requests"
    this.rateLimitExceeded = true;
    reject(new Error('RATE_LIMIT_EXCEEDED'));
}
```

### 2. Flag Persistente

Una vez detectado el rate limit, se establece un flag `rateLimitExceeded` que:
- Persiste durante toda la ejecución del seeder
- Evita hacer más requests innecesarios a Pexels
- Todos los productos subsecuentes usan Faker automáticamente

### 3. Cambio Automático a Faker

Cuando se detecta el rate limit:

```javascript
if (error.message === 'RATE_LIMIT_EXCEEDED') {
    console.log(`\n   ⚠️  RATE LIMIT ALCANZADO en Pexels API`);
    console.log(`   🔄 Cambiando a Faker para el resto de productos...`);
    useFaker = true;
    return faker.image.url();
}
```

## 📊 Flujo de Ejecución

```
Inicio del Seeding
    ↓
Resetear flags (useFaker = false, rateLimitExceeded = false)
    ↓
Por cada producto:
    ↓
¿useFaker está activo? ─YES→ Usar Faker
    ↓ NO
¿Pexels tiene rate limit? ─YES→ Usar Faker
    ↓ NO
Intentar request a Pexels
    ↓
┌─────────────┴─────────────┐
│ Success     │ Error 429    │ Otro Error
↓             ↓              ↓
Usar imagen   Activar flags  Usar Faker
de Pexels     useFaker=true  (este producto)
              ↓
              Todos los siguientes
              usan Faker
```

## 🎯 Ventajas del Sistema

### 1. **Continuidad del Seeding**
- El proceso nunca se detiene por rate limit
- Garantiza que todos los productos tengan imágenes

### 2. **Optimización de Requests**
- Una vez detectado el límite, no se hacen más requests
- Ahorra tiempo de espera (3-5 segundos por request)

### 3. **Transparencia**
- Mensajes claros en consola cuando ocurre el cambio
- Estadísticas finales muestran la fuente de imágenes

### 4. **Calidad Híbrida**
- Los primeros productos tienen imágenes reales de Pexels
- Los siguientes tienen imágenes de placeholder de Faker

## 📝 Mensajes de Consola

### Inicio Normal
```
🎨 Iniciando seeding de 10 productos por categoría con imágenes de Pexels...
⏱️  Nota: Hay un delay de 3-5 segundos entre cada consulta a Pexels API
🔄 Si se alcanza el límite de Pexels, se cambiará automáticamente a Faker
```

### Cuando se Alcanza el Límite
```
⚠️  RATE LIMIT ALCANZADO en Pexels API
🔄 Cambiando a Faker para el resto de productos...
```

### Resumen Final - Con Pexels
```
🎉 RESUMEN FINAL:
✨ 100 productos nuevos creados
♻️  50 productos ya existían
📊 Total de productos: 150
📸 Imágenes: 100% desde Pexels API
```

### Resumen Final - Con Fallback
```
🎉 RESUMEN FINAL:
✨ 100 productos nuevos creados
♻️  50 productos ya existían
📊 Total de productos: 150
📸 Imágenes: Pexels (hasta rate limit) + Faker
```

## 🛠️ Métodos Nuevos en PexelsService

### `isRateLimitExceeded()`
Verifica si se ha alcanzado el límite de rate.

```javascript
if (pexelsService.isRateLimitExceeded()) {
    return faker.image.url();
}
```

### `resetRateLimit()`
Resetea el flag de rate limit (útil para testing o nuevas sesiones).

```javascript
pexelsService.resetRateLimit();
```

## 🔧 Variables de Control

### En PexelsService
```javascript
this.rateLimitExceeded = false; // Flag interno del servicio
```

### En productSeeder
```javascript
let useFaker = false; // Flag a nivel de seeder
```

## 📈 Estimación de Productos

Con el límite de 200 requests/hora de Pexels:

- **Delay entre requests**: 3-5 segundos
- **Requests aproximados**: ~45-60 por sesión de seeding
- **Productos con Pexels**: ~45-60 primeros productos
- **Resto**: Automáticamente con Faker

## 🚀 Uso en Producción

### Recomendaciones

1. **Seeding Incremental**: Ejecutar en múltiples sesiones espaciadas
2. **Monitoreo**: Verificar logs para ver cuándo se activa el fallback
3. **Rate Limit Reset**: Pexels resetea cada hora, planificar consecuentemente

### Ejemplo de Uso Óptimo

```bash
# Primera sesión (usar límite completo de Pexels)
POST /api/seed/products
Body: { productsPerCategory: 5 }

# Esperar 1 hora

# Segunda sesión (límite reseteado)
POST /api/seed/products
Body: { productsPerCategory: 5 }
```

## 🔍 Testing

Para probar el fallback sin esperar el rate limit real:

```javascript
// En tests
pexelsService.rateLimitExceeded = true; // Simular rate limit
const image = await getProductImage('test', 'category');
expect(image).toContain('loremflickr'); // Imagen de Faker
```

## 📚 Referencias

- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [Rate Limits](https://www.pexels.com/api/documentation/#guidelines)
- [Faker.js Images](https://fakerjs.dev/api/image.html)

## 🎨 Calidad de Imágenes

### Pexels
- ✅ Imágenes reales de alta calidad
- ✅ Relevantes al producto/categoría
- ✅ Landscape optimizado para ecommerce
- ⚠️ Limitado a 200/hora

### Faker (Fallback)
- ✅ Siempre disponible
- ✅ Sin límites
- ⚠️ Imágenes genéricas/placeholders
- ⚠️ No específicas del producto

## 🔐 Variables de Entorno

Asegurarse de tener configurado:

```env
PEXELS_API_KEY_TEST=tu_api_key_aquí
```

---

**Última actualización**: Octubre 2025
