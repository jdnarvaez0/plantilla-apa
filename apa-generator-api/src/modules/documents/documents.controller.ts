import {
  Controller,
  Post,
  Body,
  Get,
  StreamableFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProduces,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';

/**
 * Controlador de documentos
 * Maneja la generación de documentos académicos en formato APA
 */
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Genera un documento Word con formato APA
   */
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generar documento APA',
    description:
      'Genera un documento Word (.docx) con formato APA 7ª edición basado en la configuración proporcionada',
  })
  @ApiBody({ type: GenerateDocumentDto })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @ApiResponse({
    status: 200,
    description: 'Documento generado exitosamente',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async generateDocument(
    @Body() dto: GenerateDocumentDto,
  ): Promise<StreamableFile> {
    const buffer = await this.documentsService.generateDocument(dto);

    const filename = `${dto.title.replace(/\s+/g, '_').toLowerCase()}_apa.docx`;

    return new StreamableFile(new Uint8Array(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      disposition: `attachment; filename="${filename}"`,
    });
  }

  /**
   * Genera un documento de prueba
   */
  @Get('test')
  @ApiOperation({ summary: 'Generar documento de prueba' })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  )
  @ApiResponse({
    status: 200,
    description: 'Documento de prueba generado',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
    },
  })
  async generateTestDocument(): Promise<StreamableFile> {
    const buffer = await this.documentsService.generateTestDocument();

    return new StreamableFile(new Uint8Array(buffer), {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      disposition: 'attachment; filename="test_apa.docx"',
    });
  }
}
