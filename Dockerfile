# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# En las versiones más nuevas de AdonisJS 6/7, el comando es simplemente este:
RUN node ace build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copiamos lo necesario desde el builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --omit=dev

EXPOSE 3333

# El servidor se arranca desde build/bin/server.js
CMD ["node", "build/bin/server.js"]
