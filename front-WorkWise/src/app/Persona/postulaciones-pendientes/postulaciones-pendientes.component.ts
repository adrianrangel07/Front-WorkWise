import { Component } from '@angular/core';
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { AuthPostulacionesService } from '../../services/auth-postulaciones.service';
import { NgForOf, NgIf } from '@angular/common';
import { P } from '@angular/cdk/keycodes';

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

  constructor(private authPostulacionesService: AuthPostulacionesService) { }

  ngOnInit(): void {
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
      switch (this.postulacionSeleccionada.oferta.experiencia) {
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
