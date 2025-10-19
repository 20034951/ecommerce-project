# 🌱 Seeders - Base de Datos de Prueba

Este directorio contiene los seeders para poblar la base de datos con datos de prueba usando **Faker.js**.

## 📋 Contenido

### Seeders Disponibles

1. **userSeeder.js** - Crea usuarios de prueba
   - 1 Administrador
   - 10 Clientes con datos realistas
   - 1 Usuario de prueba con credenciales fáciles
   - Direcciones para cada usuario (1-3 por cliente)

2. **categorySeeder.js** - Crea categorías de productos
   - 8 categorías principales (Electrónica, Ropa, Hogar, etc.)

3. **productSeeder.js** - Crea productos en todas las categorías
   - 50+ productos con datos realistas
   - Precios y stock variables
   - SKUs únicos generados

4. **shippingMethodSeeder.js** - Crea métodos de envío
   - Estándar (5-7 días)
   - Express (2-3 días)
   - Premium (1 día)
   - Gratis (10 días)

5. **orderSeeder.js** - Crea pedidos con todos los estados ✨
   - 3-8 pedidos por cliente
   - Todos los estados: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`
   - Números de tracking realistas
   - URLs de tracking funcionales
   - Historial completo de estados
   - Fechas coherentes entre estados

## 🚀 Uso

### Ejecutar todos los seeders

```bash
# En desarrollo (con variables de entorno del .env)
npm run seed:dev

# En producción
npm run seed
```

### Orden de ejecución

Los seeders se ejecutan automáticamente en este orden:

1. Usuarios y direcciones
2. Categorías
3. Productos
4. Métodos de envío
5. Pedidos (con items e historial)

## 👤 Credenciales de Acceso

Después de ejecutar los seeders, puedes usar estas credenciales:

### Administrador
- **Email:** `admin@ecommerce.com`
- **Password:** `Admin123!`

### Cliente de Prueba
- **Email:** `test@ecommerce.com`
- **Password:** `Customer123!`

### Otros Clientes
- Los 10 clientes adicionales tienen:
- **Password:** `Customer123!`
- **Emails:** Generados por Faker (ver logs del seeder)

## 📊 Datos Generados

### Usuarios
- **Total:** 12 usuarios
- **Admins:** 1
- **Clientes:** 11
- **Direcciones:** 1-3 por usuario

### Productos
- **Total:** ~50 productos
- **Categorías:** 8
- **Stock:** Variable (5-250 unidades)
- **Precios:** Realistas según categoría

### Pedidos
- **Por cliente:** 3-8 pedidos
- **Total aproximado:** 40-100 pedidos
- **Estados:** Distribuidos entre todos los estados posibles
- **Historial:** Cada pedido tiene su timeline completo

### Características de los Pedidos

#### Estados y Datos Asociados

1. **Pending** (Pendiente)
   - Solo estado inicial
   - Sin tracking

2. **Paid** (Pagado)
   - Confirmación de pago
   - Sin tracking aún

3. **Processing** (En Proceso)
   - Pedido en preparación
   - Sin tracking aún

4. **Shipped** (Enviado)
   - ✅ Número de tracking
   - ✅ URL de tracking
   - ✅ Fecha de envío
   - ✅ Fecha estimada de entrega

5. **Delivered** (Entregado)
   - ✅ Número de tracking
   - ✅ URL de tracking
   - ✅ Fecha de envío
   - ✅ Fecha de entrega

6. **Cancelled** (Cancelado)
   - ✅ Razón de cancelación
   - ✅ Fecha de cancelación

#### Tracking Numbers
- Formato: `{CARRIER}{12-DIGIT-NUMBER}`
- Carriers: UPS, FedEx (FDX), DHL, USPS
- Ejemplo: `UPS123456789012`

#### URLs de Tracking
- URLs reales de carriers:
  - UPS: `https://www.ups.com/track?tracknum=...`
  - FedEx: `https://www.fedex.com/fedextrack/?tracknumbers=...`
  - DHL: `https://www.dhl.com/track?trackingNumber=...`
  - USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=...`

## 🔄 Historial de Estados

Cada pedido tiene un historial completo según su estado final:

- **Pending:** 1 entrada
- **Paid:** 2 entradas (pending → paid)
- **Processing:** 3 entradas (pending → paid → processing)
- **Shipped:** 4 entradas (pending → paid → processing → shipped)
- **Delivered:** 5 entradas (pending → paid → processing → shipped → delivered)
- **Cancelled:** 2 entradas (pending → cancelled)

Cada entrada incluye:
- Estado
- Notas descriptivas
- Usuario que realizó el cambio (admin o sistema)
- Timestamp

## ⚠️ Notas Importantes

1. **No elimina datos existentes** - Los seeders agregan datos sin borrar los existentes
2. **Productos únicos** - Cada ejecución genera nuevos productos con SKUs únicos
3. **Fechas realistas** - Los pedidos se distribuyen en los últimos 90 días
4. **Coherencia temporal** - Las fechas de estados siguen una secuencia lógica

## 🛠️ Dependencias

- `@faker-js/faker` - Generación de datos falsos realistas
- `bcrypt` - Encriptación de contraseñas
- `sequelize` - ORM para la base de datos

## 📝 Ejemplo de Output

```
🌱 Iniciando proceso de seeding...

📊 Verificando conexión a la base de datos...
✅ Conexión establecida correctamente

👥 Seeding usuarios...
   📧 Credenciales de acceso:
   Admin: admin@ecommerce.com / Admin123!
   Cliente: test@ecommerce.com / Customer123!
✅ 12 usuarios creados

📁 Seeding categorías...
✅ 8 categorías creadas

📦 Seeding productos...
✅ 52 productos creados

🚚 Seeding métodos de envío...
✅ 4 métodos de envío creados

🛒 Seeding pedidos...
   Creando pedidos para 11 clientes...
✅ 67 pedidos creados

🎉 ¡Seeding completado exitosamente!

📊 Resumen:
   - Usuarios: 12
   - Categorías: 8
   - Productos: 52
   - Métodos de envío: 4
   - Pedidos: 67
```

## 🔍 Verificación

Después de ejecutar los seeders, puedes verificar:

1. **Usuarios creados:**
   ```sql
   SELECT user_id, name, email, role FROM user;
   ```

2. **Pedidos por estado:**
   ```sql
   SELECT status, COUNT(*) as total FROM orders GROUP BY status;
   ```

3. **Pedidos con tracking:**
   ```sql
   SELECT order_id, status, tracking_number, tracking_url 
   FROM orders 
   WHERE tracking_number IS NOT NULL;
   ```

4. **Historial de pedidos:**
   ```sql
   SELECT o.order_id, o.status, osh.status, osh.notes, osh.created_at
   FROM orders o
   JOIN order_status_history osh ON o.order_id = osh.order_id
   ORDER BY o.order_id, osh.created_at;
   ```

## 🎯 Casos de Uso

Estos seeders son perfectos para:

- ✅ Desarrollo y pruebas locales
- ✅ Demos del sistema de tracking
- ✅ Pruebas de UI con datos realistas
- ✅ Testing de filtros y búsquedas
- ✅ Verificación de flujos de estados
- ✅ Pruebas de permisos (admin vs cliente)
