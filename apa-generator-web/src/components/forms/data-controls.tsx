'use client';

import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDocumentStore } from '@/store/document-store';
import { DocumentConfig, Reference } from '@/types/document.types';

export function DataControls() {
    const { documentConfig, references, setDocumentConfig, setReferences } = useDocumentStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        try {
            const data = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                config: documentConfig,
                references,
            };

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            // Generar nombre de archivo basado en el título o fecha
            const safeTitle = documentConfig.title
                ? documentConfig.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                : 'documento_apa';
            link.download = `${safeTitle}_backup.json`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Datos exportados correctamente');
        } catch (error) {
            console.error('Error exportando datos:', error);
            toast.error('Error al exportar los datos');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validación básica de estructura
                if (!data.config || !Array.isArray(data.references)) {
                    throw new Error('El archivo no tiene el formato correcto');
                }

                // Cargar datos al store
                setDocumentConfig(data.config as DocumentConfig);

                // Asegurarse de que las referencias tengan ID (si vienen sin ID del JSON)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validReferences = (data.references as Array<Reference & { id?: string }>).map(ref => ({
                    ...ref,
                    id: ref.id || crypto.randomUUID()
                }));

                setReferences(validReferences as Reference[]);

                toast.success('Datos importados correctamente');
            } catch (error) {
                console.error('Error importando datos:', error);
                toast.error('Error al importar el archivo: Formato inválido');
            } finally {
                // Limpiar input para permitir seleccionar el mismo archivo de nuevo
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="flex gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />

            <Button
                variant="outline"
                size="sm"
                onClick={handleImportClick}
                title="Importar configuración desde un archivo JSON"
            >
                <Upload className="h-4 w-4 mr-2" />
                Importar
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                title="Exportar configuración actual a un archivo JSON"
            >
                <Download className="h-4 w-4 mr-2" />
                Exportar
            </Button>
        </div>
    );
}
