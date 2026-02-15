import { Injectable } from '@nestjs/common';
import { APA_CONFIG } from '../../config/apa.config';
import { Author } from '../../common/interfaces/document-config.interface';
import { Reference } from '../../common/interfaces/reference.interface';
import { IApaFormatterService } from '../../common/interfaces/service.interfaces';

@Injectable()
export class ApaFormatterService implements IApaFormatterService {
  /**
   * Formatea el nombre del autor según APA
   * Formato: Apellido, F. M.
   */
  formatAuthorName(author: Author): string {
    const firstInitial = author.firstName.charAt(0).toUpperCase();
    const middleInitial = author.middleName
      ? ` ${author.middleName.charAt(0).toUpperCase()}.`
      : '';

    return `${author.lastName}, ${firstInitial}.${middleInitial}`;
  }

  /**
   * Formatea múltiples autores según APA
   * 1 autor: Smith, J.
   * 2 autores: Smith, J., & Johnson, M.
   * 3-20 autores: Smith, J., Johnson, M., ..., Anderson, K.
   * 21+ autores: Smith, J., Johnson, M., ... Anderson, K.
   */
  formatMultipleAuthors(authors: Author[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) return this.formatAuthorName(authors[0]);
    if (authors.length === 2) {
      return `${this.formatAuthorName(authors[0])}, & ${this.formatAuthorName(
        authors[1],
      )}`;
    }
    if (authors.length <= 20) {
      const allButLast = authors
        .slice(0, -1)
        .map((a) => this.formatAuthorName(a))
        .join(', ');
      const last = `& ${this.formatAuthorName(authors[authors.length - 1])}`;
      return `${allButLast}, ${last}`;
    }
    // 21+ autores: primeros 19 + ... + último
    const first19 = authors
      .slice(0, 19)
      .map((a) => this.formatAuthorName(a))
      .join(', ');
    const last = this.formatAuthorName(authors[authors.length - 1]);
    return `${first19}, ... ${last}`;
  }

  /**
   * Formatea una referencia bibliográfica según su tipo
   */
  formatReference(reference: Reference): string {
    switch (reference.type) {
      case 'book':
        return this.formatBookReference(reference);
      case 'journal_article':
        return this.formatJournalReference(reference);
      case 'website':
        return this.formatWebsiteReference(reference);
      case 'thesis':
        return this.formatThesisReference(reference);
      default:
        return '';
    }
  }

  private formatBookReference(
    reference: Extract<Reference, { type: 'book' }>,
  ): string {
    const authors = this.formatMultipleAuthors(reference.authors);
    const year = `(${reference.year})`;
    const title = reference.title.endsWith('.')
      ? reference.title
      : `${reference.title}.`;
    const edition = reference.edition ? ` (${reference.edition} ed.)` : '';
    const publisher = reference.publisher;
    const doi = reference.doi ? ` https://doi.org/${reference.doi}` : '';

    return `${authors} ${year}. ${title}${edition} ${publisher}.${doi}`;
  }

  private formatJournalReference(
    reference: Extract<Reference, { type: 'journal_article' }>,
  ): string {
    const authors = this.formatMultipleAuthors(reference.authors);
    const year = `(${reference.year})`;
    const title = reference.title.endsWith('.')
      ? reference.title
      : `${reference.title}.`;
    const journal = reference.journalName;
    const volume = reference.volume ? `, ${reference.volume}` : '';
    const issue = reference.issue ? `(${reference.issue})` : '';
    const pages = reference.pages ? `, ${reference.pages}` : '';
    const doi = reference.doi ? `. https://doi.org/${reference.doi}` : '';

    return `${authors} ${year}. ${title} ${journal}${volume}${issue}${pages}${doi}`;
  }

  private formatWebsiteReference(
    reference: Extract<Reference, { type: 'website' }>,
  ): string {
    const authors =
      reference.authors.length > 0
        ? this.formatMultipleAuthors(reference.authors)
        : reference.websiteName;
    const year = reference.year ? `(${reference.year})` : '(s.f.)';
    const title = reference.title.endsWith('.')
      ? reference.title
      : `${reference.title}.`;
    const siteName = reference.websiteName ? ` ${reference.websiteName}.` : '';
    const url = ` ${reference.url}`;

    return `${authors} ${year}. ${title}${siteName}${url}`;
  }

  private formatThesisReference(
    reference: Extract<Reference, { type: 'thesis' }>,
  ): string {
    const authors = this.formatMultipleAuthors(reference.authors);
    const year = `(${reference.year})`;
    const title = reference.title.endsWith('.')
      ? reference.title
      : `${reference.title}.`;
    const thesisType =
      reference.thesisType === 'doctoral'
        ? 'Tesis doctoral'
        : 'Tesis de maestría';
    const institution = reference.institution;
    const database = reference.database ? ` (${reference.database})` : '';

    return `${authors} ${year}. ${title} [${thesisType}, ${institution}]${database}`;
  }

  /**
   * Obtiene las constantes de configuración APA
   */
  getApaConfig() {
    return APA_CONFIG;
  }

  /**
   * Formatea la fecha según APA (Mes DD, AAAA)
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
}
