import { Injectable } from '@nestjs/common';
import * as docx from 'docx';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber, NumberFormat } from 'docx';
import { APA_CONFIG } from '../../config/apa.config';
import { ApaFormatterService } from '../apa-formatter/apa-formatter.service';
import { DocumentConfig } from '../../common/interfaces/document-config.interface';
import { CoverPageType } from '../../common/enums/document-type.enum';
import { Reference } from '../../common/interfaces/reference.interface';

@Injectable()
export class DocxGeneratorService {
  constructor(private readonly apaFormatter: ApaFormatterService) { }

  /**
   * Genera un documento Word completo con formato APA 7ª Edición
   */
  async generateDocument(
    config: DocumentConfig,
    references?: Reference[],
  ): Promise<Buffer> {
    const sections = [];

    // Portada (siempre la primera sección)
    if (config.coverPage?.type === CoverPageType.STUDENT) {
      sections.push(this.createCoverPageStudent(config));
    } else {
      sections.push(this.createCoverPageProfessional(config));
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
            start: 2,
          },
        },
      },
      children: this.createBodyContent(config, references),
      headers: {
        default: this.createHeader(),
      },
    });

    const doc = new Document({
      // Estilos default del documento — fuerza Times New Roman 12pt como base
      // Sin esto, Word puede aplicar Calibri 11pt o su propio default
      styles: {
        default: {
          document: {
            run: {
              font: APA_CONFIG.typography.font,
              size: APA_CONFIG.typography.size, // 24 half-points = 12pt
            },
            paragraph: {
              spacing: {
                line: APA_CONFIG.typography.lineSpacing, // 480 = doble espacio
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
  private createCoverPageStudent(config: DocumentConfig): any {
    const { author, title, institution, course, professor, dueDate } = config;
    const { typography } = APA_CONFIG;
    const lineSpacing = typography.lineSpacing; // 480 = doble espacio

    const paragraphs: Paragraph[] = [];

    // === Espacio superior ===
    // APA requiere el título 3-4 líneas doble espacio desde el margen superior
    // Con doble espacio (480 twips por línea), 3 líneas vacías colocan el título correctamente
    for (let i = 0; i < 3; i++) {
      paragraphs.push(new Paragraph({
        spacing: { line: lineSpacing, before: 0, after: 0 },
      }));
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
    paragraphs.push(new Paragraph({
      spacing: { line: lineSpacing, before: 0, after: 0 },
    }));

    // === Nombre del autor ===
    // Nombre completo, sin títulos ni grados
    const fullName = `${author.firstName}${author.middleName ? ' ' + author.middleName : ''} ${author.lastName}`;
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
   * Similar a estudiante pero con running head
   */
  private createCoverPageProfessional(config: DocumentConfig): any {
    // Por ahora reutiliza la de estudiante
    // TODO: agregar running head y author note
    return this.createCoverPageStudent(config);
  }

  /**
   * Crea el encabezado con número de página
   * APA 7th Ed.: Número de página flush-right en el header
   */
  private createHeader(): Header {
    const { typography } = APA_CONFIG;

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
   * Crea el contenido del cuerpo del documento
   * APA 7th Ed.:
   * - Título repetido en la primera página del cuerpo, centrado, negrita
   * - Doble espacio en todo el texto
   * - Sangría de primera línea de 0.5 pulgadas en cada párrafo
   * - Abstract en su propia página (si existe)
   * - Keywords en itálica debajo del abstract
   */
  private createBodyContent(config: DocumentConfig, references?: Reference[]): Paragraph[] {
    const { typography } = APA_CONFIG;
    const lineSpacing = typography.lineSpacing;
    const paragraphs: Paragraph[] = [];

    // === Abstract (si existe) ===
    // APA 7th Ed.: Abstract va en su propia página después de la portada
    if (config.abstract) {
      // Título "Abstract" centrado, negrita
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { line: lineSpacing, before: 0, after: 0 },
          children: [
            new TextRun({
              text: 'Abstract',
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
                text: 'Keywords: ',
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

    // Párrafo placeholder para el contenido del cuerpo
    paragraphs.push(
      new Paragraph({
        indent: { firstLine: 720 }, // Sangría de primera línea
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

    // === Referencias (si existen) ===
    if (references && references.length > 0) {
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
      sections: [{
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
      }],
    });

    return await Packer.toBuffer(doc);
  }
}
