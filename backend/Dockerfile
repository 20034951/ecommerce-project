# --- STAGE 1: build ---
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# --- STAGE 2: runtime ---
FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache netcat-openbsd mysql-client

COPY --from=build /app /app

RUN sed -i 's/\r$//' wait-mysql.sh && chmod +x wait-mysql.sh

# No forzar NODE_ENV, permitir que venga del docker-compose
EXPOSE 5005

CMD ["sh", "./wait-mysql.sh"]
