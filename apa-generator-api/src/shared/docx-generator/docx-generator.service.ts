import { Injectable } from '@nestjs/common';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  PageNumber,
  BorderStyle,
} from 'docx';
import { APA_CONFIG } from '../../config/apa.config';
import { ApaFormatterService } from '../apa-formatter/apa-formatter.service';
import { DocumentConfig } from '../../common/interfaces/document-config.interface';
import { CoverPageType } from '../../common/enums/document-type.enum';
import { Reference } from '../../common/interfaces/reference.interface';
import { IDocxGeneratorService } from '../../common/interfaces/service.interfaces';

@Injectable()
export class DocxGeneratorService implements IDocxGeneratorService {
  constructor(private readonly apaFormatter: ApaFormatterService) {}

  /**
   * Genera un documento Word completo con formato APA 7ª Edición
   */
  async generateDocument(
    config: DocumentConfig,
    references?: Reference[],
  ): Promise<Buffer> {
    const sections = [];
    const isProfessional = config.coverPage?.type === CoverPageType.PROFESSIONAL;
    const runningHead = config.coverPage?.runningHead;

    // Opciones de secciones (por defecto todo true)
    const opts = {
      coverPage: config.sectionOptions?.coverPage !== false,
      abstract: config.sectionOptions?.abstract !== false,
      introduction: config.sectionOptions?.introduction !== false,
      references: config.sectionOptions?.references !== false,
    };

    // Portada (opcional)
    if (opts.coverPage) {
      if (isProfessional) {
        sections.push(this.createCoverPageProfessional(config));
      } else {
        sections.push(this.createCoverPageStudent(config));
      }
    }

    // Cuerpo del documento (segunda sección)
    sections.push({
      properties: {
        page: {
          margin: {
            top: APA_CONFIG.margins.top,
            bottom: APA_CONFIG.margins.bottom,
            left: APA_CONFIG.margins.left,
            right: APA_CONFIG.margins.right,
          },
          pageNumbers: {
            start: opts.coverPage ? 2 : 1,
          },
        },
      },
      children: this.createBodyContent(config, references, opts),
      headers: {
        // En portada profesional: running head + número de página
        // En estudiante: solo número de página
        default: this.createHeader(isProfessional, runningHead),
      },
    });

    const doc = new Document({
      // Estilos default del documento — fuerza Times New Roman 12pt como base
      styles: {
        default: {
          document: {
            run: {
              font: APA_CONFIG.typography.font,
              size: APA_CONFIG.typography.size,
            },
            paragraph: {
              spacing: {
                line: APA_CONFIG.typography.lineSpacing,
                before: 0,
                after: 0,
              },
            },
          },
        },
      },
      sections: sections as any,
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Portada para VERSIÓN ESTUDIANTE — APA 7ª Edición
   *
   * Según APA 7th Ed. (Section 2.3):
   * - Título en negrita, centrado, en la mitad superior de la página
   *   (3-4 líneas doble espacio desde el margen superior)
   * - Doble espacio debajo del título
   * - Nombre del autor (nombre completo, sin títulos/grados)
   * - Afiliación institucional (Departamento, Universidad)
   * - Curso (código y nombre)
   * - Nombre del instructor
   * - Fecha de entrega
   * - Todo centrado, doble espacio
   * - Número de página "1" en la esquina superior derecha
   * - Sin running head
   */
  /**
   * Resolves authors from the config, handling both legacy single `author`
   * and new `authors` array fields.
   */
  private resolveAuthors(
    config: DocumentConfig,
  ): { firstName: string; middleName?: string; lastName: string }[] {
    if (config.authors && config.authors.length > 0) return config.authors;
    if (config.author) return [config.author];
    return [{ firstName: 'Autor', lastName: 'Desconocido' }];
  }

  private createCoverPageStudent(config: DocumentConfig): any {
    const { title, institution, course, professor, dueDate } = config;
    const authors = this.resolveAuthors(config);
    const { typography } = APA_CONFIG;
    const lineSpacing = typography.lineSpacing; // 480 = doble espacio

    const paragraphs: Paragraph[] = [];

    // === Espacio superior ===
    // APA requiere el título 3-4 líneas doble espacio desde el margen superior
    // Con doble espacio (480 twips por línea), 3 líneas vacías colocan el título correctamente
    for (let i = 0; i < 3; i++) {
      paragraphs.push(
        new Paragraph({
          spacing: { line: lineSpacing, before: 0, after: 0 },
        }),
      );
    }

    // === Título ===
    // Centrado, negrita, mismo tamaño que el texto (12pt), doble espacio
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: lineSpacing, before: 0, after: 0 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            font: typography.font,
            size: typography.size,
          }),
        ],
      }),
    );

    // Línea en blanco después del título (doble espacio)
    paragraphs.push(
      new Paragraph({
        spacing: { line: lineSpacing, before: 0, after: 0 },
      }),
    );

    // === Nombres de los autores ===
    // APA 7th Ed.: Cada autor en su propia línea, nombre completo, sin títulos ni grados
    for (const author of authors) {
      const fullName = `${author.firstName}${
        author.middleName ? ' ' + author.middleName : ''
      } ${author.lastName}`;
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: fullName,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Afiliación institucional ===
    // Departamento/Programa, Universidad (en la misma línea o separado)
    if (institution) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: institution,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Curso ===
    if (course) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: course,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Instructor ===
    if (professor) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: professor,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Fecha de entrega ===
    if (dueDate) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: this.apaFormatter.formatDate(dueDate),
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    return {
      properties: {
        page: {
          margin: {
            top: APA_CONFIG.margins.top,
            bottom: APA_CONFIG.margins.bottom,
            left: APA_CONFIG.margins.left,
            right: APA_CONFIG.margins.right,
          },
          pageNumbers: {
            start: 1,
          },
        },
      },
      children: paragraphs,
      headers: {
        // Número de página en la esquina superior derecha (empieza en 1)
        // Sin running head para trabajos de estudiante
        default: this.createHeader(),
      },
    };
  }

  /**
   * Portada para VERSIÓN PROFESIONAL — APA 7ª Edición
   *
   * Según APA 7th Ed. (Section 2.4):
   * - Running head: título abreviado (max 50 chars) en mayúsculas, alineado a la izquierda
   * - Número de página en la esquina superior derecha (página 1)
   * - Título centrado, negrita, 3-4 líneas doble espacio desde el margen superior
   * - Nombre del autor (nombre completo)
   * - Afiliación institucional
   * - Author note al final de la página (opcional)
   * - Todo centrado, doble espacio
   */
  private createCoverPageProfessional(config: DocumentConfig): any {
    const { title, institution, coverPage } = config;
    const authors = this.resolveAuthors(config);
    const { typography } = APA_CONFIG;
    const lineSpacing = typography.lineSpacing;
    const runningHead = coverPage?.runningHead || this.generateRunningHead(title);

    const paragraphs: Paragraph[] = [];

    // === Espacio superior ===
    // 3-4 líneas doble espacio desde el margen superior
    for (let i = 0; i < 3; i++) {
      paragraphs.push(
        new Paragraph({
          spacing: { line: lineSpacing, before: 0, after: 0 },
        }),
      );
    }

    // === Título ===
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: lineSpacing, before: 0, after: 0 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            font: typography.font,
            size: typography.size,
          }),
        ],
      }),
    );

    // Línea en blanco después del título
    paragraphs.push(
      new Paragraph({
        spacing: { line: lineSpacing, before: 0, after: 0 },
      }),
    );

    // === Nombres de los autores ===
    for (const author of authors) {
      const fullName = `${author.firstName}${
        author.middleName ? ' ' + author.middleName : ''
      } ${author.lastName}`;
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: fullName,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Afiliación institucional ===
    if (institution) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: institution,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    // === Author Note ===
    // Al final de la página, centrado, precedido por "Author Note"
    if (coverPage?.authorNote) {
      // Agregar espacios para empujar el author note hacia abajo
      // APA no especifica exactamente dónde, pero debe estar al final
      for (let i = 0; i < 4; i++) {
        paragraphs.push(
          new Paragraph({
            spacing: { line: lineSpacing, before: 0, after: 0 },
          }),
        );
      }

      // Título "Author Note" centrado, negrita
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: 'Author Note',
              bold: true,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );

      // Contenido del author note
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: coverPage.authorNote,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    }

    return {
      properties: {
        page: {
          margin: {
            top: APA_CONFIG.margins.top,
            bottom: APA_CONFIG.margins.bottom,
            left: APA_CONFIG.margins.left,
            right: APA_CONFIG.margins.right,
          },
          pageNumbers: {
            start: 1,
          },
        },
      },
      children: paragraphs,
      headers: {
        // Header profesional: running head a la izquierda + número de página a la derecha
        default: this.createProfessionalHeader(runningHead),
      },
    };
  }

  /**
   * Genera un running head automático a partir del título
   * Toma las primeras palabras significativas, máximo 50 caracteres
   */
  private generateRunningHead(title: string): string {
    // Eliminar palabras comunes del inicio
    const skipWords = ['the', 'a', 'an', 'el', 'la', 'los', 'las', 'un', 'una'];
    const words = title.split(/\s+/);
    
    let result = '';
    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '').toUpperCase();
      if (!cleanWord) continue;
      
      // Si es la primera palabra y está en skipWords, saltarla
      if (result === '' && skipWords.includes(cleanWord.toLowerCase())) {
        continue;
      }
      
      const newResult = result ? `${result} ${cleanWord}` : cleanWord;
      if (newResult.length > 50) break;
      result = newResult;
    }
    
    return result || title.substring(0, 50).toUpperCase();
  }

  /**
   * Crea el encabezado para páginas del cuerpo del documento
   * APA 7th Ed.: Para portada profesional, incluye running head
   */
  private createHeader(
    includeRunningHead: boolean = false,
    runningHeadText?: string,
  ): Header {
    const { typography } = APA_CONFIG;

    // Si es portada profesional y hay running head, mostrarlo a la izquierda
    if (includeRunningHead && runningHeadText) {
      return new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: runningHeadText,
                font: typography.font,
                size: typography.size,
              }),
            ],
          }),
        ],
      });
    }

    // Portada estudiante: solo número de página
    return new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              children: [PageNumber.CURRENT],
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Crea el encabezado para la portada profesional
   * APA 7th Ed.: Running head a la izquierda + número de página a la derecha
   */
  private createProfessionalHeader(runningHead: string): Header {
    const { typography } = APA_CONFIG;

    return new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: runningHead,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              children: [PageNumber.CURRENT],
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Crea el contenido del cuerpo del documento
   * APA 7th Ed.:
   * - Título repetido en la primera página del cuerpo, centrado, negrita
   * - Doble espacio en todo el texto
   * - Sangría de primera línea de 0.5 pulgadas en cada párrafo
   * - Abstract en su propia página (si existe)
   * - Keywords en itálica debajo del abstract
   */
  private createBodyContent(
    config: DocumentConfig,
    references?: Reference[],
    opts?: { abstract?: boolean; introduction?: boolean; references?: boolean },
  ): Paragraph[] {
    const { typography } = APA_CONFIG;
    const lineSpacing = typography.lineSpacing;
    const paragraphs: Paragraph[] = [];

    // Por defecto todo true si no se especifican opciones
    const includeAbstract = opts?.abstract !== false;
    const includeIntroduction = opts?.introduction !== false;
    const includeReferences = opts?.references !== false;

    // === Abstract (Resumen) ===
    // APA 7th Ed.: Abstract va en su propia página después de la portada
    if (includeAbstract && config.abstract) {
      // Título "Resumen" centrado, negrita
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: 'Resumen',
              bold: true,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );

      // Texto del abstract - sin sangría en primera línea (excepción APA)
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: config.abstract,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );

      // Keywords
      if (config.keywords && config.keywords.length > 0) {
        paragraphs.push(
          new Paragraph({
            indent: { firstLine: 720 }, // Sangría de 0.5in
            spacing: { line: lineSpacing, before: 0, after: 0 },
            children: [
              new TextRun({
                text: 'Palabras clave: ',
                italics: true,
                font: typography.font,
                size: typography.size,
              }),
              new TextRun({
                text: config.keywords.join(', '),
                italics: true,
                font: typography.font,
                size: typography.size,
              }),
            ],
          }),
        );
      }

      // Salto de página después del abstract
      paragraphs.push(
        new Paragraph({
          pageBreakBefore: true,
          spacing: { line: lineSpacing, before: 0, after: 0 },
        }),
      );
    }

    // === Título repetido al inicio del cuerpo ===
    // APA 7th Ed.: El título se repite, centrado, negrita, en la primera página del cuerpo
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: lineSpacing, before: 0, after: 0 },
        children: [
          new TextRun({
            text: config.title,
            bold: true,
            font: typography.font,
            size: typography.size,
          }),
        ],
      }),
    );

    // === Introducción ===
    // Contenido real del documento proporcionado por el usuario
    if (includeIntroduction && config.introduction) {
      // Dividir la introducción en párrafos (por saltos de línea)
      const introParagraphs = config.introduction
        .split('\n\n')
        .filter((p) => p.trim().length > 0);

      for (const introPara of introParagraphs) {
        paragraphs.push(
          new Paragraph({
            indent: { firstLine: 720 }, // Sangría de primera línea
            spacing: { line: lineSpacing, before: 0, after: 0 },
            children: [
              new TextRun({
                text: introPara.trim(),
                font: typography.font,
                size: typography.size,
              }),
            ],
          }),
        );
      }
    } else if (!config.introduction) {
      // Párrafo placeholder si no hay introducción
      paragraphs.push(
        new Paragraph({
          indent: { firstLine: 720 },
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: '[El contenido de tu documento va aquí. Cada párrafo debe comenzar con una sangría de 0.5 pulgadas y usar doble espacio.]',
              font: typography.font,
              size: typography.size,
              color: '808080',
            }),
          ],
        }),
      );
    }

    // === Referencias (si existen) ===
    if (includeReferences && references && references.length > 0) {
      // Salto de página antes de referencias
      // APA 7th Ed.: Referencias empiezan en una nueva página
      paragraphs.push(
        new Paragraph({
          pageBreakBefore: true,
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: 'Referencias',
              bold: true,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );

      // Ordenar referencias alfabéticamente por apellido del primer autor
      const sortedReferences = [...references].sort((a, b) => {
        const authorA = a.authors[0]?.lastName || '';
        const authorB = b.authors[0]?.lastName || '';
        return authorA.localeCompare(authorB);
      });

      // Cada referencia con sangría francesa (hanging indent)
      // APA 7th Ed.: Sangría francesa de 0.5 pulgadas, doble espacio
      sortedReferences.forEach((ref) => {
        const formattedRef = this.apaFormatter.formatReference(ref);
        paragraphs.push(
          new Paragraph({
            spacing: { line: lineSpacing, before: 0, after: 0 },
            indent: { left: 720, hanging: 720 }, // Sangría francesa
            children: [
              new TextRun({
                text: formattedRef,
                font: typography.font,
                size: typography.size,
              }),
            ],
          }),
        );
      });
    }

    return paragraphs;
  }

  /**
   * Crea un documento simple de prueba
   */
  async generateTestDocument(): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Documento de prueba APA',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Este es un documento de prueba generado con el formato APA 7ª edición.',
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { line: 480 },
            }),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }
}
