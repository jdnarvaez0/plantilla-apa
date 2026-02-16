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
  method?: boolean;
  results?: boolean;
  discussion?: boolean;
  references?: boolean;
  footnotes?: boolean;
}

export interface DocumentBodySections {
  /** Introducción del trabajo */
  introduction?: string;
  /** Sección de Método (para trabajos de investigación) */
  method?: string;
  /** Sección de Resultados (para trabajos de investigación) */
  results?: string;
  /** Sección de Discusión (para trabajos de investigación) */
  discussion?: string;
  /** Notas al final del documento */
  footnotes?: string;
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
  /** @deprecated Use bodySections.introduction instead */
  introduction?: string;
  /** Secciones del cuerpo del documento (Introducción, Método, Resultados, Discusión) */
  bodySections?: DocumentBodySections;
  /** Opciones para incluir/excluir secciones del documento */
  sectionOptions?: DocumentSectionOptions;
}

export interface DocumentMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: string;
  apaVersion: string;
}
