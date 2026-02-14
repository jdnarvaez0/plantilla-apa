import { Injectable, Logger } from '@nestjs/common';
import { DocxGeneratorService } from '../../shared/docx-generator/docx-generator.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly docxGenerator: DocxGeneratorService,
  ) {}

  /**
   * Genera un documento Word con formato APA
   */
  async generateDocument(dto: GenerateDocumentDto): Promise<Buffer> {
    this.logger.log(`Generando documento tipo: ${dto.type}`);

    try {
      const buffer = await this.docxGenerator.generateDocument(
        dto as any,
        dto.references as any,
      );

      this.logger.log('Documento generado exitosamente');
      return buffer;
    } catch (error) {
      this.logger.error('Error al generar documento:', error);
      throw error;
    }
  }

  /**
   * Genera un documento de prueba
   */
  async generateTestDocument(): Promise<Buffer> {
    this.logger.log('Generando documento de prueba');
    return this.docxGenerator.generateTestDocument();
  }
}
