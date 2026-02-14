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

export interface NewspaperReference extends BaseReference {
  type: ReferenceType.NEWSPAPER_ARTICLE;
  newspaperName: string;
  pages?: string;
  url?: string;
}

export interface MagazineReference extends BaseReference {
  type: ReferenceType.MAGAZINE_ARTICLE;
  magazineName: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
}

export interface FilmReference extends BaseReference {
  type: ReferenceType.FILM;
  director?: string;
  studio?: string;
  country?: string;
}

export interface PodcastReference extends BaseReference {
  type: ReferenceType.PODCAST;
  podcastName: string;
  episodeNumber?: string;
  platform?: string;
  url?: string;
}

export interface SocialMediaReference extends BaseReference {
  type: ReferenceType.SOCIAL_MEDIA;
  platform: 'Twitter' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok';
  handle: string;
  url: string;
  accessDate?: Date;
}

export interface LegalCaseReference extends BaseReference {
  type: ReferenceType.LEGAL_CASE;
  caseNumber: string;
  court: string;
  reporter?: string;
  reporterVolume?: string;
  reporterPages?: string;
  url?: string;
}

export type Reference =
  | BookReference
  | JournalReference
  | WebsiteReference
  | ThesisReference
  | ConferencePaperReference
  | ReportReference
  | NewspaperReference
  | MagazineReference
  | FilmReference
  | PodcastReference
  | SocialMediaReference
  | LegalCaseReference;
