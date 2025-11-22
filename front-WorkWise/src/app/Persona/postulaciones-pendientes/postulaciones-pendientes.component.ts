import { Component } from '@angular/core';
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { AuthPostulacionesService } from '../../services/auth-postulaciones.service';
import { NgForOf, NgIf } from '@angular/common';
import { P } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postulaciones-pendientes',
  imports: [FooterComponent, NavbarAcordionComponent, NavbarbusquedaComponent, NgIf, NgForOf],
  templateUrl: './postulaciones-pendientes.component.html',
  styleUrl: './postulaciones-pendientes.component.css'
})
export class PostulacionesPendientesComponent {
  postulaciones: any[] = [];
  postulacionSeleccionada: any = null;
  experiencia: string = '';
  Tipo_empleo: string = '';
  tipo_Contrato: string = '';
  nivel_Educacion: string = '';

  constructor(private authPostulacionesService: AuthPostulacionesService) { }

  ngOnInit(): void {
    this.cargarPostulaciones();
  }

  eliminarPostulacion(id: number) {
    console.log('Eliminando postulacion con id:', id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authPostulacionesService.eliminarPostulacion(id).subscribe({
          next: (res) => {
            console.log(res.message);
            Swal.fire({
              icon: 'success',
              title: 'Postulación eliminada',
              text: 'La postulación ha sido eliminada exitosamente.',
              confirmButtonText: 'Aceptar'
            });
            this.cargarPostulaciones();
            window.location.reload();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar la postulación. Por favor, intenta de nuevo.',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  cargarPostulaciones() {
    this.authPostulacionesService.getPostulaciones().subscribe((data) => {
      this.postulaciones = data.filter((Postulacion: { estado: string; }) => Postulacion.estado === 'Pendiente');
      console.log(this.postulaciones);
    },
      (error) => {
        console.error('Error al cargar las postulaciones:', error);
      }
    );
  }


  abrirModal(postulacion: any) {
    this.postulacionSeleccionada = postulacion
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'flex';
      console.log(this.postulacionSeleccionada);
      this.normalizarDatos(this.postulacionSeleccionada.oferta);
    }
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
    switch (ofertaData.tipoEmpleo) {
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
    switch (ofertaData.tipoContrato) {
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
    switch (ofertaData.nivelEducacion) {
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


  cerrarModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.postulacionSeleccionada = null;
  }
}
