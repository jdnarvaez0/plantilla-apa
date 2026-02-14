@echo off
chcp 65001 >nul
echo 🎓 APA Template Generator - Docker Launcher
echo ===========================================
echo.

IF "%1"=="dev" (
    echo 🚀 Iniciando en modo DESARROLLO (hot reload)...
    echo.
    docker-compose -f docker-compose.dev.yml up --build
) ELSE IF "%1"=="prod" (
    echo 🚀 Iniciando en modo PRODUCCIÓN...
    echo.
    docker-compose up --build
) ELSE IF "%1"=="stop" (
    echo 🛑 Deteniendo servicios...
    echo.
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
) ELSE IF "%1"=="clean" (
    echo 🧹 Limpiando contenedores e imágenes...
    echo.
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
) ELSE (
    echo Uso: start.bat [comando]
    echo.
    echo Comandos disponibles:
    echo   start.bat dev    - Modo desarrollo (hot reload)
    echo   start.bat prod   - Modo producción
    echo   start.bat stop   - Detener todos los servicios
    echo   start.bat clean  - Limpiar todo (contenedores, imágenes, volúmenes)
    echo.
    echo Ejemplo:
    echo   start.bat dev
    echo.
    pause
)
