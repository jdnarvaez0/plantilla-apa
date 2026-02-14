'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DocumentType, CoverPageType, GenerateDocumentRequest } from '@/types/document.types';
import { apiService } from '@/services/api';

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

  const form = useForm({
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
    },
  });

  const onSubmit = async (data: DocumentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData: GenerateDocumentRequest = {
        ...data,
        references: [],
      };

      const blob = await apiService.generateDocument(requestData);
      const filename = `${data.title.replace(/\s+/g, '_').toLowerCase()}_apa.docx`;
      apiService.downloadBlob(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el documento');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el documento de prueba');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generar Documento APA
        </CardTitle>
        <CardDescription>
          Completa la información para generar tu documento con formato APA 7ª edición
        </CardDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input placeholder="Ej: Impacto de la Inteligencia Artificial en la Educación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Información del Autor */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Información del Autor</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="author.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
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
                      <FormLabel>Segundo Nombre (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="M." {...field} />
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
                        <Input placeholder="Pérez" {...field} />
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
                    <Input placeholder="Ej: Universidad Nacional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Curso y Profesor */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso/Asignatura (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Psicología 101" {...field} />
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
                    <FormLabel>Profesor (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Dr. García" {...field} />
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
                    <Input type="date" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Error */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-4">
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
                onClick={handleTestDocument}
                disabled={isLoading}
              >
                Probar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
