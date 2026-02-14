import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('generate')
  @ApiOperation({ 
    summary: 'Generar documento APA',
    description: 'Genera un documento Word (.docx) con formato APA 7ª edición basado en la configuración proporcionada'
  })
  @ApiBody({ type: GenerateDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Documento generado exitosamente',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
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
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.documentsService.generateDocument(dto);
      
      const filename = `${dto.title.replace(/\s+/g, '_').toLowerCase()}_apa.docx`;
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });
      
      res.end(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el documento',
        error: error.message,
      });
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Generar documento de prueba' })
  @ApiResponse({
    status: 200,
    description: 'Documento de prueba generado',
    content: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async generateTestDocument(@Res() res: Response) {
    try {
      const buffer = await this.documentsService.generateTestDocument();
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="test_apa.docx"',
        'Content-Length': buffer.length,
      });
      
      res.end(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el documento de prueba',
        error: error.message,
      });
    }
  }
}
