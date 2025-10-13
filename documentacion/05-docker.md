# Guía de Docker - Despliegue y Configuración

## Resumen

El proyecto utiliza Docker y Docker Compose para orquestar todos los servicios necesarios. Esta arquitectura contenedorizada permite un despliegue consistente y escalable en diferentes entornos.

## Arquitectura de Contenedores

### Servicios Configurados

```yaml
# docker-compose.yml
services:
  mysql:         # Base de datos principal
  phpmyadmin:    # Administrador web MySQL
  redis:         # Sistema de cache y sesiones  
  backend:       # API Node.js + Express
  frontend-store: # Tienda React (Puerto 3000)
  frontend-admin: # Admin React (Puerto 3001)
```

### Red y Volúmenes
```yaml
networks:
  ecommerce_net:     # Red interna para comunicación entre servicios
    driver: bridge

volumes:
  mysql_data:        # Persistencia datos MySQL
  redis_data:        # Persistencia datos Redis
```

## Configuración de Servicios

### 1. MySQL Database
```yaml
mysql:
  image: mysql:8.0
  container_name: ecommerce_mysql
  restart: always
  environment:
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    MYSQL_DATABASE: ${MYSQL_DATABASE}
    MYSQL_USER: ${MYSQL_USER}
    MYSQL_PASSWORD: ${MYSQL_PASSWORD}
  ports:
    - "3308:3306"    # Puerto externo:interno
  volumes:
    - mysql_data:/var/lib/mysql
    - ./backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    timeout: 5s
    retries: 3
```

**Características**:
- MySQL 8.0 con autenticación nativa
- Inicialización automática con `init.sql`
- Health check para dependencias
- Datos persistentes en volumen
- Puerto 3308 para evitar conflictos locales

### 2. phpMyAdmin
```yaml
phpmyadmin:
  image: phpmyadmin/phpmyadmin
  container_name: ecommerce_phpmyadmin
  restart: always
  environment:
    PMA_HOST: mysql
    PMA_PORT: 3306
  ports:
    - "8080:80"
  depends_on:
    mysql:
      condition: service_healthy
```

**Acceso**: http://localhost:8080
- **Usuario**: `ecommerce_user` 
- **Contraseña**: Definida en `.env`

### 3. Redis Cache
```yaml
redis:
  image: redis:7.4-alpine
  container_name: ecommerce_redis
  restart: always
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: ["redis-server", "--save", "60", "1", "--loglevel", "warning"]
```

**Características**:
- Redis 7.4 Alpine (imagen ligera)
- Persistencia cada 60 segundos
- Logging level warning para producción
- Datos persistentes en volumen

### 4. Backend API
```yaml
backend:
  build: ./backend
  container_name: ecommerce_backend
  restart: always
  depends_on:
    mysql:
      condition: service_healthy
    redis:
      condition: service_started
  env_file:
    - .env
  ports:
    - "${PORT}:${PORT}"
```

**Dockerfile Multi-stage**:
```dockerfile
# STAGE 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# STAGE 2: runtime  
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache netcat-openbsd mysql-client
COPY --from=build /app /app
RUN sed -i 's/\r$//' wait-mysql.sh && chmod +x wait-mysql.sh
EXPOSE 5005
CMD ["sh", "./wait-mysql.sh"]
```

**Características**:
- Multi-stage build para optimización
- Script `wait-mysql.sh` espera MySQL
- Cliente MySQL para health checks
- Netcat para verificaciones de red

### 5. Frontend Store (Tienda)
```yaml
frontend-store:
  build: ./frontend-store
  container_name: ecommerce_frontend_store
  restart: always
  env_file:
    - .env
  environment:
    - VITE_API_URL=${VITE_STORE_API_URL}
    - VITE_APP_NAME=${VITE_STORE_APP_NAME}
  ports:
    - "${VITE_STORE_PORT}:3000"
  stdin_open: true
  tty: true
```

### 6. Frontend Admin (Panel)
```yaml
frontend-admin:
  build: ./frontend-admin
  container_name: ecommerce_frontend_admin
  restart: always
  env_file:
    - .env
  environment:
    - VITE_API_URL=${VITE_ADMIN_API_URL}
    - VITE_APP_NAME=${VITE_ADMIN_APP_NAME}
  ports:
    - "${VITE_ADMIN_PORT}:3000"
```

## Comandos Docker

### Desarrollo (docker-compose.yml)
```bash
# Iniciar todos los servicios
docker compose up

# Iniciar en background
docker compose up -d

# Rebuild y iniciar
docker compose up --build

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend

# Parar servicios
docker compose down

# Parar y eliminar volúmenes
docker compose down -v
```

### Producción (docker-compose.prod.yml)
```bash
# Iniciar en modo producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verificar estado
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Ver logs de producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

### Comandos Útiles de Desarrollo
```bash
# Ejecutar comando en contenedor backend
docker compose exec backend npm run test

# Ejecutar bash en contenedor
docker compose exec backend sh

# Ver estadísticas de contenedores
docker compose top

# Reiniciar un servicio específico
docker compose restart backend

# Escalar un servicio (cuando sea aplicable)
docker compose up --scale backend=2
```

## Variables de Entorno Docker

### Configuración de Puertos
```bash
# Backend
PORT=5005

# Frontend Store  
VITE_STORE_PORT=3000

# Frontend Admin
VITE_ADMIN_PORT=3001

# Base de datos (externo)
MYSQL_EXTERNAL_PORT=3308

# phpMyAdmin
PHPMYADMIN_PORT=8080

# Redis
REDIS_PORT=6379
```

### URLs de Servicios Internos
```bash
# Comunicación entre contenedores (red interna)
DB_HOST=mysql
REDIS_HOST=redis

# URLs para frontends (acceso desde navegador)
VITE_STORE_API_URL=http://localhost:5005/api
VITE_ADMIN_API_URL=http://localhost:5005/api
```

## Scripts de Inicialización

### Backend - wait-mysql.sh
```bash
#!/bin/sh
echo "Esperando que MySQL esté listo..."

# Esperar que MySQL esté disponible
until nc -z mysql 3306; do
  echo "MySQL no está listo - esperando..."
  sleep 2
done

echo "MySQL está listo - iniciando aplicación..."

# Verificar si NODE_ENV está configurado, si no, usar development
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=development
fi

echo "Ambiente: $NODE_ENV"

# Iniciar la aplicación según el ambiente
if [ "$NODE_ENV" = "production" ]; then
  npm start
else
  npm run dev
fi
```

### Base de datos - init.sql
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- Crear usuario
DROP USER IF EXISTS 'ecommerce_user'@'%';
CREATE USER 'ecommerce_user'@'%' IDENTIFIED WITH mysql_native_password BY 'ecommerce_p4zzW0rD';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;

-- Las tablas se crean automáticamente por Sequelize
```

## Configuración de Desarrollo vs Producción

### Desarrollo (docker-compose.yml)
```yaml
# Características:
- Hot reload activado (nodemon, vite dev)
- Logs verbosos
- DevTools habilitados
- Source maps incluidos
- Debugging ports expuestos
```

### Producción (docker-compose.prod.yml)
```yaml
backend:
  environment:
    NODE_ENV: production
  command: ["npm", "start"]  # Sin nodemon

frontend-store:
  command: >
    sh -c "npm run build && npx vite preview --host 0.0.0.0 --port 3000"

frontend-admin:
  command: >
    sh -c "npm run build && npx vite preview --host 0.0.0.0 --port 3000"
```

## Monitoring y Logging

### Configuración de Logs
```yaml
# En docker-compose.yml
backend:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"

frontend-store:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

### Comandos de Monitoreo
```bash
# Ver logs en tiempo real
docker compose logs -f --tail=50

# Estadísticas de recursos
docker compose top

# Inspeccionar contenedor
docker compose exec backend ps aux

# Verificar conectividad entre servicios
docker compose exec backend nc -zv mysql 3306
docker compose exec backend nc -zv redis 6379
```

## Health Checks

### MySQL Health Check
```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 60s
```

### Backend Health Check (Preparado)
```yaml
# Agregar al servicio backend
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5005/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Persistencia de Datos

### Volúmenes Configurados
```yaml
volumes:
  mysql_data:     # /var/lib/mysql - Datos MySQL
  redis_data:     # /data - Datos Redis
```

### Backup de Datos
```bash
# Backup MySQL
docker compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ecommerce > backup.sql

# Restore MySQL
docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} ecommerce < backup.sql

# Backup Redis
docker compose exec redis redis-cli BGSAVE
```

## Networking

### Red Interna
- **Nombre**: `ecommerce_net`
- **Driver**: bridge
- **Comunicación**: Todos los servicios pueden comunicarse por nombre

### Mapeo de Puertos
```
Host → Container
3308 → 3306 (MySQL)
8080 → 80   (phpMyAdmin)  
6379 → 6379 (Redis)
5005 → 5005 (Backend)
3000 → 3000 (Store)
3001 → 3000 (Admin)
```

## Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar qué está usando el puerto
netstat -tulpn | grep :3000

# Cambiar puerto en .env
VITE_STORE_PORT=3002
```

#### 2. MySQL no se conecta
```bash
# Verificar health check
docker compose ps

# Ver logs de MySQL
docker compose logs mysql

# Conectar manualmente
docker compose exec mysql mysql -u root -p
```

#### 3. Frontend no puede conectar al backend
```bash
# Verificar variables de entorno
docker compose exec frontend-store printenv | grep VITE

# Verificar conectividad
docker compose exec frontend-store nc -zv backend 5005
```

#### 4. Problemas de permisos (Windows/macOS)
```bash
# Ejecutar como administrador/sudo
sudo docker compose up

# O agregar usuario al grupo docker (Linux)
sudo usermod -aG docker $USER
```

### Comandos de Debug
```bash
# Inspeccionar red
docker network inspect ecommerce-project_ecommerce_net

# Ver configuración del contenedor
docker compose config

# Ejecutar modo debug
docker compose --verbose up

# Rebuild forzado
docker compose build --no-cache
```

## Performance y Optimización

### Optimizaciones de Build
```dockerfile
# Multi-stage builds
# Cache de dependencias npm
# Imágenes Alpine para menor tamaño
# User no-root para seguridad
```

### Configuración Producción
```yaml
# Límites de recursos
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M

# Restart policies
restart: unless-stopped
```

### Métricas de Contenedores
```bash
# Uso de recursos
docker stats

# Información detallada
docker compose exec backend free -h
docker compose exec backend df -h
```

## Security Best Practices

### Configuraciones de Seguridad
1. **No root users** en contenedores de producción
2. **Secrets management** con Docker secrets
3. **Network isolation** con redes personalizadas
4. **Read-only filesystems** cuando sea posible
5. **Security scanning** de imágenes

### Variables Sensibles
```bash
# Usar Docker secrets en producción
echo "database_password" | docker secret create db_pass -

# O variables de entorno con archivos
env_file:
  - .env
  - .env.local
  - .env.production
```

## Escalamiento

### Preparación para Kubernetes
```yaml
# Los servicios están preparados para:
- Horizontal Pod Autoscaling
- LoadBalancer services  
- Persistent Volume Claims
- ConfigMaps y Secrets
- Ingress controllers
```

### Docker Swarm (Alternativa simple)
```bash
# Inicializar swarm
docker swarm init

# Deploy como stack
docker stack deploy -c docker-compose.yml ecommerce

# Escalar servicios
docker service scale ecommerce_backend=3
```