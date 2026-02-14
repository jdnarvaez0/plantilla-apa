#!/bin/bash

# APA Template Generator - Docker Launcher

set -e

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${CYAN}🎓 APA Template Generator - Docker Launcher${NC}"
    echo -e "${CYAN}===========================================${NC}"
    echo ""
    echo -e "${YELLOW}Uso: ./start.sh [comando]${NC}"
    echo ""
    echo -e "${GREEN}Comandos disponibles:${NC}"
    echo -e "  ${WHITE}dev${NC}     - Modo desarrollo (hot reload)"
    echo -e "  ${WHITE}prod${NC}    - Modo producción"
    echo -e "  ${WHITE}stop${NC}    - Detener todos los servicios"
    echo -e "  ${WHITE}clean${NC}   - Limpiar todo (contenedores, imágenes, volúmenes)"
    echo -e "  ${WHITE}logs${NC}    - Ver logs en tiempo real"
    echo -e "  ${WHITE}status${NC}  - Ver estado de los contenedores"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo -e "  ${GRAY}./start.sh dev${NC}"
    echo -e "  ${GRAY}./start.sh prod${NC}"
    echo ""
}

start_dev() {
    echo -e "${GREEN}🚀 Iniciando en modo DESARROLLO (hot reload)...${NC}"
    echo ""
    echo -e "${CYAN}URLs:${NC}"
    echo -e "  ${WHITE}Frontend:${NC} http://localhost:3001"
    echo -e "  ${WHITE}Backend:${NC}  http://localhost:3000"
    echo -e "  ${WHITE}API Docs:${NC} http://localhost:3000/api/docs"
    echo ""
    docker-compose -f docker-compose.dev.yml up --build
}

start_prod() {
    echo -e "${GREEN}🚀 Iniciando en modo PRODUCCIÓN...${NC}"
    echo ""
    echo -e "${CYAN}URLs:${NC}"
    echo -e "  ${WHITE}Frontend:${NC} http://localhost:3001"
    echo -e "  ${WHITE}Backend:${NC}  http://localhost:3000"
    echo -e "  ${WHITE}API Docs:${NC} http://localhost:3000/api/docs"
    echo ""
    docker-compose up --build
}

stop_services() {
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

clean_all() {
    echo -e "${YELLOW}🧹 Limpiando contenedores e imágenes...${NC}"
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

show_logs() {
    echo -e "${CYAN}📋 Mostrando logs...${NC}"
    docker-compose logs -f
}

show_status() {
    echo -e "${CYAN}📊 Estado de los contenedores:${NC}"
    docker-compose ps
    docker-compose -f docker-compose.dev.yml ps
}

# Main
case "${1:-help}" in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_services
        ;;
    clean)
        clean_all
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${YELLOW}Comando no reconocido: $1${NC}"
        show_help
        exit 1
        ;;
esac
