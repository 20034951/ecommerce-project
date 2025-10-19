# 🚀 Guía Rápida: Ejecutar Seeds desde Postman

## ✅ Todo Listo para Usar

### Archivos Creados:
- ✅ Sistema de seeders modular en `backend/src/seeds/`
- ✅ Rutas API en `backend/src/routes/seed.js`
- ✅ Colección de Postman: `Ecommerce_Seeds.postman_collection.json`
- ✅ Documentación completa

---

## 📋 Paso a Paso

### 1️⃣ Importar Colección en Postman

1. Abre Postman
2. Click en **Import** (botón superior izquierdo)
3. Selecciona el archivo:
   ```
   backend/Ecommerce_Seeds.postman_collection.json
   ```
4. Click en **Import**

Verás una colección llamada **"E-commerce Seeds API"** con todas las rutas

---

### 2️⃣ Iniciar el Servidor Backend

```bash
cd backend
npm run dev
```

**Verás este mensaje:**
```
🌐 Backend ejecutándose en puerto 5005
📍 Acceso local: http://localhost:5005

💡 Rutas de seeding disponibles:
   POST http://localhost:5005/api/seed/all - Ejecutar todos los seeders
   POST http://localhost:5005/api/seed/users - Solo usuarios
   POST http://localhost:5005/api/seed/orders - Solo pedidos
   POST http://localhost:5005/api/seed/legacy - Seeder antiguo
   GET  http://localhost:5005/api/seed/status - Estado de la BD
```

---

### 3️⃣ Ejecutar el Seeding Completo

En Postman, dentro de la colección **"E-commerce Seeds API"**:

1. Abre la carpeta **"Seeds"**
2. Selecciona **"🌱 Seed All (Todos los Seeders)"**
3. Click en **Send**

**Response esperado (200 OK):**
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

⏱️ **Tiempo estimado:** 10-30 segundos

---

### 4️⃣ Verificar los Datos

En Postman:

1. Abre la carpeta **"Status"**
2. Selecciona **"📊 Database Status"**
3. Click en **Send**

**Verás:**
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

✅ ¡Datos listos para usar!

---

### 5️⃣ Probar el Login

En Postman, carpeta **"Auth - Login Tests"**:

**Opción 1: Login Admin**
```json
POST /api/auth/login
{
  "email": "admin@ecommerce.com",
  "password": "Admin123!"
}
```

**Opción 2: Login Cliente**
```json
POST /api/auth/login
{
  "email": "test@ecommerce.com",
  "password": "Customer123!"
}
```

---

## 🎯 Rutas Disponibles en Postman

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/seed/all` | POST | ⭐ Ejecutar todos los seeders |
| `/api/seed/users` | POST | Solo usuarios y direcciones |
| `/api/seed/categories` | POST | Solo categorías |
| `/api/seed/products` | POST | Solo productos |
| `/api/seed/orders` | POST | Solo pedidos (requiere datos existentes) |
| `/api/seed/legacy` | POST | Seeder antiguo |
| `/api/seed/status` | GET | Ver estado de la BD |

---

## 📊 Datos Generados

### Usuarios (12 total)
```
✅ 1 Admin: admin@ecommerce.com / Admin123!
✅ 1 Test: test@ecommerce.com / Customer123!
✅ 10 Clientes: Emails generados por Faker / Customer123!
```

### Pedidos (~67 total)
```
✅ Pending (Pendientes)
✅ Paid (Pagados)
✅ Processing (En proceso)
✅ Shipped (Enviados) - CON TRACKING ⭐
✅ Delivered (Entregados) - CON TRACKING ⭐
✅ Cancelled (Cancelados) - CON RAZÓN ⭐
```

### Datos de Tracking Realistas
```
Tracking Number: UPS123456789012
Tracking URL: https://www.ups.com/track?tracknum=UPS123456789012
```

---

## 🔄 Workflow Recomendado

### Primera Vez:
```
1. POST /api/seed/all
2. GET /api/seed/status (verificar)
3. POST /api/auth/login (probar credenciales)
```

### Agregar Más Pedidos:
```
1. POST /api/seed/orders
2. GET /api/seed/status (verificar)
```

### Verificar Estado:
```
GET /api/seed/status (siempre disponible)
```

---

## ⚠️ Notas Importantes

1. **Solo funciona en desarrollo:**
   - Asegúrate de tener `NODE_ENV=development` en `.env`
   
2. **No requiere autenticación:**
   - Estas rutas son públicas (solo en desarrollo)
   
3. **Datos duplicados:**
   - Ejecutar múltiples veces puede crear duplicados
   - Los emails deben ser únicos (dará error si ya existen)

4. **Orden de dependencias:**
   - Para crear pedidos, necesitas usuarios y productos primero
   - Usa `/api/seed/all` para evitar problemas

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot POST /api/seed/all"
**Solución:**
- Verifica que `NODE_ENV=development` en tu `.env`
- Reinicia el servidor

### ❌ Error: "Faltan datos requeridos"
**Solución:**
- Ejecuta primero `/api/seed/all`
- O crea usuarios y productos antes de pedidos

### ❌ Error: "Duplicate entry 'admin@ecommerce.com'"
**Solución:**
- Los datos ya existen
- Limpia la BD o usa `/api/seed/orders` para solo agregar pedidos

### ❌ No aparecen las rutas
**Solución:**
```bash
# Verifica el .env
cat .env | grep NODE_ENV

# Debe mostrar:
NODE_ENV=development

# Si no está, agrégalo:
echo "NODE_ENV=development" >> .env

# Reinicia el servidor
npm run dev
```

---

## 🎨 Ventajas vs Terminal

| Característica | Terminal | Postman |
|----------------|----------|---------|
| Acceso remoto | ❌ | ✅ |
| Desde Docker | ❌ | ✅ |
| Sin CLI | ❌ | ✅ |
| Ver responses | ❌ | ✅ |
| Modular | ⚠️ | ✅ |
| Fácil de usar | ⚠️ | ✅ ⭐ |

---

## ✨ Próximos Pasos

1. ✅ Ejecuta `/api/seed/all` en Postman
2. ✅ Verifica con `/api/seed/status`
3. ✅ Prueba el login con las credenciales
4. ✅ Abre el frontend y ve los pedidos
5. ✅ Prueba los filtros de búsqueda
6. ✅ Verifica el tracking en los pedidos enviados

---

## 📚 Documentación Adicional

- **Seeders completos:** `backend/src/seeds/README.md`
- **API detallada:** `backend/src/routes/SEED_API_GUIDE.md`
- **Resumen general:** `backend/SEEDING_SYSTEM_SUMMARY.md`

---

## 🎉 ¡Listo para Probar!

El sistema está completamente configurado. Solo necesitas:

1. Importar la colección en Postman
2. Iniciar el servidor (`npm run dev`)
3. Ejecutar `POST /api/seed/all`
4. ¡Disfrutar de los datos de prueba!

**¿Preguntas?** Revisa los archivos de documentación o los logs del servidor.
