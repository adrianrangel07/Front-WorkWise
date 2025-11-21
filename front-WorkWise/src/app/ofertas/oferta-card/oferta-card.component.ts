import { Component } from '@angular/core';
import { AuthOfertasService } from '../../services/auth-ofertas.service';
import { AuthPostulacionesService } from '../../services/auth-postulaciones.service';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-oferta-card',
  imports: [NgForOf, NgIf, NgClass],
  templateUrl: './oferta-card.component.html',
  styleUrl: './oferta-card.component.css',
})
export class OfertaCardComponent {
  ofertas: any[] = [];
  ofertasFiltradas: any[] = [];
  ofertaSeleccionada: any = null;
  experiencia: string = '';
  postulaciones: number[] = [];
  Tipo_empleo: string = '';
  tipo_Contrato: string = '';
  nivel_Educacion: string = '';
  page = 1;
  pageSize = 8;
  ofertasPaginadas: any[] = [];
  token: string | null = null;
  terminoBusqueda: string = '';
  buscando: boolean = false;
  compatibles: number[] = [];

  // Filtros activos
  filtrosActivos: any = {
    salarioMin: null,
    salarioMax: null,
    tipoContrato: '',
    tipoEmpleo: '',
    modalidades: [],
  };

  constructor(
    private authOfertasService: AuthOfertasService,
    private authPostulacionesService: AuthPostulacionesService,
    private AuthPersonaService: AuthPersonaService
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.cargarFavoritosUsuario();

    this.authOfertasService.getOfertas().subscribe({
      next: (data) => {
        this.ofertas = data;
        this.ofertasFiltradas = [...this.ofertas];
        this.actualizarPaginacion();
        console.log('Ofertas cargadas:', this.ofertas.length);
      },
      error: (err) => {
        console.error('Error al cargar las ofertas', err);
      },
    });

    this.AuthPersonaService.getPersona().subscribe((persona) => {
      forkJoin({
        ofertas: this.authOfertasService.getOfertas(),
        compatibles: this.authOfertasService.getOfertasCompatibles(persona.id),
      }).subscribe(({ ofertas, compatibles }) => {
        // IDs de compatibles
        const idsCompatibles = compatibles.map((o: any) => o.id);

        // Añadir campo compatible a cada oferta
        this.ofertas = ofertas.map((of: any) => ({
          ...of,
          compatible: idsCompatibles.includes(of.id),
        }));

        this.ofertasFiltradas = [...this.ofertas];
        this.actualizarPaginacion();
      });
    });

    this.authPostulacionesService.getPostulaciones().subscribe({
      next: (data) => {
        this.postulaciones = data.map(
          (postulacion: any) => postulacion.oferta.id
        );
        console.log('Postulaciones cargadas:', this.postulaciones.length);
      },
      error: (err) => {
        console.error('Error al cargar las postulaciones', err);
      },
    });
  }

  // Método para filtrar por texto
  filtrarOfertas(termino: string) {
    this.terminoBusqueda = termino.toLowerCase().trim();
    this.page = 1;
    this.buscando = !!this.terminoBusqueda;
    this.aplicarTodosLosFiltros();
  }

  // Método para aplicar filtros avanzados
  aplicarFiltrosAvanzados(filtros: any) {
    this.filtrosActivos = { ...filtros };
    this.page = 1;
    this.aplicarTodosLosFiltros();
  }

  // Aplicar todos los filtros (texto + avanzados)
  aplicarTodosLosFiltros() {
    let ofertasFiltradas = [...this.ofertas];

    // Aplicar filtro de texto
    if (this.terminoBusqueda) {
      ofertasFiltradas = ofertasFiltradas.filter(
        (oferta) =>
          oferta.titulo?.toLowerCase().includes(this.terminoBusqueda) ||
          oferta.empresa?.nombre
            ?.toLowerCase()
            .includes(this.terminoBusqueda) ||
          oferta.descripcion?.toLowerCase().includes(this.terminoBusqueda) ||
          (oferta.habilidades &&
            oferta.habilidades.some((hab: any) =>
              hab.habilidad?.nombre
                ?.toLowerCase()
                .includes(this.terminoBusqueda)
            )) ||
          oferta.ubicacion?.toLowerCase().includes(this.terminoBusqueda)
      );
    }

    // Aplicar filtros avanzados
    ofertasFiltradas = ofertasFiltradas.filter((oferta) => {
      // Filtro por salario
      if (
        this.filtrosActivos.salarioMin !== null &&
        oferta.salario < this.filtrosActivos.salarioMin
      ) {
        return false;
      }
      if (
        this.filtrosActivos.salarioMax !== null &&
        oferta.salario > this.filtrosActivos.salarioMax
      ) {
        return false;
      }

      // Filtro por tipo de contrato
      if (
        this.filtrosActivos.tipoContrato &&
        oferta.tipo_Contrato !== this.filtrosActivos.tipoContrato
      ) {
        return false;
      }

      // Filtro por tipo de empleo
      if (
        this.filtrosActivos.tipoEmpleo &&
        oferta.tipo_Empleo !== this.filtrosActivos.tipoEmpleo
      ) {
        return false;
      }

      // Filtro por modalidad
      if (
        this.filtrosActivos.modalidades.length > 0 &&
        !this.filtrosActivos.modalidades.includes(
          oferta.modalidad?.toLowerCase()
        )
      ) {
        return false;
      }

      return true;
    });

    this.ofertasFiltradas = ofertasFiltradas;
    this.actualizarPaginacion();

    console.log(
      'Ofertas después de aplicar filtros:',
      this.ofertasFiltradas.length
    );
    console.log('Filtros activos:', this.filtrosActivos);
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.buscando = false;
    this.filtrosActivos = {
      salarioMin: null,
      salarioMax: null,
      tipoContrato: '',
      tipoEmpleo: '',
      modalidades: [],
    };
    this.aplicarTodosLosFiltros();
  }

  actualizarPaginacion() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.ofertasPaginadas = this.ofertasFiltradas.slice(startIndex, endIndex);
  }

  cambiarPagina(n: number) {
    this.page = n;
    this.actualizarPaginacion();
  }

  estadoPostulado(ofertaId: number): boolean {
    return this.postulaciones.includes(ofertaId);
  }

  abrirModal(oferta: any) {
    this.ofertaSeleccionada = oferta;
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'flex';
      console.log(this.ofertaSeleccionada);
      this.normalizarDatos(this.ofertaSeleccionada);
    }
  }

  cerrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.ofertaSeleccionada = null;
  }

  normalizarDatos(ofertaData: any) {
    switch (ofertaData.experiencia) {
      case 0:
        this.experiencia = 'Sin experiencia';
        break;
      case 1:
        this.experiencia = 'Menos de 1 año';
        break;
      case 2:
        this.experiencia = 'Entre 1 y 3 años';
        break;
      case 3:
        this.experiencia = 'Entre 3 y 5 años';
        break;
      case 4:
        this.experiencia = 'Entre 5 y 10 años';
        break;
      case 5:
        this.experiencia = 'Más de 10 años';
        break;
      default:
        this.experiencia = 'No especificado';
    }
    switch (ofertaData.tipo_Empleo) {
      case 'Tiempo_Completo':
        this.Tipo_empleo = 'Tiempo Completo';
        break;
      case 'Medio_Tiempo':
        this.Tipo_empleo = 'Medio Tiempo';
        break;
      case 'Por_Horas':
        this.Tipo_empleo = 'Por Horas';
        break;
      case 'Freelance':
        this.Tipo_empleo = 'Freelance';
        break;
      default:
        this.Tipo_empleo = 'No especificado';
    }
    switch (ofertaData.tipo_Contrato) {
      case 'Obra_Labor':
        this.tipo_Contrato = 'Obra labor';
        break;
      case 'Fijo':
        this.tipo_Contrato = 'Fijo';
        break;
      case 'Indefinido':
        this.tipo_Contrato = 'Indefinido';
        break;
      case 'Practicas':
        this.tipo_Contrato = 'Practicas';
        break;
      default:
        this.tipo_Contrato = 'No especificado';
    }
    switch (ofertaData.nivel_Educacion) {
      case 'Sin_estudios':
        this.nivel_Educacion = 'Sin estudios';
        break;
      case 'Bachiller':
        this.nivel_Educacion = 'Bachiller';
        break;
      case 'Tecnico_Tecnologo':
        this.nivel_Educacion = 'Tecnico/Tecnologo';
        break;
      case 'Tecnico_Universitario':
        this.nivel_Educacion = 'Tecnico o Universitario';
        break;
      case 'Universitario':
        this.nivel_Educacion = 'Universitario';
        break;
      case 'Master':
        this.nivel_Educacion = 'Master';
        break;
      case 'Doctorado':
        this.nivel_Educacion = 'Doctorado';
        break;
      default:
        this.nivel_Educacion = 'No especificado';
    }
  }

  getTipoEmpleo(valor: string) {
    console.log(valor);
    switch (valor) {
      case 'Tiempo_Completo':
        return 'Tiempo Completo';
      case 'Medio_Tiempo':
        return 'Medio Tiempo';
      case 'Por_Horas':
        return 'Por Horas';
      case 'Freelance':
        return 'Freelance';
      default:
        return 'No especificado';
    }
  }

  postularse(ofertaId: number) {
    this.authPostulacionesService.postularse(ofertaId).subscribe({
      next: (response) => {
        if (!response) {
          Swal.fire({
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para postularte a una oferta.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
          });
          return;
        }
        if (response.success) {
          Swal.fire({
            title: '¡Postulación exitosa!',
            text: response.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          this.postulaciones.push(ofertaId);
        } else {
          Swal.fire({
            title: 'Aviso',
            text: response.message,
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      error: (err) => {
        console.error('Error al postularse a la oferta:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la postulación. Inténtelo de nuevo.',
          icon: 'error',
        });
      },
    });
  }

  favoritos: number[] = [];
  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  toggleFavorito(oferta: any, event: MouseEvent) {
    event.stopPropagation();

    if (!this.token) {
      Swal.fire(
        'Inicia sesión',
        'Debes iniciar sesión para guardar favoritos.',
        'warning'
      );
      return;
    }

    if (this.esFavorito(oferta.id)) {
      this.favoritos = this.favoritos.filter((id) => id !== oferta.id);
    } else {
      this.favoritos.push(oferta.id);
    }

    localStorage.setItem(
      'favoritos_' + this.token,
      JSON.stringify(this.favoritos)
    );

    this.ordenarOfertas();
    this.actualizarPaginacion();
  }

  mostrarFavoritosPrimero: boolean = false;

  ordenarFavoritosDesdePadre() {
    this.mostrarFavoritosPrimero = !this.mostrarFavoritosPrimero;
    this.ordenarOfertas();
    this.actualizarPaginacion();
  }

  ordenarOfertas() {
    if (!this.mostrarFavoritosPrimero) return;

    this.ofertasFiltradas.sort((a, b) => {
      const aFav = this.esFavorito(a.id) ? 1 : 0;
      const bFav = this.esFavorito(b.id) ? 1 : 0;
      return bFav - aFav;
    });
  }

  cargarFavoritosUsuario() {
    if (!this.token) {
      this.favoritos = [];
      return;
    }

    const data = localStorage.getItem('favoritos_' + this.token);
    this.favoritos = data ? JSON.parse(data) : [];
  }
}
