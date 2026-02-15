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
  /** Running head - título abreviado para portada profesional (max 50 chars) */
  runningHead?: string;
  /** Author note - nota del autor para portada profesional */
  authorNote?: string;
}

export interface DocumentSectionOptions {
  coverPage?: boolean;
  abstract?: boolean;
  introduction?: boolean;
  references?: boolean;
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
  introduction?: string;
  /** Opciones para incluir/excluir secciones del documento */
  sectionOptions?: DocumentSectionOptions;
}

export interface DocumentMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  apaVersion: string;
}
