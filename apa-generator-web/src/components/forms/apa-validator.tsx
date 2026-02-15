'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentConfig, Reference, ReferenceType } from '@/types/document.types';

type ValidationLevel = 'success' | 'warning' | 'error';

interface ValidationRule {
    id: string;
    category: string;
    label: string;
    level: ValidationLevel;
    message: string;
}

interface ApaValidatorProps {
    config: Partial<DocumentConfig>;
    references: Reference[];
}

function validateDocument(
    config: Partial<DocumentConfig>,
    references: Reference[],
): ValidationRule[] {
    const rules: ValidationRule[] = [];

    // ── Title ──
    if (!config.title || config.title.trim().length < 3) {
        rules.push({
            id: 'title-required',
            category: 'Título',
            label: 'Título requerido',
            level: 'error',
            message: 'El título del trabajo es obligatorio (mínimo 3 caracteres).',
        });
    } else {
        const wordCount = config.title.trim().split(/\s+/).length;
        if (wordCount > 12) {
            rules.push({
                id: 'title-length',
                category: 'Título',
                label: 'Título largo',
                level: 'warning',
                message: `Tu título tiene ${wordCount} palabras. APA recomienda que sea conciso (≤12 palabras).`,
            });
        } else {
            rules.push({
                id: 'title-ok',
                category: 'Título',
                label: 'Título correcto',
                level: 'success',
                message: `Título con ${wordCount} palabras — dentro del rango recomendado.`,
            });
        }
    }

    // ── Authors ──
    const authors = config.authors || (config.author ? [config.author] : []);
    if (authors.length === 0 || !authors[0]?.firstName || !authors[0]?.lastName) {
        rules.push({
            id: 'author-required',
            category: 'Autores',
            label: 'Autor requerido',
            level: 'error',
            message: 'Debe haber al menos un autor con nombre y apellido.',
        });
    } else {
        const incompleteAuthors = authors.filter(a => !a.firstName || !a.lastName);
        if (incompleteAuthors.length > 0) {
            rules.push({
                id: 'author-incomplete',
                category: 'Autores',
                label: 'Autor incompleto',
                level: 'warning',
                message: `${incompleteAuthors.length} autor(es) tienen campos incompletos.`,
            });
        } else {
            rules.push({
                id: 'author-ok',
                category: 'Autores',
                label: `${authors.length} autor${authors.length > 1 ? 'es' : ''}`,
                level: 'success',
                message: authors.length > 1
                    ? `${authors.length} autores configurados correctamente.`
                    : 'Autor configurado correctamente.',
            });
        }
    }

    // ── Institution ──
    if (!config.institution || config.institution.trim().length < 2) {
        rules.push({
            id: 'institution-required',
            category: 'Institución',
            label: 'Institución requerida',
            level: 'error',
            message: 'La institución educativa es obligatoria.',
        });
    } else {
        rules.push({
            id: 'institution-ok',
            category: 'Institución',
            label: 'Institución completa',
            level: 'success',
            message: 'Institución configurada correctamente.',
        });
    }

    // ── Abstract ──
    if (config.abstract && config.abstract.trim().length > 0) {
        const abstractWords = config.abstract.trim().split(/\s+/).filter(Boolean).length;
        if (abstractWords > 250) {
            rules.push({
                id: 'abstract-length',
                category: 'Abstract',
                label: 'Abstract extenso',
                level: 'warning',
                message: `Tu abstract tiene ${abstractWords} palabras. APA limita a 250 palabras máximo.`,
            });
        } else if (abstractWords < 50) {
            rules.push({
                id: 'abstract-short',
                category: 'Abstract',
                label: 'Abstract breve',
                level: 'warning',
                message: `Tu abstract tiene ${abstractWords} palabras. Considera expandirlo (mínimo ~150 palabras recomendado).`,
            });
        } else {
            rules.push({
                id: 'abstract-ok',
                category: 'Abstract',
                label: 'Abstract correcto',
                level: 'success',
                message: `Abstract con ${abstractWords}/250 palabras — dentro del rango APA.`,
            });
        }
    }

    // ── Keywords ──
    const keywords = config.keywords || [];
    if (config.abstract && config.abstract.trim().length > 0) {
        if (keywords.length === 0) {
            rules.push({
                id: 'keywords-missing',
                category: 'Keywords',
                label: 'Sin palabras clave',
                level: 'warning',
                message: 'Si incluyes abstract, APA recomienda 3-5 palabras clave debajo.',
            });
        } else if (keywords.length < 3) {
            rules.push({
                id: 'keywords-few',
                category: 'Keywords',
                label: 'Pocas palabras clave',
                level: 'warning',
                message: `Tienes ${keywords.length} palabra(s) clave. APA recomienda entre 3 y 5.`,
            });
        } else if (keywords.length > 5) {
            rules.push({
                id: 'keywords-many',
                category: 'Keywords',
                label: 'Muchas palabras clave',
                level: 'warning',
                message: `Tienes ${keywords.length} palabras clave. APA recomienda entre 3 y 5.`,
            });
        } else {
            rules.push({
                id: 'keywords-ok',
                category: 'Keywords',
                label: 'Keywords correctas',
                level: 'success',
                message: `${keywords.length} palabras clave — dentro del rango recomendado.`,
            });
        }
    }

    // ── Due Date ──
    if (!config.dueDate) {
        rules.push({
            id: 'date-required',
            category: 'Fecha',
            label: 'Fecha requerida',
            level: 'error',
            message: 'La fecha de entrega es obligatoria.',
        });
    } else {
        rules.push({
            id: 'date-ok',
            category: 'Fecha',
            label: 'Fecha configurada',
            level: 'success',
            message: 'Fecha de entrega establecida.',
        });
    }

    // ── References ──
    if (references.length === 0) {
        rules.push({
            id: 'refs-missing',
            category: 'Referencias',
            label: 'Sin referencias',
            level: 'warning',
            message: 'No hay referencias bibliográficas. La mayoría de trabajos APA requieren al menos una.',
        });
    } else {
        rules.push({
            id: 'refs-count',
            category: 'Referencias',
            label: `${references.length} referencia${references.length > 1 ? 's' : ''}`,
            level: 'success',
            message: `${references.length} referencia(s) agregada(s).`,
        });

        // Check for DOI in books and journal articles
        const needDoi = references.filter(
            (r) =>
                (r.type === ReferenceType.BOOK || r.type === ReferenceType.JOURNAL_ARTICLE) &&
                !('doi' in r && r.doi && r.doi.trim().length > 0),
        );
        if (needDoi.length > 0) {
            rules.push({
                id: 'refs-doi',
                category: 'Referencias',
                label: 'DOI faltante',
                level: 'warning',
                message: `${needDoi.length} referencia(s) sin DOI. APA recomienda incluir el DOI cuando esté disponible.`,
            });
        }

        // Check for incomplete authors in references
        const refsWithBadAuthors = references.filter(
            (r) => r.authors.length === 0 || r.authors.some((a) => !a.firstName || !a.lastName),
        );
        if (refsWithBadAuthors.length > 0) {
            rules.push({
                id: 'refs-authors',
                category: 'Referencias',
                label: 'Autores incompletos',
                level: 'warning',
                message: `${refsWithBadAuthors.length} referencia(s) tienen autores con datos incompletos.`,
            });
        }
    }

    return rules;
}

export function ApaValidator({ config, references }: ApaValidatorProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const rules = useMemo(() => validateDocument(config, references), [config, references]);

    const errorCount = rules.filter((r) => r.level === 'error').length;
    const warningCount = rules.filter((r) => r.level === 'warning').length;
    const successCount = rules.filter((r) => r.level === 'success').length;
    const totalChecks = rules.length;

    const overallLevel: ValidationLevel =
        errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success';

    const overallColor = {
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400',
    }[overallLevel];

    const overallBg = {
        success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    }[overallLevel];

    const completionPercentage = totalChecks > 0
        ? Math.round((successCount / totalChecks) * 100)
        : 0;

    const levelIcon = {
        success: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />,
        error: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />,
    };

    return (
        <Card className={`w-full transition-colors duration-300 ${overallBg}`}>
            <CardHeader className="pb-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between group"
                >
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ShieldCheck className={`h-4 w-4 ${overallColor}`} />
                        <span>Validador APA</span>
                        {/* Progress bar */}
                        <div className="hidden sm:flex items-center gap-2 ml-2">
                            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${overallLevel === 'error'
                                            ? 'bg-red-500'
                                            : overallLevel === 'warning'
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                        }`}
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className={`text-xs font-mono ${overallColor}`}>{completionPercentage}%</span>
                        </div>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {errorCount > 0 && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                                {errorCount} error{errorCount > 1 ? 'es' : ''}
                            </Badge>
                        )}
                        {warningCount > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400">
                                {warningCount} aviso{warningCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                        {errorCount === 0 && warningCount === 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400">
                                ✓ Todo correcto
                            </Badge>
                        )}
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                    </div>
                </button>
            </CardHeader>
            {isExpanded && (
                <CardContent className="pt-0">
                    <div className="space-y-1.5">
                        {/* Show errors first, then warnings, then successes */}
                        {[...rules]
                            .sort((a, b) => {
                                const order = { error: 0, warning: 1, success: 2 };
                                return order[a.level] - order[b.level];
                            })
                            .map((rule) => (
                                <div
                                    key={rule.id}
                                    className="flex items-start gap-2 py-1.5 px-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
                                >
                                    {levelIcon[rule.level]}
                                    <div className="min-w-0 flex-1">
                                        <span className="font-medium text-xs">{rule.label}</span>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {rule.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
