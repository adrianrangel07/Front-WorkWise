import { Component, ViewChild } from '@angular/core';
import { NavbarAcordionComponent } from '../reutilzar/navbar-acordion/navbar-acordion.component';
import { NavbarbusquedaComponent } from '../reutilzar/navbarbusqueda/navbarbusqueda.component';
import { OfertaCardComponent } from './oferta-card/oferta-card.component';
import { FooterComponent } from '../reutilzar/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ofertas',
  imports: [ NavbarAcordionComponent, NavbarbusquedaComponent, OfertaCardComponent, FooterComponent, NgFor, NgIf ],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css',
})
export class OfertasComponent {
  ofertas: any[] = [];
  logueado = false;
  terminoBusqueda: string = '';
  filtroActivo: string | null = null;
  mostrarFavoritosPrimero: boolean = false;
  totalFavoritos = 0;

  selecciones: { [key: string]: string[] } = {};

  filtros = [
    {
      key: 'sector',
      label: 'Sector laboral',
      opciones: [
        { label: 'Tecnología', value: 'tecnologia' },
        { label: 'Salud', value: 'salud' },
        { label: 'Construcción', value: 'construccion' },
        { label: 'Educación', value: 'educacion' },
      ],
    },
    {
      key: 'salario',
      label: 'Salario',
      opciones: [
        { label: 'Menos de $1.500.000', value: '0-1500000' },
        { label: '$1.500.000 - $3.000.000', value: '1500000-3000000' },
        { label: 'Más de $3.000.000', value: '3000000+' },
      ],
    },
    {
      key: 'contrato',
      label: 'Tipo Contrato',
      opciones: [
        { label: 'Indefinido', value: 'Indefinido' },
        { label: 'Fijo', value: 'Fijo' },
        { label: 'Obra labor', value: 'Obra_Labor' },
        { label: 'Prácticas', value: 'Practicas' },
      ],
    },
    {
      key: 'modalidad',
      label: 'Modalidad de trabajo',
      opciones: [
        { label: 'Presencial', value: 'Presencial' },
        { label: 'Remoto', value: 'Remoto' },
        { label: 'Híbrido', value: 'Hibrido' },
      ],
    },
    {
      key: 'tipo_empleo',
      label: 'Tipo de empleo',
      opciones: [
        { label: 'Tiempo completo', value: 'Tiempo_Completo' },
        { label: 'Medio tiempo', value: 'Medio_Tiempo' },
        { label: 'Freelance', value: 'Freelance' },
        { label: 'Por horas', value: 'Por_Horas' },
      ],
    },
    {
      key: 'nivel_educacion',
      label: 'Nivel de educación',
      opciones: [
        { label: 'Sin estudios', value: 'Sin_estudios' },
        { label: 'Bachiller', value: 'Bachiller' },
        { label: 'Técnico/Tecnologo', value: 'Tecnico_Tecnologo' },
        { label: 'Técnico o Universitario', value: 'Tecnico_Universitario' },
        { label: 'Universitario', value: 'Universitario' },
        { label: 'Master', value: 'Master' },
        { label: 'Doctorado', value: 'Doctorado' },
      ],
    },
    {
      key: 'experiencia',
      label: 'Experiencia',
      opciones: [
        { label: 'Sin experiencia', value: '0' },
        { label: 'Menos de 1 año', value: '1' },
        { label: '1 - 3 años', value: '2' },
        { label: '3 - 5 años', value: '3' },
        { label: '5 - 10 años', value: '4' },
        { label: 'Más de 10 años', value: '5' },
      ],
    },
  ];

  constructor(private route: ActivatedRoute) {}

  @ViewChild(OfertaCardComponent)
  ofertaCard!: OfertaCardComponent;

  ngOnInit() {
    // Escuchar los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      if (params['termino']) {
        this.terminoBusqueda = params['termino'];
        // Si el componente ofertaCard ya está cargado, aplicar el filtro
        setTimeout(() => {
          if (this.ofertaCard) {
            this.ofertaCard.filtrarOfertas(this.terminoBusqueda);
          }
        });
      }
    });
  }

  toggleFiltro(key: string): void {
    this.filtroActivo = this.filtroActivo === key ? null : key;
  }

  cerrarFiltro(): void {
    this.filtroActivo = null;
  }

  onCheckChange(key: string, value: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.selecciones[key]) this.selecciones[key] = [];

    if (checked) {
      this.selecciones[key].push(value);
    } else {
      this.selecciones[key] = this.selecciones[key].filter((v) => v !== value);
    }
  }

  limpiarFiltro(key: string): void {
    this.selecciones[key] = [];
    this.selecciones = { ...this.selecciones };
    this.cerrarFiltro();
  }

  aplicarFiltro(): void {
    console.log('Filtros aplicados:', this.selecciones);
    this.selecciones = { ...this.selecciones };
    this.cerrarFiltro();
  }

  toggleMostrarFavoritos(): void {
    this.mostrarFavoritosPrimero = !this.mostrarFavoritosPrimero;
  }

  onBuscar(termino: string) {
    this.terminoBusqueda = termino;
    if (this.ofertaCard) {
      this.ofertaCard.filtrarOfertas(termino);
    }
  }

  onAplicarFiltros(filtros: any) {
    if (this.ofertaCard) {
      this.ofertaCard.aplicarFiltrosAvanzados(filtros);
    }
  }

  // En ofertas.component.ts
tieneFiltros(key: string): boolean {
  return (this.selecciones[key]?.length ?? 0) > 0;
}

cantidadFiltros(key: string): number {
  return this.selecciones[key]?.length ?? 0;
}
}

