import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { setAutoFreeze } from "immer";

// Disable Immer auto-freeze to prevent issues with React Hook Form
setAutoFreeze(false);
import { 
  DocumentConfig, 
  DocumentType, 
  CoverPageType, 
  Reference 
} from "@/types/document.types";

// ============================================
// STATE TYPES
// ============================================

interface DocumentState {
  // Datos del documento
  documentConfig: Partial<DocumentConfig>;
  references: Reference[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastSaved: Date | null;
  hasHydrated: boolean; // Indica si los datos de localStorage ya fueron cargados
}

// ============================================
// ACTIONS TYPES (Following zustand skill pattern)
// ============================================

interface DocumentActions {
  // Document config actions
  setDocumentConfig: (config: Partial<DocumentConfig>) => void;
  updateDocumentField: <K extends keyof DocumentConfig>(
    field: K, 
    value: DocumentConfig[K]
  ) => void;
  resetDocumentConfig: () => void;
  
  // References actions
  setReferences: (references: Reference[]) => void;
  addReference: (reference: Reference) => void;
  updateReference: (id: string, updates: Partial<Reference>) => void;
  removeReference: (id: string) => void;
  reorderReferences: (startIndex: number, endIndex: number) => void;
  
  // Global actions
  clearAll: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  
  // Utility actions
  exportData: () => string;
  importData: (json: string) => boolean;
}

// Combined store type
type DocumentStore = DocumentState & DocumentActions;

// ============================================
// INITIAL STATE
// ============================================

const createInitialConfig = (): Partial<DocumentConfig> => ({
  type: DocumentType.ESSAY,
  title: "",
  authors: [
    {
      firstName: "",
      middleName: "",
      lastName: "",
    },
  ],
  institution: "",
  course: "",
  professor: "",
  dueDate: new Date().toISOString().split("T")[0],
  coverPage: {
    type: CoverPageType.STUDENT,
    includePageNumber: false,
  },
  abstract: "",
  keywords: [],
  introduction: "",
  bodySections: {
    introduction: "",
    method: "",
    results: "",
    discussion: "",
    footnotes: "",
  },
  sectionOptions: {
    coverPage: true,
    abstract: true,
    introduction: true,
    method: true,
    results: true,
    discussion: true,
    references: true,
    footnotes: false,
  },
});

const initialState: DocumentState = {
  documentConfig: createInitialConfig(),
  references: [],
  isLoading: false,
  error: null,
  lastSaved: null,
  hasHydrated: false,
};

// ============================================
// STORE CREATION (with immer and persist middleware)
// ============================================

export const useDocumentStore = create<DocumentStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // -----------------------------------------
      // Document Config Actions
      // -----------------------------------------
      
      setDocumentConfig: (config) => {
        set((state) => {
          state.documentConfig = { ...state.documentConfig, ...config };
          state.lastSaved = new Date();
        });
      },

      updateDocumentField: (field, value) => {
        set((state) => {
          state.documentConfig[field] = value;
          state.lastSaved = new Date();
        });
      },

      resetDocumentConfig: () => {
        set((state) => {
          state.documentConfig = createInitialConfig();
          state.lastSaved = new Date();
        });
      },

      // -----------------------------------------
      // References Actions
      // -----------------------------------------
      
      setReferences: (references) => {
        set((state) => {
          state.references = references;
          state.lastSaved = new Date();
        });
      },

      addReference: (reference) => {
        set((state) => {
          state.references.push(reference);
          state.lastSaved = new Date();
        });
      },

      updateReference: (id, updates) => {
        set((state) => {
          const index = state.references.findIndex((ref) => ref.id === id);
          if (index !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.references[index] = { ...state.references[index], ...updates } as any;
            state.lastSaved = new Date();
          }
        });
      },

      removeReference: (id) => {
        set((state) => {
          state.references = state.references.filter((ref) => ref.id !== id);
          state.lastSaved = new Date();
        });
      },

      reorderReferences: (startIndex, endIndex) => {
        set((state) => {
          const [removed] = state.references.splice(startIndex, 1);
          state.references.splice(endIndex, 0, removed);
          state.lastSaved = new Date();
        });
      },

      // -----------------------------------------
      // Global Actions
      // -----------------------------------------
      
      clearAll: () => {
        set((state) => {
          state.documentConfig = createInitialConfig();
          state.references = [];
          state.error = null;
          state.lastSaved = new Date();
        });
      },

      setLoading: (isLoading) => {
        set((state) => {
          state.isLoading = isLoading;
        });
      },

      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },

      // -----------------------------------------
      // Utility Actions
      // -----------------------------------------
      
      exportData: () => {
        const { documentConfig, references } = get();
        return JSON.stringify({ documentConfig, references }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.documentConfig && data.references) {
            set((state) => {
              state.documentConfig = { ...state.documentConfig, ...data.documentConfig };
              state.references = data.references;
              state.lastSaved = new Date();
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      
      setHasHydrated: (hydrated: boolean) => {
        set((state) => {
          state.hasHydrated = hydrated;
        });
      },
    })),
    {
      name: "apa-document-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        documentConfig: state.documentConfig,
        references: state.references,
        lastSaved: state.lastSaved,
      }),
      
      // Migration: convert old storage to new format
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 1) {
          // Migrate from v1 to v2
          const oldState = persistedState as { 
            documentConfig?: { author?: unknown; authors?: unknown }; 
            references?: Reference[];
          };
          
          if (oldState.documentConfig) {
            // Migrate old single-author to authors array
            if (oldState.documentConfig.author && !oldState.documentConfig.authors) {
              oldState.documentConfig.authors = [oldState.documentConfig.author];
              delete oldState.documentConfig.author;
            }
          }
          
          return {
            ...initialState,
            ...oldState,
            documentConfig: {
              ...initialState.documentConfig,
              ...oldState.documentConfig,
            },
          };
        }
        return persistedState as DocumentState;
      },
      
      // Called when the store has been rehydrated from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// ============================================
// SELECTORS (for performance optimization)
// ============================================

export const selectDocumentConfig = (state: DocumentStore) => state.documentConfig;
export const selectReferences = (state: DocumentStore) => state.references;
export const selectIsLoading = (state: DocumentStore) => state.isLoading;
export const selectError = (state: DocumentStore) => state.error;
export const selectLastSaved = (state: DocumentStore) => state.lastSaved;
export const selectHasHydrated = (state: DocumentStore) => state.hasHydrated;

// Derived selectors
export const selectAuthorsCount = (state: DocumentStore) => 
  state.documentConfig.authors?.length || 0;

export const selectReferencesCount = (state: DocumentStore) => 
  state.references.length;

export const selectIsDocumentEmpty = (state: DocumentStore) => 
  !state.documentConfig.title && 
  state.references.length === 0 &&
  !state.documentConfig.authors?.[0]?.firstName;
