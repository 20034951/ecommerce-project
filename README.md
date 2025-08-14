# Ecommerce Project

Plataforma de ecommerce con:
- Backend Node.js (Express + MySQL)
- Frontend React (tienda y portal admin)
- Infraestructura (Docker)

## Servicios
- **MySQL** → Base de datos
- **phpMyAdmin** → Administración de BD
- **Backend** → API REST Node.js
- **Frontend Store** → Tienda en React
- **Frontend Admin** → Panel administrativo en React

## Uso
```bash
docker compose up --build

- **MySQL** →           localhost:3306
- **phpMyAdmin** →      http://localhost:8080
- **Backend** →         http://localhost:5000 →     responde {"message":"Backend running"}
- **Frontend Store** →  http://localhost:3000
- **Frontend Admin** →  http://localhost:3001