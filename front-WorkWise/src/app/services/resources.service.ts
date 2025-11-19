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
  createdAt: Date;
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
      createdAt: new Date('2025-01-15'),
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
      createdAt: new Date('2025-11-10'),
    },
    {
      id: 3,
      title: '10 Errores comunes en búsqueda de empleo',
      description:
        'Aprende a evitar los errores más comunes que cometen los candidatos.',
      type: 'article',
      category: 'job-search',
      url: '#',
      tags: ['errores', 'consejos', 'búsqueda'],
      featured: false,
      createdAt: new Date('2024-01-08'),
    },
    {
      id: 4,
      title: 'Cómo destacar en una entrevista grupal',
      description:
        'Estrategias para sobresalir en procesos de selección grupales.',
      type: 'video',
      category: 'interview',
      url: 'https://www.youtube.com/embed/ejemplo2',
      duration: '12:45',
      tags: ['entrevista', 'grupal', 'destacar'],
      featured: false,
      createdAt: new Date('2024-01-05'),
    },
    {
      id: 5,
      title: 'Guía de LinkedIn para profesionales',
      description: 'Optimiza tu perfil de LinkedIn para atraer reclutadores.',
      type: 'document',
      category: 'job-search',
      url: '/assets/documents/linkedin-guide.pdf',
      fileSize: '1.8 MB',
      tags: ['linkedin', 'networking', 'perfil'],
      featured: true,
      createdAt: new Date('2024-01-03'),
    },
    {
      id: 6,
      title: 'Preguntas frecuentes en entrevistas',
      description:
        'Lista de preguntas comunes y cómo responderlas efectivamente.',
      type: 'article',
      category: 'interview',
      url: '#',
      tags: ['preguntas', 'entrevista', 'preparación'],
      featured: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 7,
      title: 'Tips para negociar tu salario',
      description: 'Aprende a negociar tu remuneración de manera efectiva.',
      type: 'tip',
      category: 'career',
      url: '#',
      tags: ['salario', 'negociación', 'consejos'],
      featured: true,
      createdAt: new Date('2023-12-28'),
    },
    {
      id: 8,
      title: 'Preparación para assessment centers',
      description:
        'Cómo enfrentar exitosamente las pruebas de assessment center.',
      type: 'video',
      category: 'interview',
      url: 'https://www.youtube.com/embed/ejemplo3',
      duration: '18:20',
      tags: ['assessment', 'pruebas', 'selección'],
      featured: false,
      createdAt: new Date('2023-12-25'),
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
