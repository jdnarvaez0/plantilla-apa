# 🐳 Guía de Docker - APA Template Generator

Esta guía te permite ejecutar toda la aplicación (backend + frontend) usando Docker.

## 📋 Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) (incluido en Docker Desktop)

## 🚀 Ejecutar la Aplicación

### Opción 1: Producción (Recomendado para probar)

```bash
# En la carpeta apa-template-generator
docker-compose up --build
```

Esto construirá y ejecutará:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:3001
- **Swagger Docs:** http://localhost:3000/api/docs

### Opción 2: Desarrollo (Con Hot Reload)

```bash
# En la carpeta apa-template-generator
docker-compose -f docker-compose.dev.yml up --build
```

Ventajas del modo desarrollo:
- ✅ Hot reload automático (cambios se reflejan inmediatamente)
- ✅ No necesitas tener Node.js instalado localmente
- ✅ Los cambios en el código se sincronizan con el contenedor

## 🛠️ Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (limpieza completa)
docker-compose down -v

# Reconstruir imágenes (después de cambios en Dockerfile)
docker-compose up --build

# Ejecutar en segundo plano (detached)
docker-compose up -d

# Ver estado de los contenedores
docker-compose ps
```

## 🌐 Accesos

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3001 | Interfaz de usuario |
| Backend API | http://localhost:3000/api/v1 | API REST |
| Swagger Docs | http://localhost:3000/api/docs | Documentación API |
| Health Check | http://localhost:3000/api/v1/health | Estado del backend |

## 📁 Estructura de Archivos Docker

```
apa-template-generator/
├── docker-compose.yml              # Producción
├── docker-compose.dev.yml          # Desarrollo (hot reload)
├── DOCKER.md                       # Esta guía
├── apa-generator-api/
│   ├── Dockerfile                  # Producción (multi-stage)
│   ├── Dockerfile.dev              # Desarrollo
│   └── .dockerignore
└── apa-generator-web/
    ├── Dockerfile                  # Producción (standalone)
    ├── Dockerfile.dev              # Desarrollo
    └── .dockerignore
```

## 🔧 Troubleshooting

### Error: "Port is already allocated"

Los puertos 3000 o 3001 están en uso por otra aplicación:

```bash
# Encontrar procesos usando los puertos
# Windows (PowerShell):
Get-NetTCPConnection -LocalPort 3000,3001

# Linux/Mac:
lsof -i :3000
lsof -i :3001

# Detener los procesos o cambiar los puertos en docker-compose.yml
```

### Error: "No space left on device"

Limpiar imágenes y contenedores no usados:

```bash
# Ver espacio usado por Docker
docker system df

# Limpiar todo (¡cuidado!)
docker system prune -a

# O solo contenedores detenidos e imágenes no usadas
docker system prune
```

### Los cambios no se reflejan (modo dev)

```bash
# Reiniciar los contenedores
docker-compose -f docker-compose.dev.yml restart

# O recrear desde cero
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

### Error de permisos (Linux/Mac)

```bash
# En sistemas Linux/Mac, puedes necesitar sudo
sudo docker-compose up

# O añadir tu usuario al grupo docker
sudo usermod -aG docker $USER
# Cerrar sesión y volver a iniciar
```

## 💾 Persistencia de Datos

Actualmente la aplicación **no persiste datos** en base de datos. Los documentos se generan en memoria y se envían directamente al cliente sin almacenarse en el servidor.

## 🔒 Seguridad en Producción

El `docker-compose.yml` está configurado para:
- ✅ Ejecutar servicios como usuario no-root
- ✅ Health checks para verificar el estado
- ✅ Reinicio automático si falla
- ✅ Redes aisladas entre servicios

Para un despliegue real en producción, considera:
- Usar HTTPS (certificados SSL)
- Configurar un reverse proxy (Nginx/Traefik)
- Variables de entorno seguras (no en el código)
- Limitar recursos (CPU/memoria) de los contenedores

## 📊 Monitoreo

```bash
# Ver uso de recursos
docker stats

# Ver logs en tiempo real
docker-compose logs -f

# Inspeccionar un contenedor
docker inspect apa-generator-backend
docker inspect apa-generator-frontend
```

## 🧹 Limpieza Completa

Para eliminar TODO (imágenes, contenedores, volúmenes, redes):

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar imágenes construidas
docker rmi apa-generator-backend apa-generator-frontend

# O limpieza global de Docker (¡cuidado!)
docker system prune -a --volumes
```

## 📝 Notas

- El build inicial puede tardar varios minutos (descarga de imágenes e instalación de dependencias)
- Las siguientes ejecuciones serán más rápidas gracias al caché de Docker
- El modo desarrollo monta los archivos locales, los cambios son inmediatos
- El modo producción crea una imagen optimizada, los cambios requieren rebuild
