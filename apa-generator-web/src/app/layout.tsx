import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APA Template Generator - Generador de Documentos Académicos",
  description: "Genera documentos académicos con formato APA 7ª edición. Crea portadas, ensayos y trabajos de investigación en segundos.",
  keywords: ["APA", "formato APA", "generador APA", "documentos académicos", "portada APA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
