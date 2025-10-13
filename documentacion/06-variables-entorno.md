# Variables de Entorno - Guía Completa

## Resumen

Este documento describe todas las variables de entorno necesarias para ejecutar el proyecto de ecommerce. Incluye configuraciones para desarrollo, testing y producción.

## Archivo .env.example

El proyecto incluye un archivo `.env.example` completo que debe copiarse como `.env` y configurarse según el entorno:

```bash
# Copiar plantilla
cp .env.example .env

# Editar con valores reales
nano .env  # o el editor de tu preferencia
```

## Variables por Categoría

### 1. Configuración General
```bash
# Entorno de ejecución
NODE_ENV=development              # development, production, test
```

### 2. Base de Datos MySQL
```bash
# Configuración conexión backend
DB_HOST=mysql                     # Host de la base de datos
DB_PORT=3306                      # Puerto interno
DB_USER=ecommerce_user           # Usuario de la aplicación
DB_PASS=ecommerce_p4zzW0rD       # Contraseña del usuario
DB_NAME=ecommerce                # Nombre de la base de datos

# Configuración Docker MySQL
MYSQL_ROOT_PASSWORD=root_password # Contraseña root MySQL
MYSQL_DATABASE=ecommerce         # DB que se crea automáticamente
MYSQL_USER=ecommerce_user        # Usuario que se crea automáticamente
MYSQL_PASSWORD=ecommerce_p4zzW0rD # Contraseña del usuario creado

# Testing (opcional)
MYSQL_DATABASE_TEST=ecommerce_test
MYSQL_USER_TEST=ecommerce_user_test
MYSQL_PASSWORD_TEST=test_password
MYSQL_HOST_TEST=localhost
MYSQL_PORT_TEST=3308
```

### 3. Backend API
```bash
# Servidor
PORT=5005                        # Puerto del backend

# Autenticación JWT
JWT_SECRET=your-256-bit-secret   # Secret para firmar JWT (¡CAMBIAR!)
JWT_EXPIRY=15m                   # Duración token acceso
REFRESH_TOKEN_EXPIRY=7d          # Duración refresh token

# CORS y URLs
FRONTEND_ADMIN_URL=http://localhost:3001  # URL admin para CORS
```

### 4. Sistema de Cache Redis
```bash
REDIS_HOST=redis                 # Host Redis
REDIS_PORT=6379                  # Puerto Redis
REDIS_PASSWORD=                  # Contraseña (vacía por defecto)
REDIS_URL=redis://redis:6379     # URL completa
```

### 5. Servicio de Emails
```bash
# Resend API (recomendado)
RESEND_API_KEY=re_xxxxxxxxxxxxx  # API key de Resend
FROM_EMAIL=noreply@yourstore.com # Email remitente

# SMTP alternativo (Gmail, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
```

### 6. Frontend Store (Tienda)
```bash
# Configuración aplicación
VITE_STORE_PORT=3000             # Puerto tienda
VITE_STORE_APP_NAME=Tu Tienda    # Nombre de la aplicación
VITE_STORE_API_URL=http://localhost:5005/api  # URL del backend

# Configuración Vite
VITE_NODE_ENV=development
VITE_JWT_SECRET=same-as-backend-jwt-secret
VITE_REFRESH_TOKEN_COOKIE_NAME=refreshToken
VITE_CACHE_TIME=300000           # 5 minutos en ms

# SEO (opcional)
VITE_STORE_META_DESCRIPTION=Tu tienda online
VITE_STORE_META_KEYWORDS=ecommerce,tienda,online
VITE_GTM_ID=GTM-XXXXXXX         # Google Tag Manager
VITE_ANALYTICS_ID=GA-XXXXXXX    # Google Analytics
```

### 7. Frontend Admin (Panel)
```bash
# Configuración aplicación
VITE_ADMIN_PORT=3001             # Puerto panel admin
VITE_ADMIN_APP_NAME=Panel Admin  # Nombre aplicación
VITE_ADMIN_API_URL=http://localhost:5005/api  # URL del backend

# Nota: Las variables VITE_NODE_ENV, VITE_JWT_SECRET, etc. se heredan del store
```

### 8. Servicios Externos (Opcional)

#### Pasarelas de Pago
```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxxxx  # Clave pública Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx  # Clave secreta Stripe  
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Secret para webhooks

# PayPal
PAYPAL_CLIENT_ID=xxxxxxxxxxxxxx # Client ID PayPal
PAYPAL_CLIENT_SECRET=xxxxxxxxxx # Client Secret PayPal
PAYPAL_MODE=sandbox             # sandbox o live
```

#### Almacenamiento de Archivos
```bash
# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXX  # Access key AWS
AWS_SECRET_ACCESS_KEY=xxxxxxxx  # Secret key AWS
AWS_REGION=us-east-1            # Región AWS
AWS_S3_BUCKET=your-bucket       # Bucket para imágenes

# Cloudinary (alternativa)
CLOUDINARY_CLOUD_NAME=your-name # Cloud name
CLOUDINARY_API_KEY=xxxxxxxxxx  # API key
CLOUDINARY_API_SECRET=xxxxxxxx # API secret
```

#### Servicios de Envío
```bash
# ShipStation
SHIPSTATION_API_KEY=xxxxxxxxxx  # API key ShipStation
SHIPSTATION_API_SECRET=xxxxxxx  # API secret
```

### 9. Monitoreo y Logging (Opcional)
```bash
# Sentry (error tracking)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# New Relic (performance monitoring)
NEW_RELIC_LICENSE_KEY=xxxxxxxxxx
NEW_RELIC_APP_NAME=Ecommerce-Backend
```

### 10. Configuraciones de Desarrollo
```bash
DEBUG_SQL=false                  # Debug queries Sequelize
VERBOSE_LOGS=true                # Logs verbosos
DISABLE_CACHE=false              # Deshabilitar cache Redis
AUTO_SEED_DB=false               # Auto-poblar BD con datos test
```

## Configuraciones por Entorno

### Desarrollo Local
```bash
# .env para desarrollo
NODE_ENV=development
DB_HOST=mysql
REDIS_HOST=redis
FRONTEND_ADMIN_URL=http://localhost:3001
VITE_STORE_API_URL=http://localhost:5005/api
VITE_ADMIN_API_URL=http://localhost:5005/api

# Debug habilitado
DEBUG_SQL=true
VERBOSE_LOGS=true
```

### Testing
```bash
# .env.test
NODE_ENV=test
DB_HOST=localhost
DB_PORT=3308
DB_NAME=ecommerce_test
REDIS_HOST=localhost

# Cache deshabilitado para tests
DISABLE_CACHE=true
```

### Producción
```bash
# Variables de producción (usar variables del sistema, no archivo .env)
NODE_ENV=production

# Dominios reales
FRONTEND_ADMIN_URL=https://admin.yourstore.com
VITE_STORE_API_URL=https://api.yourstore.com/api
VITE_ADMIN_API_URL=https://api.yourstore.com/api

# Base de datos externa
DB_HOST=your-db-cluster.region.rds.amazonaws.com
DB_USER=prod_user
DB_PASS=ultra-secure-password

# Redis externo
REDIS_HOST=your-redis-cluster.region.cache.amazonaws.com
REDIS_PASSWORD=redis-secure-password

# JWT más seguro
JWT_SECRET=ultra-secure-256-bit-secret-generated-randomly
JWT_EXPIRY=5m
REFRESH_TOKEN_EXPIRY=1d

# Seguridad
FORCE_HTTPS=true
SECURE_COOKIES=true
```

## Generación de Secrets Seguros

### JWT Secret
```bash
# Generar secret de 256 bits (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado ejemplo:
# a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### Passwords Seguros
```bash
# Generar password base64
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generar password alfanumérico
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Verificación de Configuración

### Scripts de Verificación
```bash
# Verificar conexión MySQL
mysql -h localhost -P 3308 -u ecommerce_user -p ecommerce

# Verificar Redis
redis-cli -h localhost -p 6379 ping

# Verificar variables backend
docker compose exec backend printenv | grep -E "(DB_|REDIS_|JWT_)"

# Verificar variables frontend
docker compose exec frontend-store printenv | grep VITE_
```

### Health Checks
```bash
# Backend health
curl http://localhost:5005/

# Verificar JWT configuration
curl -X POST http://localhost:5005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Buenas Prácticas

### Seguridad
1. **Nunca commitear** archivos `.env` reales
2. **Rotar secrets** regularmente en producción  
3. **Usar variables del sistema** en producción, no archivos
4. **Longitud mínima JWT**: 256 bits (32+ caracteres)
5. **HTTPS obligatorio** en producción

### Gestión
1. **Documentar cambios** en `.env.example`
2. **Validar variables** al inicio de la aplicación
3. **Usar defaults sensatos** cuando sea posible
4. **Separar por entornos** (dev, staging, prod)

### Desarrollo
```bash
# Cargar variables en shell actual
export $(cat .env | grep -v '^#' | xargs)

# Verificar variable específica
echo $JWT_SECRET

# Ejecutar comando con variables
env $(cat .env | grep -v '^#' | xargs) npm run dev
```

## Troubleshooting

### Problemas Comunes

#### 1. Backend no conecta a MySQL
```bash
# Verificar variables
echo $DB_HOST $DB_PORT $DB_USER

# Verificar conectividad desde contenedor
docker compose exec backend nc -zv mysql 3306
```

#### 2. Frontend no puede hacer requests al backend
```bash
# Verificar CORS en backend
echo $FRONTEND_ADMIN_URL

# Verificar URL en frontend
echo $VITE_ADMIN_API_URL
```

#### 3. JWT tokens no funcionan
```bash
# Verificar que JWT_SECRET sea el mismo en backend y frontend
grep JWT_SECRET .env
```

#### 4. Redis no conecta
```bash
# Verificar variables Redis
echo $REDIS_HOST $REDIS_PORT

# Test conectividad
docker compose exec backend nc -zv redis 6379
```

### Variables Faltantes
Si una variable no está definida, la aplicación debería mostrar un error claro:

```javascript
// Ejemplo validación en backend
const requiredVars = ['DB_HOST', 'DB_USER', 'JWT_SECRET'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Variable requerida faltante: ${varName}`);
    process.exit(1);
  }
});
```