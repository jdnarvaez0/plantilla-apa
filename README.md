# 📄 Plantilla APA

Generador de documentos académicos con formato **APA 7ª edición**. Completa un formulario y descarga tu archivo `.docx` listo para entregar.

## ✨ Características

- 📝 Portada de estudiante con formato APA
- 📚 Referencias bibliográficas (libro, revista, web, tesis)
- 📐 Márgenes, fuente, interlineado y sangrías según normas APA 7
- 📥 Exportación directa a Word (.docx)
- 🐳 Docker para desarrollo y producción

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS + TypeScript |
| Frontend | Next.js 14 + Tailwind CSS + shadcn/ui |
| Generador DOCX | [docx](https://docx.js.org/) |
| Contenedores | Docker + Docker Compose |

## 🚀 Inicio Rápido

### Con Docker (recomendado)

```bash
# Modo desarrollo (hot reload)
.\start.ps1 dev        # Windows PowerShell
./start.sh dev         # Linux / Mac

# Modo producción
.\start.ps1 prod
```

### Sin Docker

```bash
# Backend
cd apa-generator-api
npm install --legacy-peer-deps
npm run start:dev

# Frontend (en otra terminal)
cd apa-generator-web
npm install
npm run dev
```

## 🌐 URLs

| Servicio | URL |
|----------|-----|
| Frontend | <http://localhost:3001> |
| Backend API | <http://localhost:3000/api/v1> |
| Swagger Docs | <http://localhost:3000/api/docs> |
| Health Check | <http://localhost:3000/api/v1/health> |

## 📁 Estructura del Proyecto

```
plantilla-apa/
├── apa-generator-api/       # Backend (NestJS)
│   └── src/
│       ├── modules/         # Documentos, Bibliografía, Templates
│       ├── shared/          # Generador DOCX, Formateador APA
│       └── config/          # Constantes APA 7
├── apa-generator-web/       # Frontend (Next.js)
│   └── src/
│       ├── app/             # Páginas
│       ├── components/      # UI + Formularios
│       └── services/        # Cliente API
├── docker-compose.yml       # Producción
├── docker-compose.dev.yml   # Desarrollo
└── start.ps1 / start.sh     # Launchers
```

## 📄 Licencia

MIT
