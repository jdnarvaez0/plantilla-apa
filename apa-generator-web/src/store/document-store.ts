import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DocumentConfig, DocumentType, CoverPageType, Reference } from '@/types/document.types';

interface DocumentState {
  // Datos del documento
  documentConfig: Partial<DocumentConfig>;
  references: Reference[];

  // Acciones
  setDocumentConfig: (config: Partial<DocumentConfig>) => void;
  setReferences: (references: Reference[]) => void;
  addReference: (reference: Reference) => void;
  removeReference: (id: string) => void;
  clearAll: () => void;
}

const initialConfig: Partial<DocumentConfig> = {
  type: DocumentType.ESSAY,
  title: '',
  author: {
    firstName: '',
    middleName: '',
    lastName: '',
  },
  institution: '',
  course: '',
  professor: '',
  dueDate: new Date().toISOString().split('T')[0],
  coverPage: {
    type: CoverPageType.STUDENT,
    includePageNumber: false,
  },
  abstract: '',
  keywords: [],
};

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documentConfig: initialConfig,
      references: [],

      setDocumentConfig: (config) =>
        set((state) => ({
          documentConfig: { ...state.documentConfig, ...config },
        })),

      setReferences: (references) => set({ references }),

      addReference: (reference) =>
        set((state) => ({
          references: [...state.references, reference],
        })),

      removeReference: (id) =>
        set((state) => ({
          references: state.references.filter((ref) => ref.id !== id),
        })),

      clearAll: () =>
        set({
          documentConfig: initialConfig,
          references: [],
        }),
    }),
    {
      name: 'apa-document-storage',
      partialize: (state) => ({
        documentConfig: state.documentConfig,
        references: state.references,
      }),
    }
  )
);
