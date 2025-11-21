import { Component } from '@angular/core';
import { AuthEmpresaService } from '../../../services/auth-empresa.service';
import { Router } from '@angular/router';
import { AuthOfertasService } from '../../../services/auth-ofertas.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-oferta-card-empresa',
  imports: [CommonModule],
  templateUrl: './oferta-card-empresa.component.html',
  styleUrl: './oferta-card-empresa.component.css'
})
export class OfertaCardEmpresaComponent {
  page = 0;
  size = 4;
  ofertas: any[] = [];
  totalPages: number = 0;
  ofertaSeleccionada: any = null;
  menuAbierto = false;
  Tipo_empleo: string = '';
  tipo_Contrato: string = '';
  nivel_Educacion: string = '';
  experiencia: string = '';

  ngOnInit() {
    this.cargarOfertas();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  constructor(private authEmpresaService: AuthEmpresaService, private authOfertasService: AuthOfertasService, private router: Router) { }

  seleccionarOferta(oferta: any) {
    this.ofertaSeleccionada = oferta;
    this.normalizarDatos(oferta);
  }

  cargarOfertas() {
    this.authEmpresaService.getOfertas(this.page, this.size).subscribe(res => {
      this.ofertas = res.content;
      this.totalPages = res.totalPages;
    });
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.cargarOfertas();
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

  editarOferta(oferta: any) {
    this.authOfertasService.setOfertaSeleccionada(oferta);
    this.router.navigate(['/editar-oferta']);
  }

  cambiarEstadoOferta(oferta: any) {
    console.log("Deshabilitar", oferta);

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres ${oferta.activo ? 'deshabilitar' : 'activar'} esta oferta?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authOfertasService.toggleOferta(oferta.id).subscribe({
          next: (respuesta) => {
            console.log("Oferta actualizada:", respuesta);

            oferta.activo = respuesta.activo;

            Swal.fire(
              '¡Éxito!',
              `La oferta ha sido ${oferta.activo ? 'activada' : 'deshabilitada'} correctamente.`,
              'success'
            );
          },
          error: (err) => {
            console.error("Error al deshabilitar la oferta:", err);
            Swal.fire(
              'Error',
              'Hubo un problema al actualizar la oferta. Por favor, intenta de nuevo más tarde.',
              'error'
            );
          }
        });
      }
    });
  }
}
