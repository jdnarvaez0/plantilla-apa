import { GenerateDocumentDto } from '../../modules/documents/dto/generate-document.dto';

/**
 * Interface para el servicio de documentos
 * Define el contrato para operaciones de generación de documentos
 */
export interface IDocumentsService {
  /**
   * Genera un documento Word con formato APA
   * @param dto - Datos del documento a generar
   * @returns Buffer con el contenido del documento
   */
  generateDocument(dto: GenerateDocumentDto): Promise<Buffer>;

  /**
   * Genera un documento de prueba
   * @returns Buffer con el contenido del documento de prueba
   */
  generateTestDocument(): Promise<Buffer>;
}

/**
 * Interface para el servicio de generación de documentos DOCX
 */
export interface IDocxGeneratorService {
  /**
   * Genera un documento Word completo con formato APA
   * @param config - Configuración del documento
   * @param references - Referencias bibliográficas opcionales
   * @returns Buffer con el contenido del documento
   */
  generateDocument(config: any, references?: any[]): Promise<Buffer>;

  /**
   * Genera un documento simple de prueba
   * @returns Buffer con el contenido del documento
   */
  generateTestDocument(): Promise<Buffer>;
}

/**
 * Interface para el servicio de formateo APA
 */
export interface IApaFormatterService {
  /**
   * Formatea el nombre de un autor según normas APA
   * @param author - Datos del autor
   * @returns String formateado (Apellido, F. M.)
   */
  formatAuthorName(author: any): string;

  /**
   * Formatea múltiples autores según normas APA
   * @param authors - Lista de autores
   * @returns String formateado con todos los autores
   */
  formatMultipleAuthors(authors: any[]): string;

  /**
   * Formatea una referencia bibliográfica según su tipo
   * @param reference - Datos de la referencia
   * @returns String formateado según APA
   */
  formatReference(reference: any): string;

  /**
   * Formatea una fecha según APA (Mes DD, AAAA)
   * @param date - Fecha a formatear
   * @returns String formateado
   */
  formatDate(date: Date | string): string;

  /**
   * Obtiene la configuración APA
   * @returns Objeto de configuración APA
   */
  getApaConfig(): any;
}
