# --- STAGE 1: build ---
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para Vite)
RUN npm ci --silent && npm cache clean --force

COPY . .

# --- STAGE 2: runtime ---
FROM node:20-alpine

# Instalar dumb-init y crear usuario
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copiar archivos y cambiar ownership
COPY --from=build --chown=nextjs:nodejs /app /app

# Cambiar a usuario no root
USER nextjs

# Variables de entorno
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV CHOKIDAR_USEPOLLING=true    
ENV WATCHPACK_POLLING=true        

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]
