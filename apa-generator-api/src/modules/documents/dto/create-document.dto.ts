import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  ValidateNested,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DocumentType,
  CoverPageType,
} from '../../../common/enums/document-type.enum';

class AuthorDto {
  @ApiProperty({ description: 'Nombre del autor', example: 'Juan' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del autor es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre o inicial',
    example: 'David',
  })
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser un texto' })
  @MaxLength(100, {
    message: 'El segundo nombre no puede exceder 100 caracteres',
  })
  middleName?: string;

  @ApiProperty({ description: 'Apellido del autor', example: 'Narváez' })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido del autor es obligatorio' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName: string;
}

class CoverPageConfigDto {
  @ApiProperty({
    enum: CoverPageType,
    description: 'Tipo de portada',
    example: CoverPageType.STUDENT,
  })
  @IsEnum(CoverPageType, {
    message: 'Tipo de portada inválido. Opciones: student, professional',
  })
  type: CoverPageType;

  @ApiPropertyOptional({
    description: 'Incluir número de página en portada',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'includePageNumber debe ser verdadero o falso' })
  includePageNumber?: boolean;
}

export class CreateDocumentDto {
  @ApiProperty({
    enum: DocumentType,
    description: 'Tipo de documento',
    example: DocumentType.ESSAY,
  })
  @IsEnum(DocumentType, {
    message:
      'Tipo de documento inválido. Opciones: essay, research_paper, thesis, report',
  })
  type: DocumentType;

  @ApiProperty({
    description: 'Título del trabajo',
    example: 'Software en Argentina',
  })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título del trabajo es obligatorio' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(300, { message: 'El título no puede exceder 300 caracteres' })
  title: string;

  @ApiPropertyOptional({
    description: 'Información del autor principal (backward compat)',
    type: AuthorDto,
  })
  @IsOptional()
  @ValidateNested({ message: 'La información del autor es inválida' })
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @ApiPropertyOptional({
    description:
      'Lista de autores del documento (APA soporta hasta 20 autores)',
    type: [AuthorDto],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Los autores deben ser una lista' })
  @ValidateNested({
    each: true,
    message: 'Uno o más autores tienen datos inválidos',
  })
  @Type(() => AuthorDto)
  authors?: AuthorDto[];

  @ApiProperty({
    description: 'Institución educativa',
    example: 'Universidad de Buenos Aires',
  })
  @IsString({ message: 'La institución debe ser un texto' })
  @IsNotEmpty({ message: 'La institución es obligatoria' })
  @MaxLength(200, { message: 'La institución no puede exceder 200 caracteres' })
  institution: string;

  @ApiPropertyOptional({
    description: 'Nombre del curso o asignatura',
    example: 'Ingeniería de Software',
  })
  @IsOptional()
  @IsString({ message: 'El curso debe ser un texto' })
  @MaxLength(200, { message: 'El curso no puede exceder 200 caracteres' })
  course?: string;

  @ApiPropertyOptional({
    description: 'Nombre del profesor',
    example: 'Dr. García',
  })
  @IsOptional()
  @IsString({ message: 'El profesor debe ser un texto' })
  @MaxLength(200, {
    message: 'El nombre del profesor no puede exceder 200 caracteres',
  })
  professor?: string;

  @ApiProperty({
    description: 'Fecha de entrega',
    type: Date,
    example: '2026-02-14',
  })
  @IsDate({ message: 'La fecha debe tener formato válido (YYYY-MM-DD)' })
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({
    description: 'Configuración de portada',
    type: CoverPageConfigDto,
  })
  @ValidateNested({ message: 'La configuración de portada es inválida' })
  @Type(() => CoverPageConfigDto)
  coverPage: CoverPageConfigDto;

  @ApiPropertyOptional({
    description: 'Resumen/Abstract del trabajo (máximo 250 palabras)',
    example:
      'Este trabajo analiza el estado actual del software en Argentina...',
  })
  @IsOptional()
  @IsString({ message: 'El abstract debe ser un texto' })
  @MaxLength(3000, {
    message: 'El abstract no puede exceder 3000 caracteres (~250 palabras)',
  })
  abstract?: string;

  @ApiPropertyOptional({
    description: 'Palabras clave (máximo 10)',
    type: [String],
    example: ['software', 'Argentina', 'tecnología'],
  })
  @IsOptional()
  @IsArray({ message: 'Las palabras clave deben ser una lista' })
  @ArrayMaxSize(10, {
    message: 'No se pueden agregar más de 10 palabras clave',
  })
  @IsString({ each: true, message: 'Cada palabra clave debe ser un texto' })
  keywords?: string[];
}
