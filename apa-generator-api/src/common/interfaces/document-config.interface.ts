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
  author: Author;
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
