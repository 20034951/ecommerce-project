# Sistema de Seeders Idempotentes

## 🎯 Objetivo

Los seeders ahora son **idempotentes**, lo que significa que pueden ejecutarse múltiples veces sin:
- ❌ Duplicar datos fijos (admin, editor, cliente)
- ❌ Generar errores de constraint unique
- ❌ Eliminar datos existentes

## ✨ Características

### Usuarios Fijos (No Duplicables)
Los siguientes usuarios son **fijos** y solo se crean una vez:

| Email | Contraseña | Rol | Descripción |
|-------|-----------|-----|-------------|
| `admin@ecommerce.com` | `Admin123!` | admin | Usuario administrador |
| `editor@ecommerce.com` | `Editor123!` | customer | Usuario editor |
| `cliente@ecommerce.com` | `Customer123!` | customer | Usuario cliente de prueba |

### Datos Aleatorios (Acumulativos)
En cada ejecución se **agregan** nuevos:
- 👥 10 usuarios clientes adicionales (con Faker.js)
- 📦 10 productos adicionales (con Faker.js)
- 🛒 2-4 órdenes por cliente existente

### Datos Fijos (No Duplicables)
Los siguientes datos solo se crean una vez:
- 📁 8 Categorías predefinidas
- 🚚 4 Métodos de envío estándar
- 📦 ~50 Productos base por categoría

## 🔄 Comportamiento por Seeder

### 1. userSeeder.js
```javascript
✅ Usuarios fijos: findOrCreate (admin, editor, cliente)
✅ Usuarios fake: Validación de email antes de crear
✅ Direcciones: Solo se crean si no existen para el usuario
```

**Primera ejecución:**
- Crea 3 usuarios fijos + 10 aleatorios = 13 usuarios

**Segunda ejecución:**
- Mantiene 3 usuarios fijos
- Agrega 10 nuevos aleatorios = 23 usuarios totales

### 2. categorySeeder.js
```javascript
✅ Categorías: findOrCreate por nombre
```

**Primera ejecución:**
- Crea 8 categorías

**Segunda ejecución:**
- 8 categorías ya existen (no duplica)

### 3. productSeeder.js
```javascript
✅ Productos base: Validación por nombre + categoría
✅ Productos adicionales: Validación por nombre
```

**Primera ejecución:**
- Crea ~50 productos base + 10 adicionales = 60 productos

**Segunda ejecución:**
- 50 productos base ya existen
- Agrega 10 nuevos aleatorios = 70 productos totales

### 4. shippingMethodSeeder.js
```javascript
✅ Métodos de envío: findOrCreate por nombre
```

**Primera ejecución:**
- Crea 4 métodos

**Segunda ejecución:**
- 4 métodos ya existen (no duplica)

### 5. orderSeeder.js
```javascript
✅ Órdenes: Siempre crea nuevas (sin validación)
✅ Obtiene datos de BD si no se pasan parámetros
```

**Cada ejecución:**
- Crea 2-4 órdenes nuevas por cada cliente existente

## 📊 Ejemplo de Ejecuciones

### Primera Ejecución
```
POST /api/seed/all

Resultado:
- 13 usuarios (3 fijos + 10 fake)
- 8 categorías
- 60 productos (50 base + 10 fake)
- 4 métodos de envío
- ~50 órdenes (2-4 por cliente)
```

### Segunda Ejecución
```
POST /api/seed/all

Resultado:
- 23 usuarios (3 fijos mantienen + 10 nuevos fake)
- 8 categorías (mantiene las mismas)
- 70 productos (50 base mantienen + 10 nuevos fake)
- 4 métodos de envío (mantiene los mismos)
- ~100 órdenes (~50 anteriores + ~50 nuevas)
```

### Tercera Ejecución
```
POST /api/seed/all

Resultado:
- 33 usuarios (3 fijos + 30 fake acumulados)
- 8 categorías (mantiene)
- 80 productos (50 base + 30 fake acumulados)
- 4 métodos de envío (mantiene)
- ~150 órdenes (acumuladas de todas las ejecuciones)
```

## 🛠️ Cambios Técnicos Implementados

### findOrCreate (Datos Fijos)
```javascript
// Antes
const user = await User.create({ email: 'admin@ecommerce.com', ... });

// Ahora
const [user, created] = await User.findOrCreate({
    where: { email: 'admin@ecommerce.com' },
    defaults: { name: 'Admin', ... }
});

if (created) {
    console.log('✨ Usuario creado');
} else {
    console.log('♻️  Usuario ya existe');
}
```

### Validación Manual (Datos Fake)
```javascript
// Antes
const user = await User.create({ email: faker.internet.email(), ... });

// Ahora
const email = faker.internet.email();
const existing = await User.findOne({ where: { email } });

if (!existing) {
    const user = await User.create({ email, ... });
}
```

### Auto-obtención de Dependencias
```javascript
// Ahora los seeders pueden ejecutarse independientemente
export const seedOrders = async (users, products, shippingMethods) => {
    // Si no se pasan, los obtiene de la BD
    if (!users || users.length === 0) {
        users = await User.findAll();
    }
    // ... resto del código
};
```

## 🚀 Uso

### Opción 1: API (Postman)
```bash
POST http://localhost:5005/api/seed/all
```

### Opción 2: NPM Scripts
```bash
npm run seed                # Todos los seeders
npm run seed:users          # Solo usuarios
npm run seed:products       # Solo productos
npm run seed:orders         # Solo órdenes
```

## ✅ Ventajas

1. **Sin errores de duplicados**: No más `email must be unique`
2. **Datos consistentes**: Los usuarios de prueba siempre están disponibles
3. **Acumulación controlada**: Solo se agregan datos nuevos
4. **Testing mejorado**: Se puede ejecutar el seeder antes de cada test
5. **Desarrollo ágil**: Agregar más datos de prueba sin resetear la BD

## ⚠️ Consideraciones

- **Órdenes**: Se crean nuevas en cada ejecución (pueden acumularse rápido)
- **Productos fake**: Se acumulan 10 por ejecución
- **Usuarios fake**: Se acumulan 10 por ejecución
- **Base de datos**: Puede crecer mucho si se ejecuta muchas veces

## 🔧 Recomendaciones

### Para desarrollo:
```bash
# Primera vez (datos completos)
POST /api/seed/all

# Agregar más datos cuando sea necesario
POST /api/seed/all
```

### Para testing:
```bash
# Una sola vez al inicio
npm run seed

# Los tests usan los datos existentes
npm test
```

### Para resetear completamente:
```bash
# 1. Limpiar BD manualmente (phpMyAdmin o SQL)
# 2. Ejecutar migrations
npm run migrate

# 3. Ejecutar seeder
npm run seed
```

## 📝 Notas

- ✅ Compatible con CI/CD
- ✅ Safe para producción (solo en modo development)
- ✅ Logs informativos de qué se crea y qué se mantiene
- ✅ Sin bloqueos de base de datos

---

**Fecha de implementación**: 18 de octubre de 2025  
**Versión**: 2.0.0 (Idempotente)
