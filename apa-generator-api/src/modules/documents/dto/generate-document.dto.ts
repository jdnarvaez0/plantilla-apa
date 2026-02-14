import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { BookReferenceDto, JournalReferenceDto, WebsiteReferenceDto, ThesisReferenceDto } from '../../bibliography/dto/reference.dto';
import { ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateDocumentDto extends CreateDocumentDto {
  @ApiPropertyOptional({ 
    description: 'Referencias bibliográficas (libros)',
    type: [BookReferenceDto] 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookReferenceDto)
  references?: BookReferenceDto[];
}
