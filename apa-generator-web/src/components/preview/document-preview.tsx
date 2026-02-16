'use client';

import { useMemo } from 'react';
import { Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentConfig, Reference } from '@/types/document.types';

interface DocumentPreviewProps {
  config: Partial<DocumentConfig>;
  references: Reference[];
}

// Función para formatear autores en estilo APA
function formatAuthors(authors?: { firstName?: string; middleName?: string; lastName?: string }[]): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) {
    const a = authors[0];
    if (!a?.lastName && !a?.firstName) return '';
    const middle = a?.middleName ? ` ${a.middleName.charAt(0)}.` : '';
    return `${a?.lastName || ''}, ${(a?.firstName || '').charAt(0)}.${middle}`;
  }
  if (authors.length === 2) {
    const a1 = authors[0];
    const a2 = authors[1];
    const m1 = a1?.middleName ? ` ${a1.middleName.charAt(0)}.` : '';
    const m2 = a2?.middleName ? ` ${a2.middleName.charAt(0)}.` : '';
    return `${a1?.lastName || ''}, ${(a1?.firstName || '').charAt(0)}.${m1}, & ${a2?.lastName || ''}, ${(a2?.firstName || '').charAt(0)}.${m2}`;
  }
  const first = authors[0];
  const last = authors[authors.length - 1];
  const m1 = first?.middleName ? ` ${first.middleName.charAt(0)}.` : '';
  const m2 = last?.middleName ? ` ${last.middleName.charAt(0)}.` : '';
  return `${first?.lastName || ''}, ${(first?.firstName || '').charAt(0)}.${m1}, ... ${last?.lastName || ''}, ${(last?.firstName || '').charAt(0)}.${m2}`;
}

/**
 * Formats multiple document authors for the cover page display.
 * APA 7th Ed. rules:
 * - 1-2 authors: list all, separated by "y"
 * - 3+ authors: list all, last separated by "y"
 */
function formatCoverPageAuthors(authors?: { firstName?: string; middleName?: string; lastName?: string }[]): string[] {
  if (!authors || authors.length === 0) return [];
  return authors
    .filter(a => a?.firstName || a?.lastName)
    .map(a => {
      const parts = [a.firstName, a.middleName, a.lastName].filter(Boolean);
      return parts.join(' ');
    });
}

// Función para formatear referencia en estilo APA
function formatReference(ref: Reference): string {
  const authors = formatAuthors(ref.authors);
  const base = `${authors} (${ref.year}). ${ref.title}`;

  // Book
  if ('publisher' in ref && ref.publisher) {
    const edition = 'edition' in ref && ref.edition ? ` (${ref.edition})` : '';
    const doi = 'doi' in ref && ref.doi ? ` https://doi.org/${ref.doi}` : '';
    return `${base}${edition}. ${ref.publisher}.${doi}`;
  }

  // Journal Article
  if ('journalName' in ref && ref.journalName) {
    const issue = 'issue' in ref && ref.issue ? `(${ref.issue})` : '';
    const pages = 'pages' in ref && ref.pages ? `, ${ref.pages}` : '';
    const doi = 'doi' in ref && ref.doi ? ` https://doi.org/${ref.doi}` : '';
    return `${base}. *${ref.journalName}*, *${ref.volume}*${issue}${pages}.${doi}`;
  }

  // Website
  if ('websiteName' in ref && ref.websiteName) {
    return `${base}. *${ref.websiteName}*. ${ref.url}`;
  }

  // Thesis
  if ('thesisType' in ref && ref.thesisType) {
    const type = ref.thesisType === 'doctoral' ? 'Tesis doctoral' : 'Tesis de maestría';
    return `${base} [${type}, ${ref.institution}].`;
  }

  return `${base}.`;
}

// Check if the form has meaningful data
function hasContent(config: Partial<DocumentConfig>): boolean {
  const authors = config.authors || (config.author ? [config.author] : []);
  return !!(
    config.title ||
    (authors.length > 0 && (authors[0]?.firstName || authors[0]?.lastName)) ||
    config.institution
  );
}

export function DocumentPreview({ config, references }: DocumentPreviewProps) {
  // Resolve authors from either `authors` array or legacy `author` field
  const resolvedAuthors = useMemo(() => {
    const authors = config.authors || (config.author ? [config.author] : []);
    // Ensure we always have at least one author object to prevent undefined errors
    return authors.length > 0 ? authors : [{ firstName: '', lastName: '' }];
  }, [config.authors, config.author]);

  const sortedReferences = useMemo(() => {
    return [...references].sort((a, b) => {
      const aName = a.authors[0]?.lastName || '';
      const bName = b.authors[0]?.lastName || '';
      return aName.localeCompare(bName);
    });
  }, [references]);

  const formattedDate = useMemo(() => {
    if (!config.dueDate) return '';
    try {
      const date = new Date(config.dueDate + 'T12:00:00');
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } catch {
      return config.dueDate;
    }
  }, [config.dueDate]);

  const showContent = hasContent(config);

  const coverPageAuthorNames = useMemo(() => formatCoverPageAuthors(resolvedAuthors), [resolvedAuthors]);

  // Common APA text style
  const apaTextStyle: React.CSSProperties = {
    fontFamily: 'Times New Roman, serif',
    fontSize: '12pt',
    lineHeight: '2', // doble espacio
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Vista Previa en Vivo
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </CardTitle>
        <CardDescription>
          Los cambios se reflejan automáticamente mientras escribes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[700px] rounded-md border bg-white shadow-inner">
          {showContent ? (
            <div className="text-black" style={apaTextStyle}>

              {/* ===== PORTADA (Página 1) ===== */}
              <div className="relative px-[1in] pt-4 pb-8" style={{ minHeight: '500px' }}>
                {/* Número de página - esquina superior derecha */}
                <div className="text-right text-xs mb-2" style={{ ...apaTextStyle, fontSize: '12pt' }}>1</div>

                {/* 3-4 líneas en blanco (doble espacio) desde el margen superior */}
                <div style={{ height: '3em' }} />

                {/* Título centrado, negrita */}
                <h1 className="text-center font-bold" style={{ ...apaTextStyle, margin: 0 }}>
                  {config.title || (
                    <span className="text-gray-300 italic font-normal">Título del Trabajo</span>
                  )}
                </h1>

                {/* Línea en blanco después del título */}
                <div style={{ height: '2em' }} />

                {/* Información de autores y afiliación */}
                <div className="text-center" style={apaTextStyle}>
                  {coverPageAuthorNames.length > 0 ? (
                    coverPageAuthorNames.map((name, idx) => (
                      <p key={idx} style={{ margin: 0 }}>{name}</p>
                    ))
                  ) : (
                    <p style={{ margin: 0 }}>
                      <span className="text-gray-300 italic">Nombre del Autor</span>
                    </p>
                  )}
                  <p style={{ margin: 0 }}>
                    {config.institution || (
                      <span className="text-gray-300 italic">Institución</span>
                    )}
                  </p>
                  {config.course && <p style={{ margin: 0 }}>{config.course}</p>}
                  {config.professor && <p style={{ margin: 0 }}>{config.professor}</p>}
                  {formattedDate && <p style={{ margin: 0 }}>{formattedDate}</p>}
                </div>
              </div>

              {/* ===== SALTO DE PÁGINA ===== */}
              <div className="relative my-4">
                <div className="border-t-2 border-dashed border-gray-300" />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {config.abstract ? 'Página 2 — Resumen' : 'Página 2'}
                </span>
              </div>

              {/* ===== RESUMEN (Página 2, si existe) ===== */}
              {config.abstract && (
                <>
                  <div className="px-[1in] py-4">
                    {/* Número de página */}
                    <div className="text-right" style={{ ...apaTextStyle, fontSize: '12pt' }}>2</div>

                    {/* Título "Resumen" centrado, negrita */}
                    <h2 className="text-center font-bold" style={{ ...apaTextStyle, margin: 0, fontSize: '12pt' }}>
                      Resumen
                    </h2>

                    {/* Texto del resumen — SIN sangría (excepción APA) */}
                    <p className="text-left" style={{ ...apaTextStyle, margin: 0 }}>
                      {config.abstract}
                    </p>

                    {/* Palabras clave — con sangría, en itálica */}
                    {config.keywords && config.keywords.length > 0 && (
                      <p className="italic" style={{ ...apaTextStyle, margin: 0, textIndent: '0.5in' }}>
                        <span>Palabras clave: </span>
                        {config.keywords.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Salto de página */}
                  <div className="relative my-4">
                    <div className="border-t-2 border-dashed border-gray-300" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Página 3 — Cuerpo
                    </span>
                  </div>
                </>
              )}

              {/* ===== CUERPO DEL DOCUMENTO ===== */}
              <div className="px-[1in] py-4">
                {/* Número de página */}
                <div className="text-right" style={apaTextStyle}>
                  {config.abstract ? '3' : '2'}
                </div>

                {/* Título repetido al inicio del cuerpo — centrado, negrita */}
                <h2 className="text-center font-bold" style={{ ...apaTextStyle, margin: 0, fontSize: '12pt' }}>
                  {config.title || (
                    <span className="text-gray-300 italic font-normal">Título del Trabajo</span>
                  )}
                </h2>

                {/* Introducción */}
                {config.bodySections?.introduction && (
                  <div style={apaTextStyle}>
                    <h3 className="font-bold" style={{ ...apaTextStyle, margin: '1em 0 0 0', fontSize: '12pt' }}>
                      Introducción
                    </h3>
                    {config.bodySections.introduction.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => (
                      <p 
                        key={index} 
                        style={{ textIndent: '0.5in', margin: 0 }}
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Método */}
                {config.bodySections?.method && (
                  <div style={apaTextStyle}>
                    <h3 className="font-bold" style={{ ...apaTextStyle, margin: '1em 0 0 0', fontSize: '12pt' }}>
                      Método
                    </h3>
                    {config.bodySections.method.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => (
                      <p 
                        key={index} 
                        style={{ textIndent: '0.5in', margin: 0 }}
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Resultados */}
                {config.bodySections?.results && (
                  <div style={apaTextStyle}>
                    <h3 className="font-bold" style={{ ...apaTextStyle, margin: '1em 0 0 0', fontSize: '12pt' }}>
                      Resultados
                    </h3>
                    {config.bodySections.results.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => (
                      <p 
                        key={index} 
                        style={{ textIndent: '0.5in', margin: 0 }}
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Discusión */}
                {config.bodySections?.discussion && (
                  <div style={apaTextStyle}>
                    <h3 className="font-bold" style={{ ...apaTextStyle, margin: '1em 0 0 0', fontSize: '12pt' }}>
                      Discusión
                    </h3>
                    {config.bodySections.discussion.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => (
                      <p 
                        key={index} 
                        style={{ textIndent: '0.5in', margin: 0 }}
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                )}

                {/* Mensaje placeholder si no hay contenido */}
                {!config.bodySections?.introduction && !config.bodySections?.method && 
                 !config.bodySections?.results && !config.bodySections?.discussion && (
                  <div className="text-gray-300 italic text-sm" style={apaTextStyle}>
                    <p style={{ textIndent: '0.5in', margin: 0 }}>
                      El contenido de tu documento aparecerá aquí cuando se genere el archivo Word...
                    </p>
                  </div>
                )}
              </div>

              {/* ===== REFERENCIAS ===== */}
              {sortedReferences.length > 0 && (
                <>
                  {/* Salto de página */}
                  <div className="relative my-4">
                    <div className="border-t-2 border-dashed border-gray-300" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Referencias
                    </span>
                  </div>

                  <div className="px-[1in] py-4">
                    <h3 className="text-center font-bold" style={{ ...apaTextStyle, margin: 0, fontSize: '12pt' }}>
                      Referencias
                    </h3>
                    <div>
                      {sortedReferences.map((ref, index) => (
                        <p
                          key={ref.id || index}
                          className="text-left transition-all duration-300"
                          style={{
                            ...apaTextStyle,
                            fontSize: '12pt',
                            paddingLeft: '0.5in',
                            textIndent: '-0.5in', // Sangría francesa
                            margin: 0,
                          }}
                        >
                          {formatReference(ref)}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ===== NOTAS AL FINAL ===== */}
              {config.bodySections?.footnotes && (
                <>
                  {/* Salto de página */}
                  <div className="relative my-4">
                    <div className="border-t-2 border-dashed border-gray-300" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Notas al Final
                    </span>
                  </div>

                  <div className="px-[1in] py-4">
                    <h3 className="text-center font-bold" style={{ ...apaTextStyle, margin: 0, fontSize: '12pt' }}>
                      Notas
                    </h3>
                    <div style={apaTextStyle}>
                      {config.bodySections.footnotes.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => (
                        <p 
                          key={index} 
                          style={{ textIndent: '0.5in', margin: 0 }}
                        >
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Estado vacío - placeholder */
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center text-gray-400 space-y-3">
                <FileText className="h-12 w-12 mx-auto opacity-30" />
                <p className="text-sm font-medium">Vista previa del documento</p>
                <p className="text-xs">
                  Completa el formulario para ver una vista previa de tu documento con formato APA 7ª edición
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
