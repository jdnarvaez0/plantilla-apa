import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocxGeneratorService } from '../../shared/docx-generator/docx-generator.service';
import { ApaFormatterService } from '../../shared/apa-formatter/apa-formatter.service';

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocxGeneratorService,
    ApaFormatterService,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
