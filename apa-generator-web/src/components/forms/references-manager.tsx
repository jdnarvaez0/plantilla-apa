'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Book, Trash2, Plus, GraduationCap, Globe, FileText, X, BookOpen } from 'lucide-react';
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
import { Reference, ReferenceType } from '@/types/document.types';
import { referenceSchema, ReferenceFormSchema } from '@/types/schemas';

interface ReferencesManagerProps {
  references: Reference[];
  onChange: (references: Reference[]) => void;
}

const referenceTypeIcons: Record<ReferenceType, React.ReactNode> = {
  [ReferenceType.BOOK]: <Book className="h-4 w-4" />,
  [ReferenceType.JOURNAL_ARTICLE]: <FileText className="h-4 w-4" />,
  [ReferenceType.WEBSITE]: <Globe className="h-4 w-4" />,
  [ReferenceType.THESIS]: <GraduationCap className="h-4 w-4" />,
  [ReferenceType.CONFERENCE_PAPER]: <FileText className="h-4 w-4" />,
  [ReferenceType.REPORT]: <FileText className="h-4 w-4" />,
};

const referenceTypeLabels: Record<ReferenceType, string> = {
  [ReferenceType.BOOK]: 'Libro',
  [ReferenceType.JOURNAL_ARTICLE]: 'Artículo de Revista',
  [ReferenceType.WEBSITE]: 'Sitio Web',
  [ReferenceType.THESIS]: 'Tesis',
  [ReferenceType.CONFERENCE_PAPER]: 'Ponencia',
  [ReferenceType.REPORT]: 'Informe',
};

// Only the types that have schemas defined
const availableTypes = [
  ReferenceType.BOOK,
  ReferenceType.JOURNAL_ARTICLE,
  ReferenceType.WEBSITE,
  ReferenceType.THESIS,
];

export function ReferencesManager({ references, onChange }: ReferencesManagerProps) {
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<ReferenceFormSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(referenceSchema) as any,
    defaultValues: {
      type: ReferenceType.BOOK,
      authors: [{ firstName: '', lastName: '' }],
      year: new Date().getFullYear(),
      title: '',
      publisher: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'authors',
  });

  const onSubmit = (data: ReferenceFormSchema) => {
    const newReference: Reference = {
      ...data,
      id: crypto.randomUUID(),
    } as Reference;

    onChange([...references, newReference]);
    setIsAdding(false);

    // Reset form to default values for next use
    form.reset({
      type: ReferenceType.BOOK,
      authors: [{ firstName: '', lastName: '' }],
      year: new Date().getFullYear(),
      title: '',
      publisher: '',
    });

    toast.success('Referencia agregada', {
      description: `"${data.title}" fue añadida a la lista`,
    });
  };

  const handleRemoveReference = (index: number) => {
    const removed = references[index];
    const newReferences = [...references];
    newReferences.splice(index, 1);
    onChange(newReferences);
    toast.info('Referencia eliminada', {
      description: `"${removed.title}" fue removida`,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    form.reset({
      type: ReferenceType.BOOK,
      authors: [{ firstName: '', lastName: '' }],
      year: new Date().getFullYear(),
      title: '',
      publisher: '',
    });
  };

  const watchType = form.watch('type');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Referencias Bibliográficas
          </span>
          <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {references.length} {references.length === 1 ? 'referencia' : 'referencias'}
          </span>
        </CardTitle>
        {!isAdding && references.length === 0 && (
          <CardDescription>
            Agrega las fuentes bibliográficas de tu documento
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de referencias */}
        {references.length > 0 && (
          <div className="space-y-2">
            {references.map((ref, index) => (
              <div
                key={ref.id || index}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 p-1.5 bg-background rounded-md border">
                    {referenceTypeIcons[ref.type]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-sm">{ref.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {ref.authors.map((a, i) => (
                        <span key={i}>
                          {i > 0 && ', '}
                          {a.lastName}{a.firstName ? `, ${a.firstName.charAt(0)}.` : ''}
                        </span>
                      ))}
                      {' '}({ref.year}) · {referenceTypeLabels[ref.type]}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveReference(index)}
                  className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar referencia */}
        {isAdding ? (
          <Form {...form}>
            {/* 
              Using a standalone form (not nested) - this fixes the issue 
              where clicking "Agregar Referencia" was submitting the parent form 
            */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-4 border-2 border-primary/20 p-4 rounded-lg bg-primary/5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Referencia
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>

              {/* Tipo de referencia */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Referencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTypes.map((value) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              {referenceTypeIcons[value]}
                              {referenceTypeLabels[value]}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Autores */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Autores</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ firstName: '', lastName: '' })}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Agregar autor
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`authors.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`authors.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Apellido" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Título y Año */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de la obra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1900}
                          max={new Date().getFullYear() + 1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Campos específicos según tipo */}
              {watchType === ReferenceType.BOOK && (
                <>
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Editorial</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Editorial Sudamericana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="edition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edición <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 3ra edición" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="doi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DOI <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="10.xxxx/xxxxx" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {watchType === ReferenceType.JOURNAL_ARTICLE && (
                <>
                  <FormField
                    control={form.control}
                    name="journalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Revista</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Nature" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volumen</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número <span className="text-xs text-muted-foreground">(opc.)</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Páginas</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 45-67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="doi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DOI <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="10.xxxx/xxxxx" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {watchType === ReferenceType.WEBSITE && (
                <>
                  <FormField
                    control={form.control}
                    name="websiteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Sitio Web</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Wikipedia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Acceso <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {watchType === ReferenceType.THESIS && (
                <>
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institución</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Universidad de Buenos Aires" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thesisType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Tesis</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="doctoral">Doctoral</SelectItem>
                            <SelectItem value="masters">Maestría</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL <span className="text-xs text-muted-foreground">(opcional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Referencia
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Referencia
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
