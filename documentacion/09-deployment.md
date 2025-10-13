# Deployment - Guía de Despliegue y Producción

## Resumen

Esta guía cubre las estrategias y configuraciones necesarias para desplegar la aplicación de ecommerce en diferentes entornos, desde desarrollo local hasta producción escalable.

## Estrategias de Deployment

### 1. Desarrollo Local
- Docker Compose para desarrollo rápido
- Hot reload y debugging habilitado
- Base de datos y cache locales
- Variables de entorno de desarrollo

### 2. Staging/Testing
- Entorno similar a producción
- Base de datos y servicios externos de prueba
- CI/CD automatizado
- Tests de integración completos

### 3. Producción
- Servicios gestionados en la nube
- Alta disponibilidad y escalabilidad
- Monitoreo y logging avanzado
- Backups y disaster recovery

## Configuraciones por Entorno

### Desarrollo Local (Docker Compose)
```bash
# Iniciar entorno completo
docker compose up -d --build

# Solo servicios base (sin frontends)
docker compose up -d mysql redis phpmyadmin

# Desarrollo con hot reload
docker compose up --build

# Verificar servicios
docker compose ps
docker compose logs -f backend
```

**Características**:
- Todos los servicios en contenedores
- Volúmenes para persistencia de datos
- Hot reload activado
- DevTools disponibles
- Logs verbosos

### Staging Environment
```yaml
# docker-compose.staging.yml
version: "3.9"

services:
  backend:
    build: 
      context: ./backend
      target: production
    environment:
      NODE_ENV: staging
      DB_HOST: staging-mysql.region.rds.amazonaws.com
      REDIS_HOST: staging-redis.region.cache.amazonaws.com
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  frontend-store:
    build:
      context: ./frontend-store
      target: production
    environment:
      VITE_API_URL: https://staging-api.yourstore.com/api
      VITE_NODE_ENV: staging
```

### Producción con Docker Swarm
```yaml
# docker-compose.prod.yml
version: "3.9"

services:
  backend:
    image: yourregistry/ecommerce-backend:${VERSION}
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
    environment:
      NODE_ENV: production
    secrets:
      - jwt_secret
      - db_password
    networks:
      - backend_net
      - frontend_net

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.role == manager

secrets:
  jwt_secret:
    external: true
  db_password:
    external: true

networks:
  backend_net:
    driver: overlay
    encrypted: true
  frontend_net:
    driver: overlay
```

## Servicios Cloud

### AWS Deployment

#### RDS MySQL
```bash
# Crear instancia RDS
aws rds create-db-instance \
  --db-instance-identifier ecommerce-prod \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --storage-encrypted \
  --master-username admin \
  --master-user-password ${DB_PASSWORD} \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name ecommerce-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --auto-minor-version-upgrade
```

#### ElastiCache Redis
```bash
# Crear cluster Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id ecommerce-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --cache-parameter-group default.redis7 \
  --cache-subnet-group-name ecommerce-cache-subnet \
  --security-group-ids sg-xxxxxxxxx \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled
```

#### ECS Deployment
```yaml
# task-definition.json
{
  "family": "ecommerce-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/ecommerce-backend:latest",
      "portMappings": [
        {
          "containerPort": 5005,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:ecommerce/jwt-secret"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:ecommerce/db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecommerce-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:5005/ || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

### Azure Deployment

#### Azure Container Instances
```bash
# Crear grupo de recursos
az group create --name ecommerce-rg --location eastus

# Crear Azure Container Registry
az acr create --resource-group ecommerce-rg --name ecommerceacr --sku Basic

# Build y push imagen
az acr build --registry ecommerceacr --image ecommerce-backend:v1 ./backend

# Crear container instance
az container create \
  --resource-group ecommerce-rg \
  --name ecommerce-backend \
  --image ecommerceacr.azurecr.io/ecommerce-backend:v1 \
  --cpu 1 \
  --memory 1 \
  --registry-login-server ecommerceacr.azurecr.io \
  --registry-username ecommerceacr \
  --registry-password $(az acr credential show --name ecommerceacr --query "passwords[0].value" -o tsv) \
  --dns-name-label ecommerce-api \
  --ports 5005 \
  --environment-variables \
    NODE_ENV=production \
    PORT=5005
```

#### Azure Database for MySQL
```bash
# Crear servidor MySQL
az mysql flexible-server create \
  --resource-group ecommerce-rg \
  --name ecommerce-mysql \
  --location eastus \
  --admin-user ecommerceadmin \
  --admin-password ${MYSQL_PASSWORD} \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --storage-auto-grow Enabled \
  --backup-retention 7 \
  --high-availability Disabled

# Crear base de datos
az mysql flexible-server db create \
  --resource-group ecommerce-rg \
  --server-name ecommerce-mysql \
  --database-name ecommerce
```

### Google Cloud Deployment

#### Cloud Run
```yaml
# cloudbuild.yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ecommerce-backend', './backend']
    
  # Push to registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ecommerce-backend']
    
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'ecommerce-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/ecommerce-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '10'
      - '--set-env-vars'
      - 'NODE_ENV=production'
```

## CI/CD Pipelines

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: testpassword
          MYSQL_DATABASE: ecommerce_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend-admin && npm ci
          cd ../frontend-store && npm ci
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend-admin && npm test
          cd ../frontend-store && npm test
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 3306
          DB_USER: root
          DB_PASS: testpassword
          DB_NAME: ecommerce_test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}
      
      - name: Build and push frontend-store
        uses: docker/build-push-action@v5
        with:
          context: ./frontend-store
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-store:${{ github.sha }}
      
      - name: Deploy to production
        uses: azure/webapps-deploy@v2
        with:
          app-name: ecommerce-prod
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

services:
  - docker:dind
  - mysql:8.0

test:
  stage: test
  image: node:20
  before_script:
    - cd backend && npm ci
  script:
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA ./backend
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker build -t $CI_REGISTRY_IMAGE/frontend-store:$CI_COMMIT_SHA ./frontend-store
    - docker push $CI_REGISTRY_IMAGE/frontend-store:$CI_COMMIT_SHA

deploy:
  stage: deploy
  image: alpine/kubectl:latest
  script:
    - kubectl set image deployment/backend backend=$CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - kubectl set image deployment/frontend-store frontend-store=$CI_REGISTRY_IMAGE/frontend-store:$CI_COMMIT_SHA
    - kubectl rollout status deployment/backend
    - kubectl rollout status deployment/frontend-store
  only:
    - main
```

## Kubernetes Deployment

### Namespace y ConfigMap
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ecommerce

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ecommerce-config
  namespace: ecommerce
data:
  NODE_ENV: "production"
  PORT: "5005"
  DB_HOST: "mysql-service"
  REDIS_HOST: "redis-service"
  FRONTEND_ADMIN_URL: "https://admin.yourstore.com"
```

### Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: ecommerce-secrets
  namespace: ecommerce
type: Opaque
data:
  jwt-secret: <base64-encoded-secret>
  db-password: <base64-encoded-password>
  redis-password: <base64-encoded-password>
  resend-api-key: <base64-encoded-key>
```

### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/ecommerce-backend:latest
        ports:
        - containerPort: 5005
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: ecommerce-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: ecommerce-secrets
              key: jwt-secret
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ecommerce-secrets
              key: db-password
        livenessProbe:
          httpGet:
            path: /
            port: 5005
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 5005
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: ecommerce
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5005
  type: ClusterIP
```

### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.yourstore.com
    - www.yourstore.com
    - admin.yourstore.com
    secretName: ecommerce-tls
  rules:
  - host: api.yourstore.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
  - host: www.yourstore.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-store-service
            port:
              number: 80
  - host: admin.yourstore.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-admin-service
            port:
              number: 80
```

## Monitoreo y Observabilidad

### Prometheus + Grafana
```yaml
# k8s/monitoring.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: ecommerce
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: ecommerce
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'backend'
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - ecommerce
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: backend
```

### Logging con ELK Stack
```yaml
# k8s/elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: ecommerce
spec:
  serviceName: elasticsearch
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
        env:
        - name: discovery.type
          value: single-node
        - name: ES_JAVA_OPTS
          value: "-Xms512m -Xmx512m"
        ports:
        - containerPort: 9200
        volumeMounts:
        - name: elasticsearch-data
          mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
  - metadata:
      name: elasticsearch-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## Security en Producción

### HTTPS/TLS
```nginx
# nginx/ssl.conf
server {
    listen 443 ssl http2;
    server_name api.yourstore.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    location / {
        proxy_pass http://backend-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Network Policies
```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-netpol
  namespace: ecommerce
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend-store
    - podSelector:
        matchLabels:
          app: frontend-admin
    ports:
    - protocol: TCP
      port: 5005
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: mysql
    ports:
    - protocol: TCP
      port: 3306
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
```

## Backup y Disaster Recovery

### Automated Backups
```bash
#!/bin/bash
# backup-production.sh

DATE=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="ecommerce-backups"
BACKUP_DIR="/tmp/backups"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup MySQL
kubectl exec -n ecommerce deployment/mysql -- mysqldump \
  -u root -p${MYSQL_ROOT_PASSWORD} \
  --single-transaction --routines --triggers ecommerce \
  > $BACKUP_DIR/mysql_${DATE}.sql

# Backup Redis
kubectl exec -n ecommerce deployment/redis -- redis-cli BGSAVE
kubectl cp ecommerce/redis-pod:/data/dump.rdb $BACKUP_DIR/redis_${DATE}.rdb

# Comprimir backups
cd $BACKUP_DIR
tar -czf ecommerce_backup_${DATE}.tar.gz *.sql *.rdb

# Subir a S3
aws s3 cp ecommerce_backup_${DATE}.tar.gz s3://$S3_BUCKET/backups/

# Limpiar backups locales antiguos
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Limpiar backups S3 antiguos (mantener 30 días)
aws s3api list-objects-v2 --bucket $S3_BUCKET --prefix backups/ \
  --query 'Contents[?LastModified<=`'$(date -d '30 days ago' --iso-8601)'`].[Key]' \
  --output text | xargs -I {} aws s3 rm s3://$S3_BUCKET/{}
```

### Disaster Recovery Plan
```yaml
# disaster-recovery.md
## RTO (Recovery Time Objective): 1 hour
## RPO (Recovery Point Objective): 15 minutes

### Scenarios:
1. **Single Pod Failure**
   - Kubernetes auto-restart
   - No action required

2. **Node Failure**
   - Kubernetes reschedule pods
   - Monitor and validate

3. **Database Failure**
   - Restore from latest backup
   - Update connection strings
   - Validate data integrity

4. **Complete Cluster Failure**
   - Deploy new cluster
   - Restore from S3 backups
   - Update DNS records
   - Validate all services

### Contacts:
- DevOps Lead: +1-xxx-xxx-xxxx
- Database Admin: +1-xxx-xxx-xxxx
- Product Owner: +1-xxx-xxx-xxxx
```

## Performance Optimization

### Caching Strategy
```yaml
# Redis cluster for production
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
  namespace: ecommerce
spec:
  serviceName: redis-cluster
  replicas: 6
  selector:
    matchLabels:
      app: redis-cluster
  template:
    metadata:
      labels:
        app: redis-cluster
    spec:
      containers:
      - name: redis
        image: redis:7.4-alpine
        command:
        - redis-server
        - /etc/redis/redis.conf
        - --cluster-enabled
        - "yes"
        - --cluster-config-file
        - /data/nodes.conf
        ports:
        - containerPort: 6379
        - containerPort: 16379
        volumeMounts:
        - name: redis-data
          mountPath: /data
        - name: redis-config
          mountPath: /etc/redis
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi
```

### CDN Configuration
```yaml
# CloudFlare Workers or AWS CloudFront
# Para assets estáticos y API caching
cache_behavior:
  - path_pattern: "/static/*"
    target_origin_id: "s3-static-assets"
    cache_policy_id: "managed-caching-optimized"
    compress: true
  
  - path_pattern: "/api/products*"
    target_origin_id: "backend-api"
    cache_policy_id: "managed-caching-disabled-for-dynamic"
    ttl:
      default: 300  # 5 minutes
      max: 3600     # 1 hour
```

## Comandos de Deployment

### Docker Commands
```bash
# Build para producción
docker build -t ecommerce-backend:prod --target production ./backend

# Ejecutar en producción
docker run -d \
  --name ecommerce-backend \
  -p 5005:5005 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  ecommerce-backend:prod

# Health check
docker exec ecommerce-backend curl -f http://localhost:5005/ || exit 1
```

### Kubernetes Commands
```bash
# Deploy all services
kubectl apply -f k8s/ -n ecommerce

# Rolling update
kubectl set image deployment/backend backend=new-image:tag -n ecommerce
kubectl rollout status deployment/backend -n ecommerce

# Rollback
kubectl rollout undo deployment/backend -n ecommerce

# Scale services
kubectl scale deployment backend --replicas=5 -n ecommerce

# Port forwarding para debug
kubectl port-forward svc/backend-service 5005:80 -n ecommerce
```

### Monitoring Commands
```bash
# Ver logs en tiempo real
kubectl logs -f deployment/backend -n ecommerce

# Ver métricas de pods
kubectl top pods -n ecommerce

# Verificar servicios
kubectl get services -n ecommerce

# Debug conectividad
kubectl exec -it deployment/backend -n ecommerce -- nc -zv mysql-service 3306
```

Esta documentación de deployment proporciona una guía completa para desplegar la aplicación en diferentes entornos, desde desarrollo hasta producción escalable con Kubernetes.