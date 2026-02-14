import { ReferenceType } from '../enums/reference-type.enum';
import { Author } from './document-config.interface';

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
  accessDate?: Date;
}

export interface ThesisReference extends BaseReference {
  type: ReferenceType.THESIS;
  institution: string;
  thesisType: 'doctoral' | 'masters';
  database?: string;
  url?: string;
}

export interface ConferencePaperReference extends BaseReference {
  type: ReferenceType.CONFERENCE_PAPER;
  conferenceName: string;
  location?: string;
  doi?: string;
  url?: string;
}

export interface ReportReference extends BaseReference {
  type: ReferenceType.REPORT;
  organization: string;
  reportNumber?: string;
  doi?: string;
  url?: string;
}

export type Reference =
  | BookReference
  | JournalReference
  | WebsiteReference
  | ThesisReference
  | ConferencePaperReference
  | ReportReference;
