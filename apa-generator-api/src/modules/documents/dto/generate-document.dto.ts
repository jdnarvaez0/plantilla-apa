import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { BookReferenceDto, JournalReferenceDto, WebsiteReferenceDto, ThesisReferenceDto } from '../../bibliography/dto/reference.dto';
import { ValidateNested, IsOptional, IsArray, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ReferenceType } from '../../../common/enums/reference-type.enum';

/**
 * Discriminador de tipos de referencia.
 * Transforma el JSON plano al DTO correcto según el campo `type`.
 * 
 * Esto es necesario porque NestJS/class-transformer necesita saber
 * qué clase usar para validar cada item del array de referencias.
 */
function ReferenceDiscriminator() {
  return Type(() => BookReferenceDto, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: BookReferenceDto, name: ReferenceType.BOOK },
        { value: JournalReferenceDto, name: ReferenceType.JOURNAL_ARTICLE },
        { value: WebsiteReferenceDto, name: ReferenceType.WEBSITE },
        { value: ThesisReferenceDto, name: ReferenceType.THESIS },
      ],
    },
    keepDiscriminatorProperty: true,
  });
}

export class GenerateDocumentDto extends CreateDocumentDto {
  @ApiPropertyOptional({
    description: 'Referencias bibliográficas (libros, artículos, sitios web, tesis)',
    type: [BookReferenceDto],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Las referencias deben ser una lista' })
  @ArrayMaxSize(100, { message: 'No se pueden agregar más de 100 referencias' })
  @ValidateNested({ each: true, message: 'Una o más referencias tienen datos inválidos' })
  @ReferenceDiscriminator()
  references?: (BookReferenceDto | JournalReferenceDto | WebsiteReferenceDto | ThesisReferenceDto)[];
}
