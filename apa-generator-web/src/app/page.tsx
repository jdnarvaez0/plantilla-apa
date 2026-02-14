'use client';

import { GraduationCap, Wifi, WifiOff, Shield, BookOpen, Eye, Zap, RefreshCw } from 'lucide-react';
import { DocumentForm } from '@/components/forms/document-form';
import { ErrorBoundary } from '@/components/error-boundary';
import { useApiHealth, ConnectionStatus } from '@/hooks/use-api-health';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">APA Template Generator</h1>
            <span className="hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              7ª edición
            </span>
          </div>
          <ConnectionIndicator />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-4">
            <Zap className="h-3 w-3" />
            Genera documentos académicos en segundos
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Documentos académicos
            <span className="text-primary"> con formato APA</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Crea portadas, ensayos y trabajos de investigación con el formato APA 7ª edición.
            Los datos se guardan automáticamente en tu navegador.
          </p>
        </div>

        {/* Form with Error Boundary */}
        <ErrorBoundary>
          <DocumentForm />
        </ErrorBoundary>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Shield className="h-5 w-5 text-blue-600" />}
            title="Normas APA 7ª Ed."
            description="Márgenes, fuentes, interlineado y sangrías según las normas oficiales."
          />
          <FeatureCard
            icon={<BookOpen className="h-5 w-5 text-green-600" />}
            title="Bibliografía"
            description="Agrega libros, artículos, sitios web y tesis con formato automático."
          />
          <FeatureCard
            icon={<Eye className="h-5 w-5 text-purple-600" />}
            title="Vista Previa en Vivo"
            description="Visualiza cómo quedará tu documento antes de descargarlo."
          />
          <FeatureCard
            icon={<RefreshCw className="h-5 w-5 text-orange-600" />}
            title="Auto-Guardado"
            description="Tus datos se guardan automáticamente y persisten entre sesiones."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 APA Template Generator. Generador de documentos académicos.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow duration-300 group">
      <div className="inline-flex items-center justify-center p-2.5 rounded-lg bg-muted mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ConnectionIndicator() {
  const { status, checkNow } = useApiHealth(30000);

  const statusConfig: Record<ConnectionStatus, { icon: React.ReactNode; label: string; color: string }> = {
    checking: {
      icon: <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />,
      label: 'Verificando...',
      color: 'text-yellow-600 border-yellow-200 bg-yellow-50',
    },
    connected: {
      icon: <Wifi className="h-3 w-3 text-green-600" />,
      label: 'API Conectada',
      color: 'text-green-700 border-green-200 bg-green-50',
    },
    disconnected: {
      icon: <WifiOff className="h-3 w-3 text-red-500" />,
      label: 'API Desconectada',
      color: 'text-red-700 border-red-200 bg-red-50',
    },
  };

  const cfg = statusConfig[status];

  return (
    <button
      onClick={checkNow}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-200 hover:shadow-sm ${cfg.color}`}
      title={`Estado: ${cfg.label}. Clic para verificar de nuevo.`}
    >
      {cfg.icon}
      <span className="hidden sm:inline">{cfg.label}</span>
    </button>
  );
}
