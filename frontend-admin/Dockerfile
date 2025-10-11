# Dockerfile para Frontend Admin (Desarrollo)
FROM node:22-alpine

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copiar archivos de configuración como root
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instalar dependencias como root
RUN npm install

# Cambiar ownership de todos los archivos al usuario no-root
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno para Vite
ENV HOST=0.0.0.0
ENV PORT=3000
ENV VITE_HOST=0.0.0.0

# Comando de inicio con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]