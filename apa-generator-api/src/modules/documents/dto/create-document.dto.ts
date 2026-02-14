import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  ValidateNested,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, CoverPageType } from '../../../common/enums/document-type.enum';

class AuthorDto {
  @ApiProperty({ description: 'Nombre del autor' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'Segundo nombre o inicial' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Apellido del autor' })
  @IsString()
  lastName: string;
}

class CoverPageConfigDto {
  @ApiProperty({ 
    enum: CoverPageType, 
    description: 'Tipo de portada',
    example: CoverPageType.STUDENT 
  })
  @IsEnum(CoverPageType)
  type: CoverPageType;

  @ApiPropertyOptional({ description: 'Incluir número de página en portada' })
  @IsOptional()
  @IsBoolean()
  includePageNumber?: boolean;
}

export class CreateDocumentDto {
  @ApiProperty({ 
    enum: DocumentType, 
    description: 'Tipo de documento',
    example: DocumentType.ESSAY 
  })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ description: 'Título del trabajo' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Información del autor', type: AuthorDto })
  @ValidateNested()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @ApiProperty({ description: 'Institución educativa' })
  @IsString()
  institution: string;

  @ApiPropertyOptional({ description: 'Nombre del curso o asignatura' })
  @IsOptional()
  @IsString()
  course?: string;

  @ApiPropertyOptional({ description: 'Nombre del profesor' })
  @IsOptional()
  @IsString()
  professor?: string;

  @ApiProperty({ description: 'Fecha de entrega', type: Date })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({ description: 'Configuración de portada', type: CoverPageConfigDto })
  @ValidateNested()
  @Type(() => CoverPageConfigDto)
  coverPage: CoverPageConfigDto;

  @ApiPropertyOptional({ description: 'Resumen/Abstract del trabajo' })
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiPropertyOptional({ description: 'Palabras clave', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
