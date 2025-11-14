import { Component } from '@angular/core';
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { S } from '@angular/cdk/keycodes';
import { HabilidadesComponent } from "./habilidades/habilidades.component";

@Component({
  selector: 'app-perfil',
  imports: [NavbarAcordionComponent, NavbarbusquedaComponent, FooterComponent, NgIf, HabilidadesComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  persona: any = null;
  archivoCV: File | null = null;
  nombreArchivoCV: string = '';
  hover: boolean = false;

  constructor(private authService: AuthPersonaService, private router: Router) { }

  ngOnInit() {
    this.authService.getPersona().subscribe({
      next: (data) => {
        this.persona = data;
        console.log(this.persona);
        this.authService.getFotoPerfil(this.persona.id).subscribe(blob => {
          this.persona.photo = URL.createObjectURL(blob);
        })
      }, error: (err) => {
        console.error('Error al cargar los datos del usuario', err);
      }
    });
  }

  onFileSelected(event: any) {
    this.archivoCV = event.target.files[0] || null;
  }

  subirCV(event: Event) {
    event.preventDefault();
    if (this.archivoCV) {
      this.authService.uploadCV(this.archivoCV).subscribe({
        next: (response) => {
          console.log('CV subido con éxito', response);
          Swal.fire({
            title: 'Éxito',
            text: 'Su CV ha sido subido con éxito.',
            icon: 'success',
            timer: 2000,
          })
          this.authService.getPersona().subscribe({
            next: (data) => {
              this.persona = data;
              this.archivoCV = null;
            },
            error: (err) => console.error('Error al recargar perfil:', err)
          });
        }, error: (err) => {
          console.error('Error al subir el CV', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo subir el CV. Inténtelo de nuevo más tarde.',
            icon: 'error',
            timer: 2000,
          })
        }
      });
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione un archivo antes de subir.',
        icon: 'warning',
        timer: 2000,
      })
    }
  }

  verCV() {
    if (this.persona?.cv) {
      this.authService.getCV(this.persona.id).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        }, error: (err) => {
          console.error('Error al obtener el CV', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener el CV. Inténtelo de nuevo más tarde.',
            icon: 'error',
            timer: 2000,
          })
        }
      });
    }
  }

  eliminarCV() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.eliminarCV().subscribe({
          next: (response) => {
            Swal.fire({
              title: 'eliminado',
              text: 'Su CV ha sido eliminado con éxito.',
              icon: 'info',
              timer: 2000,
            })
            console.log('CV eliminado con éxito', response);
            this.authService.getPersona().subscribe({
              next: (data) => {
                this.persona = data;
                this.archivoCV = null;
              },
              error: (err) => console.error('Error al recargar perfil:', err)
            });
          }, error: (err) => {
            console.error('Error al eliminar el CV', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el CV. Inténtelo de nuevo más tarde.',
              icon: 'error',
              timer: 2000,
            })
          }
        });
      }
    });
  }

  get iniciales(): string {
    if (!this.persona?.nombre || !this.persona?.apellido) return '';
    return (
      this.persona.nombre.charAt(0).toUpperCase() +
      this.persona.apellido.charAt(0).toUpperCase()
    );
  }

  subirFoto(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.authService.uploadFoto(file).subscribe({
        next: (response: any) => {
          console.log('✅ Foto subida correctamente');
          Swal.fire({
            title: 'Éxito',
            text: 'Su foto ha sido subido con éxito.',
            icon: 'success',
            timer: 2000,
          })
          this.authService.getPersona().subscribe({
            next: (data) => {
              this.persona = data;
              this.archivoCV = null;
              this.authService.getFotoPerfil(this.persona.id).subscribe(blob => {
                this.persona.photo = URL.createObjectURL(blob);
              })
            },
            error: (err) => console.error('Error al recargar perfil:', err)
          });
        },
        error: (err: any) => {
          console.error('❌ Error al subir la foto:', err);
          Swal.fire({
            title: 'Error',
            text: 'Supera el limete de tamaño permitido.',
            icon: 'error',
            timer: 2000,
          })
        }
      });
    } else {
      console.error('No se seleccionó ningún archivo.');
      Swal.fire({
        title: 'Error',
        text: 'No se seleccionó ningún archivo.',
        icon: 'error',
        timer: 2000,
      })
    }
  }

  postulacionesPendientes() {
    this.router.navigate(['/postulacionesPendientes']); 
  }

}
