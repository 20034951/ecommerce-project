# Sistema de Seeding

Este documento es el índice principal del sistema de seeding del proyecto E-commerce.

## 📋 Contenido

1. **[Quick Start con Postman](10-seeding/01-quick-start-postman.md)**
   - Guía rápida para empezar a usar las semillas desde Postman
   - Pasos básicos de configuración
   - Ejemplos de peticiones

2. **[Sistema de Seeding](10-seeding/02-sistema-seeding.md)**
   - Visión general del sistema completo
   - Arquitectura y componentes
   - Flujo de ejecución

3. **[Estructura de Archivos](10-seeding/03-estructura-archivos.md)**
   - Organización de carpetas y archivos
   - Ubicación de seeders y rutas
   - Estructura del proyecto

4. **[Seeders - Detalle Técnico](10-seeding/04-seeders-detalle.md)**
   - Documentación técnica de cada seeder
   - Implementación y funcionalidad
   - Dependencias entre seeders

5. **[API de Seeds](10-seeding/05-api-seeds.md)**
   - Referencia completa de endpoints
   - Parámetros y respuestas
   - Ejemplos de uso

## 🎯 Propósito

El sistema de seeding proporciona:

- **Datos de Prueba**: Generación automática de datos realistas con Faker.js
- **Desarrollo Rápido**: Poblar la base de datos en segundos
- **Testing**: Datos consistentes para pruebas
- **Demostración**: Datos de muestra para presentaciones

## 🚀 Inicio Rápido

### Opción 1: NPM Scripts

```bash
# Ejecutar todas las semillas
npm run seed

# Ejecutar solo usuarios
npm run seed:users

# Ejecutar solo productos
npm run seed:products

# Ejecutar solo órdenes
npm run seed:orders
```

### Opción 2: API REST (Postman)

1. Asegúrate de que el servidor esté en modo desarrollo
2. Importa la colección de Postman incluida
3. Ejecuta las peticiones POST a `/api/seed/*`

Ver **[Quick Start Postman](10-seeding/01-quick-start-postman.md)** para más detalles.

## 📦 Seeders Disponibles

| Seeder | Descripción | Comando NPM |
|--------|-------------|-------------|
| **Users** | Crea usuarios con direcciones | `npm run seed:users` |
| **Categories** | Crea 8 categorías principales | `npm run seed:categories` |
| **Products** | Crea ~50 productos con Faker | `npm run seed:products` |
| **Shipping** | Crea 4 métodos de envío | `npm run seed:shipping` |
| **Orders** | Crea órdenes con todos los estados | `npm run seed:orders` |
| **Legacy** | Datos heredados del sistema anterior | `npm run seed:legacy` |
| **All** | Ejecuta todos los seeders en orden | `npm run seed` |

## 🔧 Tecnologías

- **Faker.js**: Generación de datos realistas
- **Sequelize**: ORM para interacción con base de datos
- **Express**: API REST para ejecución remota
- **bcryptjs**: Encriptación de contraseñas

## 📚 Documentación Adicional

- [Arquitectura General](01-arquitectura.md)
- [Backend](02-backend.md)
- [Base de Datos](07-base-datos.md)
- [Testing](08-testing.md)

## ⚠️ Importante

- Los seeders **solo funcionan en modo desarrollo** (`NODE_ENV=development`)
- Las rutas API están **protegidas** y no estarán disponibles en producción
- Cada ejecución **limpia y recrea** los datos (destructivo)
- Los seeders tienen dependencias: Users → Categories → Products → Orders

## 🎨 Datos Generados

### Usuarios (10)
- 1 Admin (admin@example.com / admin123)
- 9 Clientes aleatorios con direcciones

### Categorías (8)
- Electrónica, Ropa, Hogar, Deportes, Libros, Juguetes, Alimentos, Salud

### Productos (~50)
- Nombres, descripciones y precios realistas generados con Faker
- Stock, SKU, categorías asignadas
- Imágenes de placeholder

### Métodos de Envío (4)
- Estándar, Express, Overnight, Internacional
- Precios y tiempos realistas

### Órdenes (Variable)
- Todos los estados posibles: pending, processing, shipped, delivered, cancelled
- Números de tracking reales (UPS, FedEx, DHL, USPS)
- URLs funcionales de seguimiento
- Historial de estados

## 🔗 Enlaces Rápidos

- [Ver estructura completa](10-seeding/03-estructura-archivos.md)
- [Ver detalles técnicos](10-seeding/04-seeders-detalle.md)
- [Ver API completa](10-seeding/05-api-seeds.md)

---

**Última actualización**: 2024
**Versión**: 1.0.0
