import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsDate,
  IsNotEmpty,
  IsArray,
  Min,
  Max,
  MaxLength,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReferenceType } from '../../../common/enums/reference-type.enum';

class ReferenceAuthorDto {
  @ApiProperty({ description: 'Nombre del autor', example: 'John' })
  @IsString({ message: 'El nombre del autor debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del autor es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Segundo nombre o inicial', example: 'M' })
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser un texto' })
  @MaxLength(100, { message: 'El segundo nombre no puede exceder 100 caracteres' })
  middleName?: string;

  @ApiProperty({ description: 'Apellido del autor', example: 'Smith' })
  @IsString({ message: 'El apellido del autor debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido del autor es obligatorio' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName: string;
}

class BaseReferenceDto {
  @ApiProperty({
    enum: ReferenceType,
    description: 'Tipo de referencia',
    example: ReferenceType.BOOK
  })
  @IsEnum(ReferenceType, {
    message: 'Tipo de referencia inválido. Opciones: book, journal_article, website, thesis'
  })
  type: ReferenceType;

  @ApiProperty({ type: [ReferenceAuthorDto], description: 'Autores de la referencia' })
  @IsArray({ message: 'Los autores deben ser una lista' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un autor' })
  @ValidateNested({ each: true })
  @Type(() => ReferenceAuthorDto)
  authors: ReferenceAuthorDto[];

  @ApiProperty({ description: 'Año de publicación', example: 2024 })
  @IsNumber({}, { message: 'El año debe ser un número' })
  @Min(1000, { message: 'El año debe ser mayor a 1000' })
  @Max(2100, { message: 'El año no puede ser mayor a 2100' })
  year: number;

  @ApiProperty({ description: 'Título de la obra', example: 'Introduction to Algorithms' })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título de la referencia es obligatorio' })
  @MaxLength(500, { message: 'El título no puede exceder 500 caracteres' })
  title: string;
}

export class BookReferenceDto extends BaseReferenceDto {
  @ApiProperty({ description: 'Editorial', example: 'MIT Press' })
  @IsString({ message: 'La editorial debe ser un texto' })
  @IsNotEmpty({ message: 'La editorial es obligatoria' })
  @MaxLength(200, { message: 'La editorial no puede exceder 200 caracteres' })
  publisher: string;

  @ApiPropertyOptional({ description: 'Edición del libro', example: '3ra' })
  @IsOptional()
  @IsString({ message: 'La edición debe ser un texto' })
  edition?: string;

  @ApiPropertyOptional({ description: 'Volumen', example: '2' })
  @IsOptional()
  @IsString({ message: 'El volumen debe ser un texto' })
  volume?: string;

  @ApiPropertyOptional({ description: 'DOI del libro', example: '10.1000/xyz123' })
  @IsOptional()
  @IsString({ message: 'El DOI debe ser un texto' })
  doi?: string;

  @ApiPropertyOptional({ description: 'URL del libro' })
  @IsOptional()
  @IsString({ message: 'La URL debe ser un texto' })
  url?: string;
}

export class JournalReferenceDto extends BaseReferenceDto {
  @ApiProperty({ description: 'Nombre de la revista', example: 'Journal of Computer Science' })
  @IsString({ message: 'El nombre de la revista debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la revista es obligatorio' })
  @MaxLength(300, { message: 'El nombre de la revista no puede exceder 300 caracteres' })
  journalName: string;

  @ApiProperty({ description: 'Volumen', example: '15' })
  @IsString({ message: 'El volumen debe ser un texto' })
  @IsNotEmpty({ message: 'El volumen es obligatorio' })
  volume: string;

  @ApiPropertyOptional({ description: 'Número', example: '3' })
  @IsOptional()
  @IsString({ message: 'El número debe ser un texto' })
  issue?: string;

  @ApiProperty({ description: 'Páginas', example: '45-62' })
  @IsString({ message: 'Las páginas deben ser un texto' })
  @IsNotEmpty({ message: 'Las páginas son obligatorias' })
  pages: string;

  @ApiPropertyOptional({ description: 'DOI del artículo', example: '10.1000/xyz456' })
  @IsOptional()
  @IsString({ message: 'El DOI debe ser un texto' })
  doi?: string;

  @ApiPropertyOptional({ description: 'URL del artículo' })
  @IsOptional()
  @IsString({ message: 'La URL debe ser un texto' })
  url?: string;
}

export class WebsiteReferenceDto extends BaseReferenceDto {
  @ApiProperty({ description: 'Nombre del sitio web', example: 'BBC News' })
  @IsString({ message: 'El nombre del sitio web debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del sitio web es obligatorio' })
  @MaxLength(200, { message: 'El nombre del sitio web no puede exceder 200 caracteres' })
  websiteName: string;

  @ApiProperty({ description: 'URL del recurso', example: 'https://www.bbc.com/article' })
  @IsString({ message: 'La URL debe ser un texto' })
  @IsNotEmpty({ message: 'La URL es obligatoria' })
  url: string;

  @ApiPropertyOptional({ description: 'Fecha de acceso' })
  @IsOptional()
  @IsDate({ message: 'La fecha de acceso debe tener formato válido' })
  @Type(() => Date)
  accessDate?: Date;
}

export class ThesisReferenceDto extends BaseReferenceDto {
  @ApiProperty({ description: 'Institución', example: 'Universidad de Buenos Aires' })
  @IsString({ message: 'La institución debe ser un texto' })
  @IsNotEmpty({ message: 'La institución es obligatoria' })
  @MaxLength(200, { message: 'La institución no puede exceder 200 caracteres' })
  institution: string;

  @ApiProperty({
    enum: ['doctoral', 'masters'],
    description: 'Tipo de tesis',
    example: 'masters'
  })
  @IsString({ message: 'El tipo de tesis debe ser un texto' })
  @IsEnum({ DOCTORAL: 'doctoral', MASTERS: 'masters' }, {
    message: 'Tipo de tesis inválido. Opciones: doctoral, masters'
  })
  thesisType: 'doctoral' | 'masters';

  @ApiPropertyOptional({ description: 'Base de datos donde se publicó', example: 'ProQuest' })
  @IsOptional()
  @IsString({ message: 'La base de datos debe ser un texto' })
  database?: string;

  @ApiPropertyOptional({ description: 'URL de la tesis' })
  @IsOptional()
  @IsString({ message: 'La URL debe ser un texto' })
  url?: string;
}

export type ReferenceDto =
  | BookReferenceDto
  | JournalReferenceDto
  | WebsiteReferenceDto
  | ThesisReferenceDto;
