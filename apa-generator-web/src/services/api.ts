import { GenerateDocumentRequest } from '@/types/document.types';

// Determinar la URL base de la API según el entorno
const getApiBaseUrl = (): string => {
  // En el navegador (cliente)
  if (typeof window !== 'undefined') {
    // Si estamos en Docker, usar la variable de entorno o el proxy de Next.js
    // El proxy de Next.js está configurado en next.config.mjs para desarrollo
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }
  
  // En el servidor (SSR/SSG)
  return process.env.API_URL || 'http://backend:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Genera un documento Word con formato APA
   */
  async generateDocument(data: GenerateDocumentRequest): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/documents/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Error desconocido al generar el documento',
      }));
      throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Descarga un archivo Blob
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Genera un documento de prueba
   */
  async generateTestDocument(): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/documents/test`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
