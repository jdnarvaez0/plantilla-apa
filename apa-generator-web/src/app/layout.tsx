import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

// Separate viewport export (Next.js 14+ best practice)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "APA Template Generator - Generador de Documentos Académicos",
    template: "%s | APA Template Generator",
  },
  description: "Genera documentos académicos con formato APA 7ª edición. Crea portadas, ensayos y trabajos de investigación en segundos.",
  keywords: ["APA", "formato APA", "generador APA", "documentos académicos", "portada APA", "normas APA"],
  authors: [{ name: "APA Template Generator" }],
  creator: "APA Template Generator",
  publisher: "APA Template Generator",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://apa-generator.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "APA Template Generator",
    title: "APA Template Generator - Generador de Documentos Académicos",
    description: "Genera documentos académicos con formato APA 7ª edición. Crea portadas, ensayos y trabajos de investigación en segundos.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "APA Template Generator - Generador de documentos académicos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APA Template Generator - Generador de Documentos Académicos",
    description: "Genera documentos académicos con formato APA 7ª edición.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
