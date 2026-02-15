import { DocumentType, CoverPageType } from '../enums/document-type.enum';
import { Reference } from './reference.interface';

export interface Author {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface CoverPageConfig {
  type: CoverPageType;
  includePageNumber?: boolean;
}

export interface DocumentConfig {
  id?: string;
  type: DocumentType;
  title: string;
  /** @deprecated Use `authors` instead */
  author?: Author;
  /** Multiple authors — APA 7th Ed. supports up to 20 */
  authors?: Author[];
  institution: string;
  course?: string;
  professor?: string;
  dueDate: Date | string;
  coverPage: CoverPageConfig;
  references?: Reference[];
  abstract?: string;
  keywords?: string[];
}

export interface DocumentMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  apaVersion: string;
}
