"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, Loader2, Download, Trash2, Save, Eye, EyeOff, X, Tag, Plus, Users, AlertCircle } from "lucide-react";

// Utility to unfreeze objects from Immer/Zustand
function unfreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(unfreeze) as unknown as T;
  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = unfreeze(obj[key]);
    }
  }
  return result;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { documentSchema, type DocumentFormData } from "@/types/schemas";
import { DocumentType, CoverPageType, type GenerateDocumentRequest, type Reference } from "@/types/document.types";
import { apiService } from "@/services/api";
import { useDocumentStore, selectDocumentConfig, selectReferences, selectIsLoading } from "@/store/document-store";
import { ReferencesManager } from "./references-manager";
import { DataControls } from "./data-controls";
import { ApaValidator } from "./apa-validator";
import { DocumentPreview } from "../preview/document-preview";

const documentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.ESSAY]: "Ensayo",
  [DocumentType.RESEARCH_PAPER]: "Trabajo de Investigación",
  [DocumentType.REVIEW_ARTICLE]: "Artículo de Revisión",
  [DocumentType.CASE_STUDY]: "Caso de Estudio",
  [DocumentType.LITERATURE_REVIEW]: "Revisión de Literatura",
};

// ============================================
// MAIN COMPONENT
// ============================================

export function DocumentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Prevent re-render loop 
  const isInitialized = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Zustand store with selectors for performance
  const documentConfig = useDocumentStore(selectDocumentConfig);
  const references = useDocumentStore(selectReferences);
  const storeIsLoading = useDocumentStore(selectIsLoading);
  const { setDocumentConfig, setReferences, clearAll } = useDocumentStore();

  // Form setup with React Hook Form + Zod
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: useMemo(() => ({
      type: DocumentType.ESSAY,
      title: "",
      authors: [{ firstName: "", middleName: "", lastName: "" }],
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
    }), []),
    mode: "onChange",
  });

  // Field array for multiple authors
  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  // Load data from store on mount
  useEffect(() => {
    if (documentConfig.type && !isInitialized.current) {
      // Migrate old single-author to authors array
      const authors = documentConfig.authors ||
        (documentConfig.author ? [documentConfig.author] : [{ firstName: "", middleName: "", lastName: "" }]);

      // Unfreeze data from Zustand/Immer before using in React Hook Form
      form.reset({
        type: (documentConfig.type as DocumentType) || DocumentType.ESSAY,
        title: documentConfig.title || "",
        authors: unfreeze(authors.length > 0 ? authors : [{ firstName: "", middleName: "", lastName: "" }]),
        institution: documentConfig.institution || "",
        course: documentConfig.course || "",
        professor: documentConfig.professor || "",
        dueDate: documentConfig.dueDate || new Date().toISOString().split("T")[0],
        coverPage: {
          type: (documentConfig.coverPage?.type as CoverPageType) || CoverPageType.STUDENT,
          includePageNumber: documentConfig.coverPage?.includePageNumber || false,
        },
        abstract: documentConfig.abstract || "",
        keywords: unfreeze(documentConfig.keywords) || [],
      }, { keepDefaultValues: true });

      isInitialized.current = true;
    }
  }, [documentConfig, form]);

  // Debounced save to store
  const handleFormChange = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const values = form.getValues();
      // Unfreeze before saving to Zustand
      setDocumentConfig(unfreeze(values));
    }, 500);
  }, [form, setDocumentConfig]);

  // Form submission
  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Strip client-side 'id' from references
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanedReferences = references.map(({ id, ...rest }) => rest);

      const requestData: GenerateDocumentRequest = {
        ...data,
        author: data.authors[0], // backward compat
        references: cleanedReferences as Reference[],
      };

      const blob = await apiService.generateDocument(requestData);
      const filename = `${data.title.replace(/\s+/g, "_").toLowerCase()}_apa.docx`;
      apiService.downloadBlob(blob, filename);

      toast.success("Documento generado exitosamente", {
        description: `Se descargó: ${filename}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al generar el documento";
      setError(message);
      toast.error("Error al generar documento", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate test document
  const handleTestDocument = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const blob = await apiService.generateTestDocument();
      apiService.downloadBlob(blob, "test_apa.docx");
      toast.success("Documento de prueba generado");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al generar el documento de prueba";
      setError(message);
      toast.error("Error", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear all data
  const handleClearAll = () => {
    setShowClearDialog(true);
  };

  const confirmClearAll = () => {
    clearAll();
    form.reset({
      type: DocumentType.ESSAY,
      title: "",
      authors: [{ firstName: "", middleName: "", lastName: "" }],
      institution: "",
      course: "",
      professor: "",
      dueDate: new Date().toISOString().split("T")[0],
      coverPage: { type: CoverPageType.STUDENT, includePageNumber: false },
      abstract: "",
      keywords: [],
    });
    setReferences([]);
    isInitialized.current = true; // Avoid reload from store
    setShowClearDialog(false);
    toast.info("Datos limpiados");
  };

  // Save draft
  const handleSaveDraft = () => {
    handleFormChange();
    toast.success("Borrador guardado", {
      description: "Los datos se guardaron localmente",
    });
  };

  // Live preview data - use watch for specific fields to ensure reactivity
  const watchedValues = form.watch();
  const documentConfigForPreview = useMemo(() => {
    // Ensure authors array is properly cloned to trigger re-renders
    const authors = watchedValues.authors ? [...watchedValues.authors] : [{ firstName: "", middleName: "", lastName: "" }];
    return {
      ...watchedValues,
      authors,
      references,
    };
  }, [watchedValues, references]);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" aria-hidden="true" />
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
                    aria-label={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Document Type */}
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
                          value={field.value}
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

                  {/* Title */}
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
                              field.onChange(e.target.value);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Authors Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        Autores del Documento
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          appendAuthor({ firstName: "", middleName: "", lastName: "" });
                          handleFormChange();
                        }}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar autor
                      </Button>
                    </div>

                    {authorFields.map((authorField, index) => (
                      <div key={authorField.id} className="relative p-4 border rounded-lg bg-muted/30">
                        {authorFields.length > 1 && (
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-muted-foreground font-medium">
                              Autor {index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                removeAuthor(index);
                                handleFormChange();
                              }}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              aria-label={`Eliminar autor ${index + 1}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <FormField
                            control={form.control}
                            name={`authors.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && <FormLabel>Nombre</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Juan"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
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
                            name={`authors.${index}.middleName`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && <FormLabel>Segundo Nombre</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="M. (Opcional)"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
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
                            name={`authors.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && <FormLabel>Apellido</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Pérez"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
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
                    ))}

                    {authorFields.length > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {authorFields.length} autores · APA soporta hasta 20 autores
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Institution */}
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
                              field.onChange(e.target.value);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Course and Professor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Curso/Asignatura
                            <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Psicología 101"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
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
                          <FormLabel>
                            Profesor
                            <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Dr. García"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleFormChange();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Due Date */}
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
                              field.onChange(e.target.value);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cover Page Type */}
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
                          value={field.value}
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

                  <Separator />

                  {/* Abstract */}
                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Abstract
                          <span className="text-xs text-muted-foreground ml-1">(opcional, máx. 250 palabras)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe un resumen de tu trabajo académico..."
                            className="min-h-[120px] resize-y"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleFormChange();
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <p className="text-xs text-muted-foreground">Resumen breve en formato APA</p>
                          <span className="text-xs text-muted-foreground">
                            {(field.value || "").split(/\s+/).filter(Boolean).length} / 250 palabras
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Keywords */}
                  <KeywordsInput
                    keywords={form.watch("keywords") || []}
                    onChange={(keywords) => {
                      form.setValue("keywords", keywords);
                      handleFormChange();
                    }}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting || storeIsLoading}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
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
                      <Save className="h-4 w-4" aria-hidden="true" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestDocument}
                      disabled={isSubmitting}
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
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* References Manager */}
          <ReferencesManager
            references={references}
            onChange={(newRefs) => {
              setReferences(newRefs);
            }}
          />

          {/* APA Validator - Moved to bottom and restyled */}
          <div className="opacity-90">
            <ApaValidator config={watchedValues} references={references} />
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className={`${showPreview ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <DocumentPreview
              config={documentConfigForPreview}
              references={references}
            />
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              ¿Limpiar todos los datos?
            </DialogTitle>
            <DialogDescription>
              Esta acción eliminará toda la información del documento, autores y referencias bibliográficas. 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmClearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Sí, limpiar todo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// SUBCOMPONENTS
// ============================================

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  const [input, setInput] = useState("");

  const addKeyword = useCallback((value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 10) {
      onChange([...keywords, trimmed]);
    }
    setInput("");
  }, [keywords, onChange]);

  const removeKeyword = useCallback((kw: string) => {
    onChange(keywords.filter((k) => k !== kw));
  }, [keywords, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(input);
    }
    if (e.key === "Backspace" && !input && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          Palabras Clave
          <span className="text-xs text-muted-foreground">(opcional, máx. 10)</span>
        </div>
      </label>
      <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
        {keywords.map((kw) => (
          <Badge key={kw} variant="secondary" className="gap-1 text-xs animate-in fade-in-0 zoom-in-95">
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(kw)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              aria-label={`Eliminar palabra clave ${kw}`}
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
          onBlur={() => {
            if (input) addKeyword(input);
          }}
          placeholder={keywords.length === 0 ? "Escribe y presiona Enter..." : ""}
          className="flex-1 min-w-[120px] h-7 border-0 shadow-none focus-visible:ring-0 p-0 text-sm bg-transparent"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Presiona Enter o coma para agregar. Ej: psicología, educación, aprendizaje
      </p>
    </div>
  );
}
