import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReferenceType } from '../../../common/enums/reference-type.enum';

class AuthorDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}

class BaseReferenceDto {
  @ApiProperty({ enum: ReferenceType })
  @IsEnum(ReferenceType)
  type: ReferenceType;

  @ApiProperty({ type: [AuthorDto] })
  @ValidateNested({ each: true })
  @Type(() => AuthorDto)
  authors: AuthorDto[];

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsString()
  title: string;
}

export class BookReferenceDto extends BaseReferenceDto {
  @ApiProperty()
  @IsString()
  publisher: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  edition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;
}

export class JournalReferenceDto extends BaseReferenceDto {
  @ApiProperty()
  @IsString()
  journalName: string;

  @ApiProperty()
  @IsString()
  volume: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  issue?: string;

  @ApiProperty()
  @IsString()
  pages: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;
}

export class WebsiteReferenceDto extends BaseReferenceDto {
  @ApiProperty()
  @IsString()
  websiteName: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  accessDate?: Date;
}

export class ThesisReferenceDto extends BaseReferenceDto {
  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty({ enum: ['doctoral', 'masters'] })
  @IsEnum({ DOCTORAL: 'doctoral', MASTERS: 'masters' })
  thesisType: 'doctoral' | 'masters';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  database?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;
}

export type ReferenceDto =
  | BookReferenceDto
  | JournalReferenceDto
  | WebsiteReferenceDto
  | ThesisReferenceDto;
