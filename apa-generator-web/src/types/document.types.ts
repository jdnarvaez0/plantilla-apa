export enum DocumentType {
  ESSAY = 'essay',
  RESEARCH_PAPER = 'research_paper',
  REVIEW_ARTICLE = 'review_article',
  CASE_STUDY = 'case_study',
  LITERATURE_REVIEW = 'literature_review',
}

export enum CoverPageType {
  STUDENT = 'student',
  PROFESSIONAL = 'professional',
}

export interface Author {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface CoverPageConfig {
  type: CoverPageType;
  includePageNumber: boolean;
}

export interface DocumentConfig {
  type: DocumentType;
  title: string;
  author: Author;
  institution: string;
  course?: string;
  professor?: string;
  dueDate: string;
  coverPage: CoverPageConfig;
  abstract?: string;
  keywords?: string[];
}

export interface GenerateDocumentRequest extends DocumentConfig {
  references?: Reference[];
}

// Reference Types
export enum ReferenceType {
  BOOK = 'book',
  JOURNAL_ARTICLE = 'journal_article',
  WEBSITE = 'website',
  THESIS = 'thesis',
  CONFERENCE_PAPER = 'conference_paper',
  REPORT = 'report',
}

export interface BaseReference {
  id?: string;
  type: ReferenceType;
  authors: Author[];
  year: number;
  title: string;
}

export interface BookReference extends BaseReference {
  type: ReferenceType.BOOK;
  publisher: string;
  edition?: string;
  volume?: string;
  doi?: string;
  url?: string;
}

export interface JournalReference extends BaseReference {
  type: ReferenceType.JOURNAL_ARTICLE;
  journalName: string;
  volume: string;
  issue?: string;
  pages: string;
  doi?: string;
  url?: string;
}

export interface WebsiteReference extends BaseReference {
  type: ReferenceType.WEBSITE;
  websiteName: string;
  url: string;
  accessDate?: string;
}

export interface ThesisReference extends BaseReference {
  type: ReferenceType.THESIS;
  institution: string;
  thesisType: 'doctoral' | 'masters';
  database?: string;
  url?: string;
}

export type Reference = BookReference | JournalReference | WebsiteReference | ThesisReference;

export interface ReferenceFormData {
  type: ReferenceType;
  authors: Author[];
  year: number;
  title: string;
  publisher?: string;
  edition?: string;
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  websiteName?: string;
  url?: string;
  doi?: string;
}
