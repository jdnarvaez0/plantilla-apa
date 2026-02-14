import { Injectable } from '@nestjs/common';
import * as docx from 'docx';
import { Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber } from 'docx';
import { APA_CONFIG } from '../../config/apa.config';
import { ApaFormatterService } from '../apa-formatter/apa-formatter.service';
import { DocumentConfig } from '../../common/interfaces/document-config.interface';
import { CoverPageType } from '../../common/enums/document-type.enum';
import { Reference } from '../../common/interfaces/reference.interface';

@Injectable()
export class DocxGeneratorService {
  constructor(private readonly apaFormatter: ApaFormatterService) {}

  /**
   * Genera un documento Word completo con formato APA
   */
  async generateDocument(
    config: DocumentConfig,
    references?: Reference[],
  ): Promise<Buffer> {
    const sections = [];

    // Portada
    if (config.coverPage?.type === CoverPageType.STUDENT) {
      sections.push(this.createCoverPageStudent(config));
    }

    // Cuerpo del documento
    sections.push({
      properties: {
        page: {
          margin: {
            top: APA_CONFIG.margins.top,
            bottom: APA_CONFIG.margins.bottom,
            left: APA_CONFIG.margins.left,
            right: APA_CONFIG.margins.right,
          },
        },
      },
      children: this.createBodyContent(config, references),
      headers: {
        default: this.createHeader(config),
      },
    });

    const doc = new Document({
      sections: sections as any,
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Crea la portada para versión estudiante
   */
  private createCoverPageStudent(config: DocumentConfig): any {
    const { author, title, institution, course, professor, dueDate } = config;
    const { coverPage: coverConfig, typography } = APA_CONFIG;

    const paragraphs: Paragraph[] = [];

    // Espacio superior (aproximadamente 1/3 de la página)
    for (let i = 0; i < 6; i++) {
      paragraphs.push(new Paragraph({ spacing: { after: 240 }, text: '' }));
    }

    // Título centrado en negrita
    paragraphs.push(
      new Paragraph({
        text: title,
        alignment: AlignmentType.CENTER,
        spacing: { after: 720 }, // 12pt después
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

    // Información del autor e institución con espaciado
    const infoItems = [
      `${author.firstName} ${author.middleName ? author.middleName + ' ' : ''}${author.lastName}`,
      institution,
      course,
      professor,
      this.apaFormatter.formatDate(dueDate),
    ].filter(Boolean);

    infoItems.forEach((item, index) => {
      paragraphs.push(
        new Paragraph({
          text: item,
          alignment: AlignmentType.CENTER,
          spacing: { 
            before: index === 0 ? 720 : 0,
            after: 0 
          },
          children: [
            new TextRun({
              text: item,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );
    });

    return {
      properties: {
        page: {
          margin: {
            top: APA_CONFIG.margins.top,
            bottom: APA_CONFIG.margins.bottom,
            left: APA_CONFIG.margins.left,
            right: APA_CONFIG.margins.right,
          },
        },
      },
      children: paragraphs,
    };
  }

  /**
   * Crea el encabezado con número de página
   */
  private createHeader(config: DocumentConfig): Header {
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
   */
  private createBodyContent(config: DocumentConfig, references?: Reference[]): Paragraph[] {
    const { typography } = APA_CONFIG;
    const paragraphs: Paragraph[] = [];

    // Título repetido al inicio (para estudiante, centrado)
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
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

    // Abstract (si existe)
    if (config.abstract) {
      paragraphs.push(
        new Paragraph({
          text: 'Abstract',
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
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

      // Abstract con sangría
      paragraphs.push(
        new Paragraph({
          text: config.abstract,
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          spacing: { line: 480, after: 240 },
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
            indent: { firstLine: 720 },
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'Keywords: ',
                italics: true,
                font: typography.font,
                size: typography.size,
              }),
              new TextRun({
                text: config.keywords.join(', '),
                font: typography.font,
                size: typography.size,
              }),
            ],
          }),
        );
      }
    }

    // Referencias (si existen)
    if (references && references.length > 0) {
      // Salto de página antes de referencias
      paragraphs.push(
        new Paragraph({
          pageBreakBefore: true,
          text: 'References',
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
          children: [
            new TextRun({
              text: 'References',
              bold: true,
              font: typography.font,
              size: typography.size,
            }),
          ],
        }),
      );

      // Ordenar referencias alfabéticamente
      const sortedReferences = [...references].sort((a, b) => {
        const authorA = a.authors[0]?.lastName || '';
        const authorB = b.authors[0]?.lastName || '';
        return authorA.localeCompare(authorB);
      });

      // Agregar cada referencia con sangría francesa
      sortedReferences.forEach((ref) => {
        const formattedRef = this.apaFormatter.formatReference(ref);
        paragraphs.push(
          new Paragraph({
            text: formattedRef,
            spacing: { after: 240, line: 480 },
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
                text: 'Este es un documento de prueba generado con el formato APA.',
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
