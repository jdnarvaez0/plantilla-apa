import { z } from 'zod';
import { DocumentType, CoverPageType, ReferenceType } from './document.types';

// Author Schema
export const authorSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'El apellido es requerido'),
});

// Cover Page Schema
export const coverPageSchema = z.object({
  type: z.nativeEnum(CoverPageType),
  includePageNumber: z.boolean().default(false),
});

// Document Schema
export const documentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  author: authorSchema,
  institution: z.string().min(2, 'La institución es requerida'),
  course: z.string().optional(),
  professor: z.string().optional(),
  dueDate: z.string().min(1, 'La fecha de entrega es requerida'),
  coverPage: coverPageSchema,
  abstract: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Reference Schemas
export const baseReferenceSchema = z.object({
  type: z.nativeEnum(ReferenceType),
  authors: z.array(authorSchema).min(1, 'Debe haber al menos un autor'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  title: z.string().min(1, 'El título es requerido'),
});

export const bookReferenceSchema = baseReferenceSchema.extend({
  type: z.literal(ReferenceType.BOOK),
  publisher: z.string().min(1, 'La editorial es requerida'),
  edition: z.string().optional(),
  volume: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const journalReferenceSchema = baseReferenceSchema.extend({
  type: z.literal(ReferenceType.JOURNAL_ARTICLE),
  journalName: z.string().min(1, 'El nombre de la revista es requerido'),
  volume: z.string().min(1, 'El volumen es requerido'),
  issue: z.string().optional(),
  pages: z.string().min(1, 'Las páginas son requeridas'),
  doi: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const websiteReferenceSchema = baseReferenceSchema.extend({
  type: z.literal(ReferenceType.WEBSITE),
  websiteName: z.string().min(1, 'El nombre del sitio es requerido'),
  url: z.string().url('URL inválida'),
  accessDate: z.string().optional(),
});

export const thesisReferenceSchema = baseReferenceSchema.extend({
  type: z.literal(ReferenceType.THESIS),
  institution: z.string().min(1, 'La institución es requerida'),
  thesisType: z.enum(['doctoral', 'masters']),
  database: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const referenceSchema = z.discriminatedUnion('type', [
  bookReferenceSchema,
  journalReferenceSchema,
  websiteReferenceSchema,
  thesisReferenceSchema,
]);

// Generate Document Request Schema
export const generateDocumentSchema = documentSchema.extend({
  references: z.array(referenceSchema).optional(),
});

// Types
export type DocumentFormData = z.infer<typeof documentSchema>;
export type ReferenceFormSchema = z.infer<typeof referenceSchema>;
export type GenerateDocumentFormData = z.infer<typeof generateDocumentSchema>;
