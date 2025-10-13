# Ecommerce Project

Plataforma de ecommerce:
- Backend Node.js (Express + MySQL)
- Frontend React (tienda y portal admin)
- Infraestructura (Docker)

## Servicios
- **MySQL** → Base de datos
- **phpMyAdmin** → Administración de BD
- **Backend** → API REST Node.js
- **Frontend Store** → Tienda en React
- **Frontend Admin** → Panel administrativo en React
- **Redis** → Cache

## Uso
```bash
docker compose up --build

- **MySQL** →           localhost:3306
- **phpMyAdmin** →      http://localhost:8080
- **Backend** →         http://localhost:5005 →     responde {"message":"Backend running"}
- **Frontend Store** →  http://localhost:3000
- **Frontend Admin** →  http://localhost:3001
- **Redis** →           localhost:6379
```

## Produccion

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```