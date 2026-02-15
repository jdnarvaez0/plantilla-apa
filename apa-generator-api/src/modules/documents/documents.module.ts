import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SharedModule } from '../../shared/shared.module';

/**
 * Módulo de documentos
 * Gestiona la generación de documentos académicos en formato APA
 */
@Module({
  imports: [SharedModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
