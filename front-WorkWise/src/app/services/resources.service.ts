import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'document' | 'article' | 'tip';
  category: 'interview' | 'job-search' | 'cv' | 'career' | 'general';
  url: string;
  duration?: string; // Para videos
  fileSize?: string; // Para documentos
  tags: string[];
  featured: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  private resources: Resource[] = [
    {
      id: 1,
      title: 'Cómo preparar una entrevista técnica',
      description:
        'Guía completa para prepararte para entrevistas técnicas en el sector tecnológico.',
      type: 'video',
      category: 'interview',
      url: 'https://www.youtube.com/watch?v=qi19F48-WE4',
      duration: '20:41',
      tags: ['entrevista', 'técnica', 'preparación'],
      featured: true,
    },
    {
      id: 2,
      title: 'Plantilla de CV profesional',
      description:
        'Descarga nuestra plantilla optimizada para ATS y reclutadores.',
      type: 'document',
      category: 'cv',
      url: '/Documents/plantilla_hoja_de_vida_ATS.pdf',
      fileSize: '3 MB',
      tags: ['cv', 'plantilla', 'profesional'],
      featured: true,
    },
    {
      id: 3,
      title: '10 Errores comunes en búsqueda de empleo',
      description:
        'Aprende a evitar los errores más comunes que cometen los candidatos.',
      type: 'article',
      category: 'job-search',
      url: 'https://online-usc-edu.translate.goog/news/top-common-job-search-mistakes-how-to-avoid/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc',
      tags: ['errores', 'consejos', 'búsqueda'],
      featured: false,
    },
    {
      id: 4,
      title: 'Cómo destacar en una entrevista grupal',
      description:
        'Estrategias para sobresalir en procesos de selección grupales.',
      type: 'video',
      category: 'interview',
      url: 'https://www.youtube.com/watch?v=I-tZbwo5VsI',
      duration: '6:37',
      tags: ['entrevista', 'grupal', 'destacar'],
      featured: false,
    },
    {
      id: 5,
      title: 'Networking - otra forma de mejorar en tu búsqueda de empleo',
      description:
        'Técnicas prácticas para usar el networking como parte clave de tu estrategia de búsqueda de trabajo.',
      type: 'video',
      category: 'job-search',
      url: 'https://www.youtube.com/watch?v=cUnFTXYwFZE',
      duration: '5:30', // estimado
      tags: ['networking', 'empleo', 'búsqueda de trabajo'],
      featured: false,
    },
    {
      id: 6,
      title: 'Preguntas frecuentes en entrevistas',
      description:
        'Lista de preguntas comunes y cómo responderlas efectivamente.',
      type: 'article',
      category: 'interview',
      url: 'https://www.robertwalters.mx/tendencias-de-talento/consejos-de-carrera/blog/preguntas-habituales-entrevista-laboral.html',
      tags: ['preguntas', 'entrevista', 'preparación'],
      featured: false,
    },
    {
      id: 7,
      title: 'Tips para negociar tu salario',
      description: 'Aprende a negociar tu remuneración de manera efectiva.',
      type: 'tip',
      category: 'career',
      url: 'https://www.michaelpage.es/advice/candidatos/desarrollo-profesional/¿vas-negociar-tu-subida-de-sueldo-te-damos-las-7-claves-que',
      tags: ['salario', 'negociación', 'consejos'],
      featured: true,
    },
    {
      id: 8,
      title: 'Preparación para assessment centers',
      description:
        'Cómo enfrentar exitosamente las pruebas de assessment center.',
      type: 'video',
      category: 'interview',
      url: 'https://www.youtube.com/watch?v=bZ-adjhjIAc',
      duration: '5:40',
      tags: ['assessment', 'pruebas', 'selección'],
      featured: false,
    },
    {
      id: 9,
      title: '10 consejos para una búsqueda de trabajo efectiva',
      description:
        'Guía con recomendaciones clave para definir objetivos, optimizar el currículum, usar redes de contactos y más. ',
      type: 'article',
      category: 'job-search',
      url: 'https://aula10formacion.com/blog/10-consejos-para-una-busqueda-de-trabajo-efectiva/',
      tags: ['consejos', 'búsqueda de empleo', 'trabajo efectivo'],
      featured: false,
    },
    {
      id: 10,
      title: 'Manual de búsqueda activa de empleo',
      description:
        'Manual práctico para planificar, organizar y ejecutar una búsqueda activa de empleo con estrategias, cronograma y herramientas. ',
      type: 'document',
      category: 'job-search',
      url: 'https://www.ayto-villacanada.es/sites/default/files/files/manual_busqueda_empleo.pdf',
      fileSize: '1.2 MB',
      tags: ['manual', 'empleo', 'planificación'],
      featured: false,
    },
    {
      id: 11,
      title: 'Estrategias de búsqueda de empleo (PDF)',
      description:
        'Documento con técnicas para buscar empleo: networking, fuentes no tradicionales y cómo organizar tu plan de acción. ',
      type: 'document',
      category: 'job-search',
      url: 'https://sitioanterior.cucea.udg.mx/include/publicaciones/coorinv/pdf/estrategia_de_busqueda_de_empleo.pdf',
      fileSize: '800 KB',
      tags: ['estrategia', 'empleo', 'plan de búsqueda'],
      featured: false,
    },
    {
      id: 12,
      title: 'Cómo organizar tu búsqueda de empleo',
      description:
        'Guía práctica de la OIT para aprovechar herramientas digitales, planificar tu tiempo y ser más estratégico en la búsqueda. ',
      type: 'document',
      category: 'job-search',
      url: 'https://www.ilo.org/sites/default/files/wcmsp5/groups/public/%40ed_emp/documents/publication/wcms_829542.pdf',
      fileSize: '1.5 MB',
      tags: ['organización', 'planificación', 'empleo'],
      featured: false,
    },
    {
      id: 13,
      title: '6 consejos para negociar un mejor salario',
      description:
        'Video con estrategias claras para pedir más en tu oferta: cómo presentar tu valor, argumentos y tácticas para negociar con confianza.',
      type: 'video',
      category: 'job-search',
      url: 'https://www.youtube.com/watch?v=iXZMzcm0f8I', 
      duration: '7:45', // aproximado
      tags: ['negociación', 'salario', 'entrevista'],
      featured: false,
    },
  ];

  constructor(private http: HttpClient) {}

  getResources(): Observable<Resource[]> {
    return of(this.resources);
  }

  getResourceById(id: number): Observable<Resource | undefined> {
    const resource = this.resources.find((r) => r.id === id);
    return of(resource);
  }

  getResourcesByCategory(category: string): Observable<Resource[]> {
    const filtered = this.resources.filter((r) => r.category === category);
    return of(filtered);
  }

  getResourcesByType(type: string): Observable<Resource[]> {
    const filtered = this.resources.filter((r) => r.type === type);
    return of(filtered);
  }

  getFeaturedResources(): Observable<Resource[]> {
    const featured = this.resources.filter((r) => r.featured);
    return of(featured);
  }

  searchResources(query: string): Observable<Resource[]> {
    const filtered = this.resources.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered);
  }

  getCategories(): Observable<
    { value: string; label: string; count: number }[]
  > {
    const categories = [
      {
        value: 'interview',
        label: 'Entrevistas',
        count: this.resources.filter((r) => r.category === 'interview').length,
      },
      {
        value: 'job-search',
        label: 'Búsqueda de Empleo',
        count: this.resources.filter((r) => r.category === 'job-search').length,
      },
      {
        value: 'cv',
        label: 'CV y Documentos',
        count: this.resources.filter((r) => r.category === 'cv').length,
      },
      {
        value: 'career',
        label: 'Desarrollo Profesional',
        count: this.resources.filter((r) => r.category === 'career').length,
      },
      {
        value: 'general',
        label: 'General',
        count: this.resources.filter((r) => r.category === 'general').length,
      },
    ];
    return of(categories);
  }
}
