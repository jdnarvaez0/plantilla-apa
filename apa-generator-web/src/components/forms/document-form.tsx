'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FileText, Loader2, Download, Trash2, Save, Eye, EyeOff, X, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { documentSchema, DocumentFormData } from '@/types/schemas';
import { DocumentType, CoverPageType, GenerateDocumentRequest, Reference } from '@/types/document.types';
import { apiService } from '@/services/api';
import { useDocumentStore } from '@/store/document-store';
import { ReferencesManager } from './references-manager';
import { DataControls } from './data-controls';
import { DocumentPreview } from '../preview/document-preview';

const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.ESSAY]: 'Ensayo',
  [DocumentType.RESEARCH_PAPER]: 'Trabajo de Investigación',
  [DocumentType.REVIEW_ARTICLE]: 'Artículo de Revisión',
  [DocumentType.CASE_STUDY]: 'Caso de Estudio',
  [DocumentType.LITERATURE_REVIEW]: 'Revisión de Literatura',
};

export function DocumentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Store con persistencia
  const {
    documentConfig,
    references,
    setDocumentConfig,
    setReferences,
    clearAll
  } = useDocumentStore();

  const form = useForm<DocumentFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(documentSchema) as any,
    defaultValues: {
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
    },
  });

  // Cargar datos del store al montar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (documentConfig.type) {
      form.reset({
        type: (documentConfig.type as DocumentType) || DocumentType.ESSAY,
        title: documentConfig.title || '',
        author: {
          firstName: documentConfig.author?.firstName || '',
          middleName: documentConfig.author?.middleName || '',
          lastName: documentConfig.author?.lastName || '',
        },
        institution: documentConfig.institution || '',
        course: documentConfig.course || '',
        professor: documentConfig.professor || '',
        dueDate: documentConfig.dueDate || new Date().toISOString().split('T')[0],
        coverPage: {
          type: (documentConfig.coverPage?.type as CoverPageType) || CoverPageType.STUDENT,
          includePageNumber: documentConfig.coverPage?.includePageNumber || false,
        },
        abstract: documentConfig.abstract || '',
        keywords: documentConfig.keywords || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar cambios en el store (debounced-like con useCallback)
  const handleFormChange = useCallback(() => {
    const values = form.getValues();
    setDocumentConfig(values);
  }, [form, setDocumentConfig]);

  const onSubmit = async (data: DocumentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Strip client-side 'id' from references — the backend DTO doesn't accept it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanedReferences = references.map(({ id, ...rest }) => rest);

      const requestData: GenerateDocumentRequest = {
        ...data,
        references: cleanedReferences as Reference[],
      };

      const blob = await apiService.generateDocument(requestData);
      const filename = `${data.title.replace(/\s+/g, '_').toLowerCase()}_apa.docx`;
      apiService.downloadBlob(blob, filename);

      toast.success('Documento generado exitosamente', {
        description: `Se descargó: ${filename}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar el documento';
      setError(message);
      toast.error('Error al generar documento', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDocument = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await apiService.generateTestDocument();
      apiService.downloadBlob(blob, 'test_apa.docx');
      toast.success('Documento de prueba generado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar el documento de prueba';
      setError(message);
      toast.error('Error', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
      clearAll();
      form.reset({
        type: DocumentType.ESSAY,
        title: '',
        author: { firstName: '', middleName: '', lastName: '' },
        institution: '',
        course: '',
        professor: '',
        dueDate: new Date().toISOString().split('T')[0],
        coverPage: { type: CoverPageType.STUDENT, includePageNumber: false },
        abstract: '',
        keywords: [],
      });
      setReferences([]);
      toast.info('Datos limpiados');
    }
  };

  const handleSaveDraft = () => {
    handleFormChange();
    toast.success('Borrador guardado', {
      description: 'Los datos se guardaron localmente',
    });
  };

  // Live preview - watches ALL form values reactively
  const currentValues = form.watch();
  const documentConfigForPreview: GenerateDocumentRequest = {
    ...currentValues,
    references,
  };

  return (
    <div className="space-y-6">
      {/* Main layout: Form + Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Form + References */}
        <div className="space-y-6">
          {/* Formulario del Documento */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generar Documento APA
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Completa la información para generar tu documento con formato APA 7ª edición
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <DataControls />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="lg:hidden"
                    title={showPreview ? 'Ocultar vista previa' : 'Mostrar vista previa'}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Tipo de Documento */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleFormChange();
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(documentTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Trabajo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Impacto de la Inteligencia Artificial en la Educación"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Información del Autor */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Información del Autor</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="author.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Juan"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFormChange();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="author.middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Segundo Nombre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="M. (Opcional)"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFormChange();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="author.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Pérez"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFormChange();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Institución */}
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institución</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Universidad Nacional"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Curso y Profesor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curso/Asignatura <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Psicología 101"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="professor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profesor <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Dr. García"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Fecha de Entrega */}
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Entrega</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo de Portada */}
                  <FormField
                    control={form.control}
                    name="coverPage.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Portada</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleFormChange();
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de portada" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={CoverPageType.STUDENT}>Estudiante</SelectItem>
                            <SelectItem value={CoverPageType.PROFESSIONAL}>Profesional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Abstract */}
                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Abstract <span className="text-xs text-muted-foreground">(opcional, máx. 250 palabras)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe un resumen de tu trabajo académico..."
                            className="min-h-[120px] resize-y"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Resumen breve en formato APA</span>
                          <span>{(field.value || '').split(/\s+/).filter(Boolean).length} / 250 palabras</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Keywords */}
                  <KeywordsInput
                    keywords={form.watch('keywords') || []}
                    onChange={(keywords) => {
                      form.setValue('keywords', keywords);
                      handleFormChange();
                    }}
                  />

                  {/* Error */}
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Generar Documento
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      title="Guardar borrador"
                    >
                      <Save className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestDocument}
                      disabled={isLoading}
                    >
                      Probar
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClearAll}
                      className="text-destructive hover:text-destructive"
                      title="Limpiar todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* 
            IMPORTANT: ReferencesManager is OUTSIDE the document form 
            to avoid nested <form> issues which was causing the 
            "Agregar Referencia" button to not work properly.
          */}
          <ReferencesManager
            references={references}
            onChange={(newRefs) => {
              setReferences(newRefs);
            }}
          />
        </div>

        {/* Right Column: Live Preview (always visible on desktop) */}
        <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <DocumentPreview
              config={documentConfigForPreview as GenerateDocumentRequest}
              references={references}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component for managing keywords as tags.
 * Press Enter or comma to add a keyword. Click X to remove.
 */
function KeywordsInput({ keywords, onChange }: { keywords: string[]; onChange: (kw: string[]) => void }) {
  const [input, setInput] = useState('');

  const addKeyword = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 10) {
      onChange([...keywords, trimmed]);
    }
    setInput('');
  };

  const removeKeyword = (kw: string) => {
    onChange(keywords.filter(k => k !== kw));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(input);
    }
    // Allow backspace to remove last keyword
    if (e.key === 'Backspace' && !input && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          Palabras Clave <span className="text-xs text-muted-foreground">(opcional, máx. 10)</span>
        </div>
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-md border border-input bg-background">
        {keywords.map((kw) => (
          <Badge key={kw} variant="secondary" className="gap-1 text-xs">
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(kw)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) addKeyword(input); }}
          placeholder={keywords.length === 0 ? "Escribe y presiona Enter..." : ""}
          className="flex-1 min-w-[120px] h-7 border-0 shadow-none focus-visible:ring-0 p-0 text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Presiona Enter o coma para agregar. Ej: psicología, educación, aprendizaje
      </p>
    </div>
  );
}
