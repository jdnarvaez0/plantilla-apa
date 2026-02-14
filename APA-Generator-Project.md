# 📄 APA Template Generator - Documento de Inicio

> **Versión:** 1.0  
> **Fecha:** Febrero 2026  
> **Estado:** Planificación

---

## 1. 📋 Resumen Ejecutivo

Aplicación web para generar documentos académicos con formato APA 7ª edición. El usuario completa un formulario, selecciona el tipo de documento, y el sistema genera un archivo `.docx` listo para entregar con todas las normas aplicadas.

### Alcance del MVP
- Generación de portadas APA (estudiante)
- Templates de documentos comunes (ensayo, trabajo de investigación)
- Citas y referencias bibliográficas en formato APA
- Exportación a Word (.docx)

---

## 2. 🎯 Requerimientos Funcionales

### RF1. Gestión de Templates
| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF1.1 | Crear documento tipo "Ensayo" con portada APA | Alta |
| RF1.2 | Crear documento tipo "Trabajo de Investigación" | Alta |
| RF1.3 | Crear documento tipo "Artículo de Revisión" | Media |
| RF1.4 | Soporte para portada de estudiante vs. profesional | Media |

### RF2. Normas APA Implementadas
| Norma | Descripción | Estado MVP |
|-------|-------------|------------|
| APA-001 | Márgenes: 2.54 cm (1 pulgada) todos los lados | ✅ Incluido |
| APA-002 | Fuente: Times New Roman 12pt | ✅ Incluido |
| APA-003 | Interlineado: Doble (2.0) | ✅ Incluido |
| APA-004 | Numeración: Esquina superior derecha | ✅ Incluido |
| APA-005 | Sangría: 1.27 cm en párrafos | ✅ Incluido |
| APA-006 | Sangría francesa en referencias | ✅ Incluido |
| APA-007 | Running head (solo profesional) | 🔶 Fase 2 |
| APA-008 | Título en mayúsculas centrado | ✅ Incluido |

### RF3. Formulario de Entrada
| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| Tipo de documento | Select | Sí |
| Título del trabajo | Text | Sí |
| Nombre del autor | Text | Sí |
| Institución | Text | Sí |
| Curso/Asignatura | Text | No |
| Profesor | Text | No |
| Fecha de entrega | Date | Sí |

### RF4. Referencias Bibliográficas
| Funcionalidad | Prioridad |
|---------------|-----------|
| Agregar referencias manualmente | Alta |
| Formatos: Libro, Artículo, Web, Tesis | Alta |
| Ordenar automáticamente alfabéticamente | Alta |
| Sangría francesa aplicada | Alta |
| Importar desde BibTeX/RIS | 🔶 Fase 2 |

### RF5. Exportación
| Formato | Prioridad |
|---------|-----------|
| .docx (Microsoft Word) | Alta |
| .pdf | 🔶 Fase 2 |
| .odt | Baja |

---

## 3. 🔧 Requerimientos No Funcionales

| ID | Requerimiento | Criterio |
|----|---------------|----------|
| RNF1 | Tiempo de respuesta | Generación < 3 segundos |
| RNF2 | Disponibilidad | 99% uptime |
| RNF3 | Responsive | Funcional en móvil y desktop |
| RNF4 | Accesibilidad | WCAG 2.1 AA |
| RNF5 | Seguridad | No almacenar documentos en servidor (procesamiento en memoria) |

---

## 4. 🏗️ Arquitectura del Sistema

### 4.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Frontend)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Next.js    │  │  TailwindCSS │  │    shadcn/ui Forms   │  │
│  │  (App Router)│  │   + Lucide   │  │   (React Hook Form)  │  │
│  └──────┬───────┘  └──────────────┘  └──────────────────────┘  │
└─────────┼────────────────────────────────────────────────────────┘
          │ HTTP/REST
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVIDOR (NestJS)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Gateway                          │    │
│  │              (Validación, Rate Limiting)                │    │
│  └────────────────────┬────────────────────────────────────┘    │
│                       │                                          │
│  ┌────────────────────┴────────────────────────────────────┐    │
│  │                   Módulos de Dominio                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │    │
│  │  │  Documents  │ │  Templates  │ │   Bibliography      │ │    │
│  │  │   Module    │ │   Module    │ │     Module          │ │    │
│  │  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘ │    │
│  │         └─────────────────┴──────────────────┘            │    │
│  │                            │                              │    │
│  │                   ┌────────┴────────┐                     │    │
│  │                   │  Core Service   │                     │    │
│  │                   │ (APA Formatter) │                     │    │
│  │                   └────────┬────────┘                     │    │
│  └────────────────────────────┼──────────────────────────────┘    │
│                               │                                   │
│  ┌────────────────────────────┼──────────────────────────────┐    │
│  │                   Infraestructura                          │    │
│  │  ┌─────────────────────────┴──────────────────────────┐   │    │
│  │  │              docx Library (Generador)               │   │    │
│  │  │         - DocumentAssembler                        │   │    │
│  │  │         - APAStyleEngine                           │   │    │
│  │  │         - BufferExporter                           │   │    │
│  │  └────────────────────────────────────────────────────┘   │    │
│  └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Flujo de Datos

```
Usuario → Formulario → Validación DTO → Service → APA Formatter → docx → Buffer → Download
```

### 4.3 Estructura de Carpetas (Backend)

```
apa-generator-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── apa.config.ts          # Constantes de formato APA
│   ├── modules/
│   │   ├── documents/
│   │   │   ├── documents.module.ts
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   └── dto/
│   │   │       └── create-document.dto.ts
│   │   ├── templates/
│   │   │   ├── templates.module.ts
│   │   │   ├── templates.service.ts
│   │   │   └── entities/
│   │   │       └── template.entity.ts
│   │   └── bibliography/
│   │       ├── bibliography.module.ts
│   │       ├── bibliography.service.ts
│   │       └── dto/
│   │           └── reference.dto.ts
│   ├── shared/
│   │   ├── apa-formatter/         # Motor de formateo APA
│   │   │   ├── apa-formatter.service.ts
│   │   │   ├── apa-rules.ts
│   │   │   └── formatters/
│   │   │       ├── margins.formatter.ts
│   │   │       ├── typography.formatter.ts
│   │   │       └── citations.formatter.ts
│   │   └── docx-generator/        # Wrapper de la librería docx
│   │       ├── docx-generator.service.ts
│   │       └── templates/
│   │           ├── essay.template.ts
│   │           └── research-paper.template.ts
│   └── common/
│       ├── enums/
│       │   ├── document-type.enum.ts
│       │   └── citation-style.enum.ts
│       └── interfaces/
│           └── document-config.interface.ts
├── test/
└── package.json
```

### 4.4 Estructura de Carpetas (Frontend)

```
apa-generator-web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Landing + Formulario principal
│   ├── globals.css
│   └── lib/
│       └── utils.ts
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── form.tsx
│   ├── forms/
│   │   ├── document-form.tsx      # Formulario principal
│   │   └── reference-form.tsx     # Formulario de referencias
│   └── preview/
│       └── document-preview.tsx   # Vista previa del documento
├── hooks/
│   └── use-document-generator.ts
├── services/
│   └── api.ts
├── types/
│   └── document.types.ts
└── package.json
```

---

## 5. 🛠️ Stack Tecnológico

### Backend
| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| Framework | NestJS | ^10.x | Arquitectura modular, TypeScript nativo, excelente documentación |
| Generador DOCX | docx | ^8.x | Librería más madura para Node.js, soporte completo de estilos |
| Validación | class-validator | ^0.14 | Decoradores para validación de DTOs |
| Testing | Jest | Incluido | Framework de testing integrado en NestJS |
| API Docs | Swagger/OpenAPI | ^7.x | Documentación automática de endpoints |

### Frontend
| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| Framework | Next.js | ^14.x | App Router, SSR, mismo ecosistema React que shadcn |
| Lenguaje | TypeScript | ^5.x | Type safety, consistencia con backend |
| Estilos | Tailwind CSS | ^3.x | Utility-first, rápido desarrollo |
| Componentes | shadcn/ui | Latest | Componentes accesibles, personalizables |
| Formularios | React Hook Form | ^7.x | Performance, validación integrada |
| Validación | Zod | ^3.x | Schema validation TypeScript-first |
| Iconos | Lucide React | Latest | Consistente con shadcn/ui |
| HTTP Client | Fetch / SWR | Native | Para llamadas al backend |

### Herramientas de Desarrollo
| Herramienta | Propósito |
|-------------|-----------|
| ESLint + Prettier | Linting y formateo de código |
| Husky | Git hooks para calidad de código |
| Docker | Contenerización (opcional para despliegue) |

---

## 6. 📐 Modelo de Datos

### 6.1 Entidades Principales

```typescript
// Document Configuration
interface DocumentConfig {
  id: string;
  type: DocumentType;           // ESSAY | RESEARCH_PAPER | REVIEW
  title: string;
  author: Author;
  institution: string;
  course?: string;
  professor?: string;
  dueDate: Date;
  coverPage: CoverPageConfig;
  references: Reference[];
}

// Author
interface Author {
  firstName: string;
  middleName?: string;
  lastName: string;
}

// Reference Types
interface Reference {
  id: string;
  type: ReferenceType;          // BOOK | JOURNAL | WEBSITE | THESIS
  authors: Author[];
  year: number;
  title: string;
  // Campos específicos por tipo...
}

// APA Format Constants
interface APAFormatConfig {
  margins: {
    top: number;      // 2.54 cm = 1440 twips
    bottom: number;
    left: number;
    right: number;
  };
  typography: {
    font: 'Times New Roman';
    size: 12;         // pt
    lineSpacing: 2.0; // doble
  };
  indentation: {
    paragraph: number;    // 1.27 cm
    reference: number;    // sangría francesa
  };
}
```

### 6.2 Tipos de Referencias APA

```typescript
enum ReferenceType {
  BOOK = 'book',
  JOURNAL_ARTICLE = 'journal_article',
  WEBSITE = 'website',
  THESIS = 'thesis',
  CONFERENCE_PAPER = 'conference_paper',
  REPORT = 'report'
}

// Ejemplo: Libro
interface BookReference extends Reference {
  type: ReferenceType.BOOK;
  publisher: string;
  edition?: string;
  volume?: string;
  doi?: string;
}

// Ejemplo: Artículo de revista
interface JournalReference extends Reference {
  type: ReferenceType.JOURNAL_ARTICLE;
  journalName: string;
  volume: string;
  issue?: string;
  pages: string;
  doi?: string;
}
```

---

## 7. 🔌 API Endpoints

### 7.1 Documents API

```yaml
POST /api/v1/documents/generate
  description: Genera un documento Word con formato APA
  request:
    content-type: application/json
    body: DocumentConfig
  response:
    200:
      content-type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
      body: Blob (archivo .docx)
    400:
      description: Datos de entrada inválidos
    422:
      description: Error en formato APA

GET /api/v1/templates
  description: Obtiene lista de templates disponibles
  response:
    200:
      body: Template[]

GET /api/v1/templates/:id
  description: Obtiene detalle de un template
  response:
    200:
      body: Template
```

### 7.2 Bibliography API

```yaml
POST /api/v1/bibliography/format
  description: Formatea una lista de referencias en APA
  request:
    body: Reference[]
  response:
    200:
      body:
        formatted: string[]  # Referencias formateadas

POST /api/v1/bibliography/validate
  description: Valida referencias según normas APA
  request:
    body: Reference[]
  response:
    200:
      body:
        valid: boolean
        errors: ValidationError[]
```

---

## 8. 🚀 Roadmap

### Fase 1: MVP (4-6 semanas)
- [ ] Setup proyecto NestJS + Next.js
- [ ] Implementar generador de portada APA estudiante
- [ ] Implementar template básico de ensayo
- [ ] Formulario de referencias (libro, web, artículo)
- [ ] Exportación a .docx
- [ ] Vista previa básica

### Fase 2: Mejoras Core (2-3 semanas)
- [ ] Portada profesional (con running head)
- [ ] Más tipos de referencias
- [ ] Importación BibTeX
- [ ] Template de trabajo de investigación
- [ ] Modo oscuro en frontend

### Fase 3: Diferenciadores (3-4 semanas)
- [ ] Integración con IA (corrector de citas)
- [ ] Extensión de navegador para capturar referencias
- [ ] Exportación PDF
- [ ] Autenticación y guardado de documentos

### Fase 4: Escalabilidad
- [ ] API pública
- [ ] Integraciones con Zotero/Mendeley
- [ ] Mobile app

---

## 9. 📦 Entregables del MVP

| Entregable | Descripción |
|------------|-------------|
| Backend API | Servidor NestJS con endpoints de generación |
| Web App | Aplicación Next.js con formulario y descarga |
| Templates | 2 templates funcionales (ensayo, investigación) |
| Documentación | README de instalación y uso |
| Tests | Cobertura > 70% en módulos críticos |

---

## 10. ⚠️ Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Librería docx no soporta formato específico | Media | Alto | Validar capacidades antes, considerar alternativas (Pandoc) |
| Normas APA cambian | Baja | Medio | Arquitectura configurable para actualizar reglas |
| Rendimiento con documentos grandes | Media | Medio | Implementar streaming, límites de tamaño |
| Compatibilidad Word | Media | Medio | Testing en múltiples versiones de Word |

---

## 11. 🎨 Mockups/UI Reference

### Página Principal
```
┌─────────────────────────────────────────────────────┐
│  🎓 APA Template Generator                [GitHub]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Genera documentos académicos con formato APA      │
│   profesional en segundos                           │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  📄 Tipo de Documento                       │   │
│   │  [Ensayo ▼]                                 │   │
│   │                                             │   │
│   │  📋 Información del Documento               │   │
│   │  Título: [________________________]         │   │
│   │  Autor:  [________________________]         │   │
│   │  Institución: [___________________]         │   │
│   │  ...                                        │   │
│   │                                             │   │
│   │  📚 Referencias Bibliográficas              │   │
│   │  [+ Agregar Referencia]                     │   │
│   │  1. García, J. (2023). Título...            │   │
│   │                                             │   │
│   │     [✨ Generar Documento]                  │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   Vista Previa:                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  [Preview del documento]                    │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 12. 📚 Recursos y Referencias

### Normas APA 7ª Edición
- [APA Style Website](https://apastyle.apa.org/)
- [Guía de Referencias APA](https://apastyle.apa.org/style-grammar-guidelines/references)

### Documentación Técnica
- [NestJS Docs](https://docs.nestjs.com/)
- [docx Library](https://docx.js.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 13. ✅ Checklist de Inicio

Antes de comenzar el desarrollo:

- [ ] Revisar y aprobar este documento
- [ ] Instalar Node.js 18+ y npm/yarn/pnpm
- [ ] Crear repositorios Git (backend y frontend)
- [ ] Configurar ESLint + Prettier en ambos proyectos
- [ ] Crear estructura de carpetas inicial
- [ ] Instalar dependencias base
- [ ] Configurar husky + lint-staged

---

## Notas

*Este documento es un trabajo en vivo y puede ser actualizado durante el desarrollo del proyecto.*

**Próximo paso recomendado:** Crear el proyecto NestJS y configurar la librería `docx` con una prueba de concepto de generación de documento APA simple.
