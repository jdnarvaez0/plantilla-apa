import { GraduationCap } from 'lucide-react';
import { DocumentForm } from '@/components/forms/document-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">APA Template Generator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Genera documentos académicos
            <span className="text-primary"> con formato APA</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Crea portadas, ensayos y trabajos de investigación con el formato APA 7ª edición 
            en segundos. Sin complicaciones, 100% gratuito.
          </p>
        </div>

        {/* Form */}
        <DocumentForm />

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <FeatureCard
            title="Normas APA 7ª Edición"
            description="Márgenes, fuentes, interlineado y sangrías según las normas oficiales."
          />
          <FeatureCard
            title="Múltiples Formatos"
            description="Ensayos, trabajos de investigación, artículos de revisión y más."
          />
          <FeatureCard
            title="Exportación Word"
            description="Descarga tu documento en formato .docx listo para entregar."
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

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
