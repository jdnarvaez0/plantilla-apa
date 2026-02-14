/**
 * Configuración de Normas APA 7ª Edición
 * Todas las medidas en twips (1 cm = 567 twips, 1 pulgada = 1440 twips)
 */

export const APA_CONFIG = {
  // Márgenes: 2.54 cm (1 pulgada) en todos los lados
  margins: {
    top: 1440,      // 1 pulgada
    bottom: 1440,   // 1 pulgada
    left: 1440,     // 1 pulgada
    right: 1440,    // 1 pulgada
  },

  // Tipografía
  typography: {
    font: 'Times New Roman',
    size: 24,           // 12pt = 24 half-points
    lineSpacing: 480,   // Interlineado doble: 240 * 2
    paragraphSpacing: {
      before: 0,
      after: 0,
    },
  },

  // Sangrías
  indentation: {
    paragraph: 720,     // 1.27 cm (0.5 pulgadas) = 720 twips
    reference: -720,    // Sangría francesa: -720 para hanging indent
  },

  // Numeración de página
  pageNumber: {
    position: 'topRight', // Esquina superior derecha
    startingPage: 1,
  },

  // Portada
  coverPage: {
    titlePosition: 'center', // Título centrado en el medio superior
    titleSpacing: {
      before: 36,       // 18pt de espacio antes
      after: 24,        // 12pt de espacio después
    },
    infoSpacing: 12,    // 6pt entre elementos de información
  },

  // Encabezado (solo para versión profesional)
  header: {
    runningHead: {
      maxLength: 50,
      prefix: 'RUNNING HEAD: ',
    },
  },

  // Títulos
  headings: {
    level1: {
      alignment: 'center',
      bold: true,
      fontSize: 24,     // 12pt
    },
    level2: {
      alignment: 'left',
      bold: true,
      fontSize: 24,
    },
    level3: {
      alignment: 'left',
      bold: true,
      italic: true,
      fontSize: 24,
    },
  },
} as const;

// Conversiones útiles
export const CONVERSIONS = {
  cmToTwips: (cm: number): number => Math.round(cm * 567),
  inchesToTwips: (inches: number): number => Math.round(inches * 1440),
  ptToHalfPoints: (pt: number): number => pt * 2,
};
