# APA Template Generator - Docker Launcher
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "stop", "clean", "logs", "status")]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🎓 APA Template Generator - Docker Launcher" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\start.ps1 -Command [comando]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Green
    Write-Host "  dev     - Modo desarrollo (hot reload)" -ForegroundColor White
    Write-Host "  prod    - Modo producción" -ForegroundColor White
    Write-Host "  stop    - Detener todos los servicios" -ForegroundColor White
    Write-Host "  clean   - Limpiar todo (contenedores, imágenes, volúmenes)" -ForegroundColor White
    Write-Host "  logs    - Ver logs en tiempo real" -ForegroundColor White
    Write-Host "  status  - Ver estado de los contenedores" -ForegroundColor White
    Write-Host ""
    Write-Host "Ejemplos:" -ForegroundColor Yellow
    Write-Host "  .\start.ps1 -Command dev" -ForegroundColor Gray
    Write-Host "  .\start.ps1 dev" -ForegroundColor Gray
    Write-Host ""
}

function Start-Dev {
    Write-Host "🚀 Iniciando en modo DESARROLLO (hot reload)..." -ForegroundColor Green
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3001" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
    Write-Host "  API Docs: http://localhost:3000/api/docs" -ForegroundColor White
    Write-Host ""
    docker-compose -f docker-compose.dev.yml up --build
}

function Start-Prod {
    Write-Host "🚀 Iniciando en modo PRODUCCIÓN..." -ForegroundColor Green
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3001" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
    Write-Host "  API Docs: http://localhost:3000/api/docs" -ForegroundColor White
    Write-Host ""
    docker-compose up --build
}

function Stop-Services {
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Yellow
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    Write-Host "✅ Servicios detenidos" -ForegroundColor Green
}

function Clear-All {
    Write-Host "🧹 Limpiando contenedores e imágenes..." -ForegroundColor Yellow
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Mostrando logs..." -ForegroundColor Cyan
    docker-compose logs -f
}

function Show-Status {
    Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
    docker-compose ps
    docker-compose -f docker-compose.dev.yml ps
}

# Main
switch ($Command) {
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "stop" { Stop-Services }
    "clean" { Clear-All }
    "logs" { Show-Logs }
    "status" { Show-Status }
    default { Show-Help }
}
