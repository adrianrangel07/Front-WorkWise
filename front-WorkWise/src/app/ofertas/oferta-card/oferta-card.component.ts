import { Component } from '@angular/core';
import { AuthOfertasService } from '../../services/auth-ofertas.service';
import { AuthPostulacionesService } from '../../services/auth-postulaciones.service';
import { NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-oferta-card',
  imports: [NgForOf, NgIf],
  templateUrl: './oferta-card.component.html',
  styleUrl: './oferta-card.component.css'
})
export class OfertaCardComponent {
  ofertas: any[] = [];
  ofertaSeleccionada: any = null;
  experiencia: string = '';
  postulaciones: number[] = [];
  Tipo_empleo: string = '';
  tipo_Contrato: string = '';
  nivel_Educacion: string = '';
  page = 1;
  pageSize = 8;
  ofertasPaginadas: any[] = [];



  constructor(private authOfertasService: AuthOfertasService, private authPostulacionesService: AuthPostulacionesService) { }

  ngOnInit() {
    this.authOfertasService.getOfertas().subscribe({
      next: (data) => {
        this.ofertas = data;
        this.actualizarPaginacion();
        console.log(this.ofertas, this.Tipo_empleo);
      }, error: (err) => {
        console.error('Error al cargar las ofertas', err);
      }
    })

    this.authPostulacionesService.getPostulaciones().subscribe({
      next: (data) => {
        this.postulaciones = data.map((postulacion: any) => postulacion.oferta.id);
        console.log(this.postulaciones);
      }, error: (err) => {
        console.error('Error al cargar las postulaciones', err);
      }
    });
  }

  actualizarPaginacion() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.ofertasPaginadas = this.ofertas.slice(startIndex, endIndex);
  }

  cambiarPagina(n: number) {
    this.page = n;
    this.actualizarPaginacion();
  }

  estadoPostulado(ofertaId: number): boolean {
    return this.postulaciones.includes(ofertaId);
  }

  abrirModal(oferta: any) {
    this.ofertaSeleccionada = oferta
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

  normalizarDatos(ofertaData: any){
    switch (ofertaData.experiencia) {
        case 0:
          this.experiencia = "Sin experiencia";
          break
        case 1:
          this.experiencia = "Menos de 1 año";
          break
        case 2:
          this.experiencia = "Entre 1 y 3 años";
          break
        case 3:
          this.experiencia = "Entre 3 y 5 años";
          break
        case 4:
          this.experiencia = "Entre 5 y 10 años";
          break
        case 5:
          this.experiencia = "Más de 10 años";
          break
        default:
          this.experiencia = "No especificado";
      }
      switch (ofertaData.tipo_Empleo) {
        case 'Tiempo_Completo':
          this.Tipo_empleo = "Tiempo Completo";
          break
        case "Medio_Tiempo":
          this.Tipo_empleo = "Medio Tiempo";
          break
        case "Por_Horas":
          this.Tipo_empleo = "Por Horas";
          break
        case "Freelance":
          this.Tipo_empleo = "Freelance";
          break
        default:
          this.Tipo_empleo = "No especificado";
      }
      switch (ofertaData.tipo_Contrato) {
        case "Obra_Labor":
          this.tipo_Contrato = "Obra labor";
          break
        case "Fijo":
          this.tipo_Contrato = "Fijo";
          break
        case "Indefinido":
          this.tipo_Contrato = "Indefinido";
          break
        case "Practicas":
          this.tipo_Contrato = "Practicas";
          break
        default:
          this.tipo_Contrato = "No especificado";
      }
      switch (ofertaData.nivel_Educacion) {
        case "Sin_estudios":
          this.nivel_Educacion = "Sin estudios";
          break
        case "Bachiller":
          this.nivel_Educacion = "Bachiller";
          break
        case "Tecnico_Tecnologo":
          this.nivel_Educacion = "Tecnico/Tecnologo";
          break
        case "Tecnico_Universitario":
          this.nivel_Educacion = "Tecnico o Universitario";
          break
        case "Universitario":
          this.nivel_Educacion = "Universitario";
          break
        case "Master":
          this.nivel_Educacion = "Master";
          break
        case "Doctorado":
          this.nivel_Educacion = "Doctorado";
          break
        default:
          this.nivel_Educacion = "No especificado";
      }
  }

  getTipoEmpleo(valor: string) {
    console.log(valor)
    switch (valor) {
      case 'Tiempo_Completo': return 'Tiempo Completo';
      case 'Medio_Tiempo': return 'Medio Tiempo';
      case 'Por_Horas': return 'Por Horas';
      case 'Freelance': return 'Freelance';
      default: return 'No especificado';
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
            confirmButtonText: 'Aceptar'
          });
          return;
        }
        if (response.success) {
          Swal.fire({
            title: '¡Postulación exitosa!',
            text: response.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.postulaciones.push(ofertaId);
        } else {
          Swal.fire({
            title: 'Aviso',
            text: response.message,
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }, error: (err) => {
        console.error('Error al postularse a la oferta:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la postulación. Inténtelo de nuevo.',
          icon: 'error'
        });
      }
    });
  }
}
