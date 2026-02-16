/**
 * Generador de datos de ejemplo (Lorem Ipsum) para el formulario APA
 */

// Textos de ejemplo para cada sección
const LOREM_TEXTS = {
  introduction: [
    `El desarrollo de la inteligencia artificial ha transformado radicalmente múltiples sectores de la sociedad contemporánea. Desde sus inicios en la década de 1950, esta disciplina ha experimentado avances significativos que han redefinido la manera en que interactuamos con la tecnología.`,
    `La presente investigación surge ante la necesidad de comprender los efectos del aprendizaje automático en los procesos educativos modernos. Diversos estudios han demostrado que la implementación de estas tecnologías puede potenciar significativamente los resultados de aprendizaje en estudiantes de diferentes niveles educativos.`,
    `En las últimas décadas, el cambio climático se ha convertido en uno de los desafíos más apremiantes para la humanidad. Las evidencias científicas acumuladas sugieren que las actividades humanas son el principal factor detrás del calentamiento global observado desde el siglo XIX.`,
    `La psicología positiva ha emergido como un campo de estudio fundamental para comprender el bienestar humano. A diferencia de la psicología tradicional centrada en la patología, esta disciplina se enfoca en identificar y fortalecer los aspectos positivos del funcionamiento humano.`,
  ],
  method: [
    `Los participantes fueron seleccionados mediante un muestreo aleatorio estratificado de la población estudiantil de la Universidad Nacional. Se reclutaron 150 estudiantes (75 mujeres y 75 hombres) con edades comprendidas entre 18 y 25 años (M = 21.3, DE = 2.1). Los criterios de inclusión incluían estar matriculados en el segundo año o superior y tener conocimientos básicos de informática.`,
    `Se utilizó un diseño cuasiexperimental de tipo pretest-posttest con grupo control. La variable independiente fue el método de enseñanza (tradicional vs. basado en tecnología), mientras que la variable dependiente fue el rendimiento académico medido mediante una prueba estandarizada.`,
    `Para la recolección de datos se emplearon tres instrumentos: (a) un cuestionario de autoeficacia validado previamente (α = .87), (b) una escala de satisfacción con el aprendizaje desarrollada ad hoc, y (c) registros de participación en las actividades del curso. Todos los instrumentos fueron aplicados en formato digital a través de la plataforma institucional.`,
    `El procedimiento experimental se desarrolló durante un semestre académico completo (16 semanas). Las sesiones de intervención se realizaron dos veces por semana con una duración de 90 minutos cada una. Se mantuvo un registro detallado de la asistencia y participación de los estudiantes en cada sesión.`,
  ],
  results: [
    `Los análisis descriptivos revelaron que el grupo experimental (M = 85.4, DE = 8.2) obtuvo puntuaciones significativamente superiores al grupo control (M = 78.1, DE = 9.5) en la prueba de rendimiento postest, t(148) = 4.73, p < .001, d = 0.82. Estos resultados indican un efecto positivo considerable de la intervención sobre el aprendizaje de los participantes.`,
    `El análisis de varianza de medidas repetidas mostró una interacción significativa entre el tiempo (pre vs. post) y el grupo (experimental vs. control), F(1, 148) = 18.92, p < .001, η²p = .11. Esta interacción sugiere que el cambio en los niveles de autoeficacia fue diferente entre los grupos a lo largo del tiempo.`,
    `Con respecto a las correlaciones, se encontró una asociación positiva y significativa entre la participación en las actividades online y el rendimiento final (r = .42, p < .01). No obstante, la satisfacción con el curso no mostró una correlación significativa con el rendimiento académico (r = .11, p = .18).`,
    `Los análisis cualitativos de las respuestas abiertas identificaron tres temas principales: (a) la flexibilidad horaria como ventaja principal del método virtual, (b) la dificultad para mantener la motivación en entornos remotos, y (c) la importancia de la retroalimentación oportuna del docente.`,
  ],
  discussion: [
    `Los resultados de este estudio confirman la hipótesis principal de que el enfoque pedagógico basado en tecnología mejora significativamente el rendimiento académico de los estudiantes universitarios. Estos hallazgos son consistentes con investigaciones previas realizadas por Chen y Wang (2021) y Johnson (2022), quienes también encontraron efectos positivos de intervenciones similares.`,
    `Un aspecto particularmente relevante de nuestros resultados es la magnitud del efecto observado (d = 0.82), que según los criterios convencionales se considera un efecto grande (Cohen, 1992). Esto sugiere que la intervención no solo es estadísticamente significativa, sino también prácticamente relevante para la mejora del aprendizaje en contextos educativos reales.`,
    `Es importante considerar algunas limitaciones del presente estudio. En primer lugar, el tamaño de la muestra, aunque adecuado según el análisis de potencia, limita la generalización de los resultados a poblaciones más amplias. En segundo lugar, el período de seguimiento de 16 semanas no permite evaluar los efectos a largo plazo de la intervención.`,
    `Futuras investigaciones deberían explorar los mecanismos subyacentes que explican por qué el método tecnológico produce mejores resultados. Sería especialmente valioso examinar el papel de variables mediadoras como el engagement, la autorregulación del aprendizaje y la interacción social entre pares en entornos virtuales.`,
  ],
  footnotes: [
    `Agradecimientos: Los autores desean expresar su gratitud a los estudiantes participantes y al equipo docente que colaboró en la implementación de este estudio. Este trabajo fue parcialmente financiado por el Programa de Investigación de la Universidad Nacional (Proyecto #2024-056).`,
    `Nota de los autores: La correspondencia concerniente a este artículo debe dirigirse al primer autor. Los datos y materiales de este estudio están disponibles bajo solicitud para fines de replicación.`,
    `Conflicto de intereses: Los autores declaran que no existe ningún conflicto de intereses potencial respecto a la investigación, autoría y publicación de este artículo.`,
    `Contribuciones: Todos los autores contribuyeron de manera sustancial al diseño del estudio, análisis de datos y redacción del manuscrito. Los autores aprueban la versión final para su publicación.`,
  ],
  abstract: [
    `Esta investigación examinó el impacto de un programa de intervención basado en tecnología sobre el rendimiento académico de estudiantes universitarios. Mediante un diseño cuasiexperimental con 150 participantes, se encontró que el grupo experimental obtuvo resultados significativamente superiores al grupo control (d = 0.82). Los resultados sugieren que la integración efectiva de tecnología en el aula puede potenciar el aprendizaje en contextos educativos superiores.`,
    `El presente estudio analiza las relaciones entre el uso de redes sociales y el bienestar psicológico en adolescentes. Participaron 230 jóvenes de 13 a 17 años que completaron medidas de uso de redes, autoestima, ansiedad y apoyo social percibido. Los análisis de regresión revelaron que el uso problemático de redes sociales predice negativamente el bienestar, mientras que el uso activo y comunicativo se asocia con mayores niveles de apoyo social.`,
  ],
};

// Títulos de ejemplo
const SAMPLE_TITLES = [
  "Impacto del Aprendizaje Automático en la Educación Superior: Un Estudio Cuasiexperimental",
  "Relaciones entre Uso de Redes Sociales y Bienestar Psicológico en Adolescentes",
  "Eficacia de Intervenciones Psicológicas Basadas en Mindfulness para la Ansiedad",
  "Adaptación al Cambio Climático en Comunidades Rurales de América Latina",
  "Desarrollo de Competencias Digitales en Docentes Universitarios: Un Enfoque Longitudinal",
  "Factores Predictores del Éxito Académico en Estudiantes de Primer Ingreso",
  "La Inteligencia Emocional como Mediador del Estrés Laboral en Profesionales de la Salud",
];

// Instituciones de ejemplo
const SAMPLE_INSTITUTIONS = [
  "Universidad Nacional de Educación a Distancia",
  "Universidad de Buenos Aires",
  "Universidad Nacional Autónoma de México",
  "Pontificia Universidad Católica de Chile",
  "Universidad de los Andes",
  "Universidad Complutense de Madrid",
  "Universidad de São Paulo",
];

// Nombres de ejemplo
const SAMPLE_FIRST_NAMES = ["María", "Juan", "Ana", "Carlos", "Laura", "Pedro", "Sofía", "Diego", "Carmen", "Luis"];
const SAMPLE_LAST_NAMES = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín"];

// Palabras clave de ejemplo
const SAMPLE_KEYWORDS = [
  ["aprendizaje automático", "educación superior", "rendimiento académico", "tecnología educativa"],
  ["redes sociales", "bienestar psicológico", "adolescentes", "salud mental"],
  ["mindfulness", "ansiedad", "intervención psicológica", "terapia cognitiva"],
  ["cambio climático", "adaptación", "comunidades rurales", "sostenibilidad"],
  ["competencias digitales", "formación docente", "educación virtual", "TIC"],
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName() {
  const firstName = getRandomItem(SAMPLE_FIRST_NAMES);
  const middleName = Math.random() > 0.5 ? getRandomItem(["A.", "M.", "J.", "R.", "E.", "L."]) : undefined;
  const lastName = getRandomItem(SAMPLE_LAST_NAMES);
  return { firstName, middleName, lastName };
}

function generateRandomDate(): string {
  const now = new Date();
  const future = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  return future.toISOString().split('T')[0];
}

import { ReferenceType } from '@/types/document.types';
import type { Reference, Author } from '@/types/document.types';

export interface SampleDocumentData {
  type: string;
  title: string;
  authors: Author[];
  institution: string;
  course: string;
  professor: string;
  dueDate: string;
  abstract: string;
  keywords: string[];
  bodySections: {
    introduction: string;
    method: string;
    results: string;
    discussion: string;
    footnotes: string;
  };
  references: Reference[];
}

const SAMPLE_REFERENCES: Reference[] = [
  {
    type: ReferenceType.BOOK,
    authors: [{ firstName: 'John', lastName: 'Smith' }],
    year: 2020,
    title: 'Research Methods in Psychology: A Comprehensive Guide',
    publisher: 'Academic Press',
  },
  {
    type: ReferenceType.BOOK,
    authors: [{ firstName: 'María', lastName: 'González' }, { firstName: 'Carlos', lastName: 'Rodríguez' }],
    year: 2019,
    title: 'Psicología del Aprendizaje en Entornos Digitales',
    publisher: 'Editorial Universitaria',
  },
  {
    type: ReferenceType.JOURNAL_ARTICLE,
    authors: [{ firstName: 'Sarah', lastName: 'Johnson' }],
    year: 2022,
    title: 'The Impact of Technology Integration on Student Engagement and Learning Outcomes',
    journalName: 'Journal of Educational Psychology',
    volume: '114',
    issue: '3',
    pages: '445-462',
    doi: '10.1037/edu0000689',
  },
  {
    type: ReferenceType.JOURNAL_ARTICLE,
    authors: [{ firstName: 'Wei', lastName: 'Chen' }, { firstName: 'Li', lastName: 'Wang' }],
    year: 2021,
    title: 'Artificial Intelligence Applications in Higher Education: A Systematic Review',
    journalName: 'Computers & Education',
    volume: '168',
    pages: '104-115',
    doi: '10.1016/j.compedu.2021.104212',
  },
  {
    type: ReferenceType.BOOK,
    authors: [{ firstName: 'Jacob', lastName: 'Cohen' }],
    year: 1992,
    title: 'A Power Primer',
    publisher: 'Psychological Bulletin',
  },
  {
    type: ReferenceType.WEBSITE,
    authors: [{ firstName: 'David', lastName: 'Anderson' }],
    year: 2023,
    title: 'Best Practices in Online Education',
    websiteName: 'Educational Technology Portal',
    url: 'https://www.edtechportal.org/best-practices',
  },
  {
    type: ReferenceType.THESIS,
    authors: [{ firstName: 'Ana', lastName: 'Martínez' }],
    year: 2022,
    title: 'Estrategias de Aprendizaje Autónomo en Entornos Virtuales: Un Estudio Longitudinal',
    institution: 'Universidad Nacional de Educación a Distancia',
    thesisType: 'doctoral',
  },
];

export function generateSampleData(): SampleDocumentData {
  const numAuthors = Math.random() > 0.7 ? 2 : 1; // 30% chance of 2 authors
  const authors = Array.from({ length: numAuthors }, generateRandomName);
  
  // Seleccionar 3-5 referencias aleatorias
  const numReferences = Math.floor(Math.random() * 3) + 3; // 3 to 5
  const shuffledRefs = [...SAMPLE_REFERENCES].sort(() => 0.5 - Math.random());
  const selectedRefs = shuffledRefs.slice(0, numReferences);
  
  return {
    type: "research_paper",
    title: getRandomItem(SAMPLE_TITLES),
    authors,
    institution: getRandomItem(SAMPLE_INSTITUTIONS),
    course: "Metodología de la Investigación 301",
    professor: "Dr. " + getRandomItem(SAMPLE_LAST_NAMES),
    dueDate: generateRandomDate(),
    abstract: getRandomItem(LOREM_TEXTS.abstract),
    keywords: getRandomItem(SAMPLE_KEYWORDS),
    bodySections: {
      introduction: LOREM_TEXTS.introduction.join('\n\n'),
      method: LOREM_TEXTS.method.join('\n\n'),
      results: LOREM_TEXTS.results.join('\n\n'),
      discussion: LOREM_TEXTS.discussion.join('\n\n'),
      footnotes: getRandomItem(LOREM_TEXTS.footnotes),
    },
    references: selectedRefs,
  };
}

// Textos más cortos para rellenar secciones individuales
export function generateLoremParagraph(minSentences = 3, maxSentences = 6): string {
  const sentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    "Deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    "Consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  ];
  
  const numSentences = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const shuffled = [...sentences].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSentences).join(' ');
}

export function generateLoremText(paragraphs = 3): string {
  return Array.from({ length: paragraphs }, () => generateLoremParagraph()).join('\n\n');
}
