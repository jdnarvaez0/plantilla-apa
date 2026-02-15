import { Module } from '@nestjs/common';
import { DocxGeneratorService } from './docx-generator/docx-generator.service';
import { ApaFormatterService } from './apa-formatter/apa-formatter.service';

/**
 * Módulo compartido
 * Contiene servicios utilizados por múltiples módulos de la aplicación
 */
@Module({
  providers: [DocxGeneratorService, ApaFormatterService],
  exports: [DocxGeneratorService, ApaFormatterService],
})
export class SharedModule {}
