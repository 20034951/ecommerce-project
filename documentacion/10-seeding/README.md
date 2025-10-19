# Sistema de Seeding - Documentación

Esta carpeta contiene toda la documentación relacionada con el sistema de seeding del proyecto E-commerce.

## 📚 Documentos Disponibles

### 1. Quick Start con Postman
**Archivo**: `01-quick-start-postman.md`

Guía rápida para empezar a usar el sistema de seeding desde Postman en menos de 5 minutos.

**Contenido**:
- Requisitos previos
- Importación de colección
- Ejecución de seeders
- Verificación de datos

**Para quién**: Desarrolladores que quieren poblar rápidamente la BD con datos de prueba.

---

### 2. Sistema de Seeding - Resumen
**Archivo**: `02-sistema-seeding.md`

Documentación completa del sistema de seeding, su arquitectura y funcionamiento.

**Contenido**:
- Visión general del sistema
- Arquitectura y componentes
- Flujo de ejecución
- Tecnologías utilizadas
- Seeders disponibles

**Para quién**: Desarrolladores que quieren entender cómo funciona el sistema completo.

---

### 3. Estructura de Archivos
**Archivo**: `03-estructura-archivos.md`

Mapa visual de todos los archivos y carpetas relacionados con el seeding.

**Contenido**:
- Estructura de carpetas
- Ubicación de seeders
- Archivos de configuración
- Rutas API

**Para quién**: Desarrolladores nuevos en el proyecto que necesitan orientación.

---

### 4. Seeders - Detalle Técnico
**Archivo**: `04-seeders-detalle.md`

Documentación técnica detallada de cada seeder individual.

**Contenido**:
- Implementación de cada seeder
- Datos generados
- Dependencias entre seeders
- Ejemplos de código
- Funciones auxiliares

**Para quién**: Desarrolladores que necesitan modificar o crear nuevos seeders.

---

### 5. API de Seeds
**Archivo**: `05-api-seeds.md`

Referencia completa de los endpoints API para ejecutar seeders remotamente.

**Contenido**:
- Lista de endpoints
- Parámetros y respuestas
- Códigos de estado
- Ejemplos de uso con curl y Postman
- Manejo de errores

**Para quién**: Desarrolladores que integran el seeding en flujos CI/CD o herramientas externas.

---

## 🎯 Flujo de Lectura Recomendado

### Para Usuarios Nuevos
1. Empieza con **Quick Start** (01) para poblar datos rápidamente
2. Lee **Sistema de Seeding** (02) para entender el panorama general
3. Revisa **Estructura de Archivos** (03) para orientarte en el código

### Para Desarrolladores
1. Lee **Sistema de Seeding** (02) para entender la arquitectura
2. Estudia **Seeders - Detalle Técnico** (04) para ver implementaciones
3. Consulta **API de Seeds** (05) para integraciones

### Para Modificar/Extender
1. Lee **Seeders - Detalle Técnico** (04) para ver patrones existentes
2. Revisa **Estructura de Archivos** (03) para ubicar archivos
3. Consulta **API de Seeds** (05) si necesitas agregar endpoints

---

## 🚀 Inicio Rápido

### Opción 1: NPM Scripts (Recomendado para desarrollo local)

```bash
# Desde la carpeta backend/
npm run seed              # Ejecuta todos los seeders
npm run seed:users        # Solo usuarios
npm run seed:products     # Solo productos
npm run seed:orders       # Solo órdenes
```

### Opción 2: API REST (Recomendado para Postman/herramientas)

```bash
POST http://localhost:5005/api/seed/all
POST http://localhost:5005/api/seed/users
POST http://localhost:5005/api/seed/products
POST http://localhost:5005/api/seed/orders
```

Ver **01-quick-start-postman.md** para instrucciones detalladas.

---

## 📦 Seeders Disponibles

| Seeder | Archivo | Descripción | Tiempo Aprox. |
|--------|---------|-------------|---------------|
| **All** | `index.js` | Ejecuta todos en orden correcto | ~5 segundos |
| **Users** | `userSeeder.js` | 10 usuarios + direcciones | ~1 segundo |
| **Categories** | `categorySeeder.js` | 8 categorías principales | <1 segundo |
| **Products** | `productSeeder.js` | ~50 productos con Faker | ~2 segundos |
| **Shipping** | `shippingMethodSeeder.js` | 4 métodos de envío | <1 segundo |
| **Orders** | `orderSeeder.js` | Órdenes con tracking | ~1 segundo |
| **Legacy** | `legacySeeder.js` | Datos heredados | Variable |

---

## 🔧 Tecnologías

- **[@faker-js/faker](https://fakerjs.dev/)**: Generación de datos realistas
- **[Sequelize](https://sequelize.org/)**: ORM para MySQL
- **[Express](https://expressjs.com/)**: API REST
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Hash de contraseñas

---

## ⚠️ Consideraciones Importantes

### Seguridad
- ⚠️ Los seeders **solo funcionan en modo desarrollo**
- ⚠️ Las rutas API están **deshabilitadas en producción**
- ⚠️ **Nunca** ejecutar seeders en bases de datos productivas

### Datos
- 🗑️ Los seeders son **destructivos**: eliminan datos existentes
- 🔄 Cada ejecución recrea todos los datos desde cero
- 📊 Los IDs se regeneran en cada ejecución

### Dependencias
Los seeders tienen un orden de ejecución obligatorio:

```
1. Users (base)
2. Categories (base)
3. Shipping Methods (base)
4. Products (depende de Categories)
5. Orders (depende de Users, Products, Shipping)
```

El seeder "All" maneja este orden automáticamente.

---

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa el documento correspondiente en esta carpeta
2. Consulta los ejemplos de código en `backend/src/seeds/`
3. Verifica los logs del servidor
4. Revisa la colección de Postman incluida

---

## 🔗 Enlaces Relacionados

- [Documentación Backend](../02-backend.md)
- [Documentación Base de Datos](../07-base-datos.md)
- [Documentación Testing](../08-testing.md)
- [Variables de Entorno](../06-variables-entorno.md)

---

**Ubicación del código**: `backend/src/seeds/`  
**Ubicación de las rutas API**: `backend/src/routes/seed.js`  
**Colección Postman**: `backend/Ecommerce_Seeds.postman_collection.json`

---

**Última actualización**: 2024  
**Versión**: 1.0.0
