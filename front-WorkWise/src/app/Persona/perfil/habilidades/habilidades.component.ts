import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPersonaService } from '../../../services/auth-personsa.service';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habilidades',
  imports: [CommonModule, FormsModule],
  templateUrl: './habilidades.component.html',
  styleUrl: './habilidades.component.css'
})
export class HabilidadesComponent {

  habilidad = '';
  isModalOpen = false;

  constructor(private authPersonaService: AuthPersonaService) { }

  agregarHabilidad() {
    if (!this.habilidad) {
      Swal.fire({
        icon: 'warning',
        title: 'El nombre de la habilidad es obligatorio',
        timer: 1500
      });
      return;
    }

    this.authPersonaService.aggHabilidades(this.habilidad).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'info',
          title: res.mensaje,
          timer: 1500
        })
      },
      error: (err) => {
        const mensajeError = err.error?.mensaje || err.error || 'Error al agregar la habilidad';
        Swal.fire({
          icon: 'info',
          title: mensajeError,
          timer: 1500
        })
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
