import type { Metadata } from "next";
import { Suspense } from "react";
import { GraduationCap, Shield, BookOpen, Eye, RefreshCw, Zap } from "lucide-react";
import { DocumentForm } from "@/components/forms/document-form";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Metadata específica para la página de inicio
export const metadata: Metadata = {
  title: "Generador de Documentos APA Gratuito",
  description: "Crea portadas, ensayos y trabajos de investigación con formato APA 7ª edición. Genera documentos académicos profesionales en segundos.",
  keywords: ["generador APA", "formato APA", "portada APA", "bibliografía APA", "ensayos APA", "normas APA 7"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Generador de Documentos APA Gratuito",
    description: "Crea portadas, ensayos y trabajos de investigación con formato APA 7ª edición.",
    url: "/",
    type: "website",
  },
};

// Server Component - No "use client" directive
export default function HomePage() {
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
            <span className="hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/50">
              7ª edición
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Suspense fallback={<Skeleton className="h-8 w-24" />}>
              <ConnectionIndicator />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with semantic HTML */}
        <section className="text-center mb-8 max-w-2xl mx-auto" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-4">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Genera documentos académicos en segundos
          </div>
          <h2 id="hero-heading" className="text-3xl font-bold tracking-tight mb-4">
            Documentos académicos
            <span className="text-primary"> con formato APA</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Crea portadas, ensayos y trabajos de investigación con el formato APA 7ª edición.
            Los datos se guardan automáticamente en tu navegador.
          </p>
        </section>

        {/* Form with Error Boundary */}
        <ErrorBoundary>
          <Suspense fallback={<FormSkeleton />}>
            <DocumentForm />
          </Suspense>
        </ErrorBoundary>

        {/* Features Section */}
        <section className="mt-16 max-w-5xl mx-auto" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Características</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Normas APA 7ª Ed."
              description="Márgenes, fuentes, interlineado y sangrías según las normas oficiales."
              color="blue"
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Bibliografía"
              description="Agrega libros, artículos, sitios web y tesis con formato automático."
              color="green"
            />
            <FeatureCard
              icon={<Eye className="h-5 w-5" />}
              title="Vista Previa en Vivo"
              description="Visualiza cómo quedará tu documento antes de descargarlo."
              color="purple"
            />
            <FeatureCard
              icon={<RefreshCw className="h-5 w-5" />}
              title="Auto-Guardado"
              description="Tus datos se guardan automáticamente y persisten entre sesiones."
              color="orange"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} APA Template Generator. Generador de documentos académicos.
            </p>
            <nav aria-label="Enlaces del pie de página">
              <ul className="flex gap-4 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Términos</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// SERVER COMPONENTS (no "use client")
// ============================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20",
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-300 border-border/50">
      <CardContent className="p-6 text-center">
        <div className={`inline-flex items-center justify-center p-2.5 rounded-lg mb-3 transition-colors duration-300 ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function FormSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
      <div className="hidden lg:block">
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}
