# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# ==========================================
# Stage 2: Build
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluidas devDependencies)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copiar código fuente
COPY . .

# Compilar
RUN npm run build

# ==========================================
# Stage 3: Production
# ==========================================
FROM node:20-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar package.json para tener info del proyecto
COPY --from=builder /app/package*.json ./

# Copiar dependencias de producción
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar build compilado
COPY --from=builder /app/dist ./dist

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Comando de inicio
CMD ["node", "dist/main.js"]
