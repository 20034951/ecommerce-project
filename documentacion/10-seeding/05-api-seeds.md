# 🌱 API de Seeding - Postman Guide

Esta guía te muestra cómo ejecutar los seeders de la base de datos usando Postman.

## 📋 Rutas Disponibles

### 1. Ejecutar Todos los Seeders ⭐
```
POST http://localhost:5005/api/seed/all
```

**Descripción:** Ejecuta todos los seeders en el orden correcto (usuarios → categorías → productos → métodos de envío → pedidos)

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "🎉 Base de datos poblada exitosamente",
  "data": {
    "users": 12,
    "categories": 8,
    "products": 52,
    "shippingMethods": 4,
    "orders": 67
  }
}
```

---

### 2. Solo Usuarios
```
POST http://localhost:5005/api/seed/users
```

**Descripción:** Crea solo usuarios y sus direcciones

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "✅ 12 usuarios creados",
  "data": {
    "count": 12
  }
}
```

---

### 3. Solo Categorías
```
POST http://localhost:5005/api/seed/categories
```

**Descripción:** Crea solo las categorías de productos

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "✅ 8 categorías creadas",
  "data": {
    "count": 8
  }
}
```

---

### 4. Solo Productos
```
POST http://localhost:5005/api/seed/products
```

**Descripción:** Crea categorías y productos (requiere categorías)

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "✅ 52 productos creados",
  "data": {
    "count": 52
  }
}
```

---

### 5. Solo Pedidos
```
POST http://localhost:5005/api/seed/orders
```

**Descripción:** Crea pedidos con todos los estados (requiere usuarios, productos y métodos de envío existentes)

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "✅ 67 pedidos creados",
  "data": {
    "count": 67
  }
}
```

**Error si faltan datos:**
```json
{
  "success": false,
  "message": "❌ Faltan datos requeridos. Ejecuta primero /api/seed/all..."
}
```

---

### 6. Seeder Legacy (Antiguo)
```
POST http://localhost:5005/api/seed/legacy
```

**Descripción:** Ejecuta el seeder antiguo (seedDatabase.js) con datos básicos

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "✅ Legacy seeder ejecutado exitosamente"
}
```

---

### 7. Estado de la Base de Datos
```
GET http://localhost:5005/api/seed/status
```

**Descripción:** Obtiene estadísticas de los datos actuales en la base de datos

**Response Ejemplo:**
```json
{
  "success": true,
  "message": "📊 Estado actual de la base de datos",
  "data": {
    "users": 12,
    "categories": 8,
    "products": 52,
    "orders": 67,
    "orderItems": 189,
    "orderStatusHistory": 245,
    "shippingMethods": 4,
    "carts": 3,
    "addresses": 18
  }
}
```

---

## 🚀 Uso Recomendado

### Primera vez (Base de datos vacía):
1. Ejecutar `POST /api/seed/all`
2. Verificar con `GET /api/seed/status`

### Agregar solo pedidos nuevos:
1. Ejecutar `POST /api/seed/orders`

### Resetear todo:
1. Limpiar la base de datos manualmente o con `docker-compose down -v`
2. Ejecutar `POST /api/seed/all`

---

## 📦 Colección de Postman

### Importar Colección

Crea una nueva colección en Postman con estas requests:

```json
{
  "info": {
    "name": "E-commerce Seeds",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Seed All",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:5005/api/seed/all",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5005",
          "path": ["api", "seed", "all"]
        }
      }
    },
    {
      "name": "Seed Users",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:5005/api/seed/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5005",
          "path": ["api", "seed", "users"]
        }
      }
    },
    {
      "name": "Seed Orders",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:5005/api/seed/orders",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5005",
          "path": ["api", "seed", "orders"]
        }
      }
    },
    {
      "name": "Seed Legacy",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:5005/api/seed/legacy",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5005",
          "path": ["api", "seed", "legacy"]
        }
      }
    },
    {
      "name": "Database Status",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5005/api/seed/status",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5005",
          "path": ["api", "seed", "status"]
        }
      }
    }
  ]
}
```

---

## ⚠️ Notas Importantes

1. **Solo en Desarrollo:** Estas rutas solo están disponibles cuando `NODE_ENV=development`
2. **Sin Autenticación:** No requieren token de autenticación
3. **Datos Duplicados:** Ejecutar múltiples veces creará datos duplicados (excepto con restricciones únicas como emails)
4. **Orden de Ejecución:** Para crear pedidos, necesitas tener usuarios y productos primero

---

## 🎯 Credenciales de Prueba

Después de ejecutar `/api/seed/all`, puedes usar estas credenciales:

### Admin
- **Email:** `admin@ecommerce.com`
- **Password:** `Admin123!`

### Cliente de Prueba
- **Email:** `test@ecommerce.com`
- **Password:** `Customer123!`

### Clientes Faker (10 usuarios)
- **Password:** `Customer123!`
- **Emails:** Verificar en los logs del servidor o en la BD

---

## 📊 Verificación en la Base de Datos

Después de ejecutar los seeds, puedes verificar con estas queries SQL:

```sql
-- Contar usuarios
SELECT COUNT(*) FROM user;

-- Ver pedidos por estado
SELECT status, COUNT(*) as total FROM orders GROUP BY status;

-- Ver pedidos con tracking
SELECT order_id, status, tracking_number, tracking_url 
FROM orders 
WHERE tracking_number IS NOT NULL;

-- Ver historial de un pedido
SELECT o.order_id, o.status, osh.status, osh.notes, osh.created_at
FROM orders o
JOIN order_status_history osh ON o.order_id = osh.order_id
WHERE o.order_id = 1
ORDER BY osh.created_at;
```

---

## 🔧 Troubleshooting

### Error: "Cannot POST /api/seed/all"
- Verifica que `NODE_ENV=development` en tu archivo `.env`
- Reinicia el servidor

### Error: "Faltan datos requeridos"
- Ejecuta primero `/api/seed/all` para crear todos los datos base
- O ejecuta `/api/seed/users` y `/api/seed/products` antes de `/api/seed/orders`

### Error: "Duplicate entry"
- Los seeds intentan crear datos que ya existen (emails duplicados)
- Limpia la base de datos primero

### Sin response
- Verifica que el backend esté corriendo en el puerto 5005
- Revisa los logs del servidor en la terminal

---

## 💡 Tips

1. **Desarrollo Rápido:** Usa `/api/seed/all` para setup inicial rápido
2. **Testing de Pedidos:** Usa `/api/seed/orders` para agregar más pedidos de prueba
3. **Estado Actual:** Siempre verifica con `/api/seed/status` antes de ejecutar seeds
4. **Logs Detallados:** Revisa la consola del servidor para ver el progreso detallado

---

## 📝 Ejemplo de Flujo de Trabajo

```bash
# 1. Verificar estado inicial
GET /api/seed/status

# 2. Poblar base de datos completa
POST /api/seed/all

# 3. Verificar que todo se creó correctamente
GET /api/seed/status

# 4. (Opcional) Agregar más pedidos
POST /api/seed/orders

# 5. Verificar nuevamente
GET /api/seed/status
```

---

## 🎨 Variables de Entorno

Asegúrate de tener esto en tu `.env`:

```env
NODE_ENV=development
PORT=5005
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ecommerce_db
```
