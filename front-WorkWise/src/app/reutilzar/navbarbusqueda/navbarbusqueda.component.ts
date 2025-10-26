import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbarbusqueda',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbarbusqueda.component.html',
  styleUrl: './navbarbusqueda.component.css'
})
export class NavbarbusquedaComponent {
  @Input() modo: 'link' | 'buscador' = 'link';
  logueado = false;
  persona: any = null ;

  constructor(private authService: AuthPersonaService, private router:Router ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((estado) => {
      this.logueado = estado;
      if (estado) {
        this.cargarUsuario()
        this.authService.getFotoPerfil(this.persona.id).subscribe(blob => {
          this.persona.photo = URL.createObjectURL(blob);
        })
      }else {
        this.persona = null;
      }
    });
  }

  cargarUsuario() {
    this.authService.getPersona().subscribe({next: (data) =>{
      this.persona = data;
      console.log(this.persona);
      this.authService.getFotoPerfil(this.persona.id).subscribe(blob =>{
          this.persona.photo = URL.createObjectURL(blob);
      })
    },error: (err) =>{
      console.error('Error al cargar los datos del usuario', err);
    }})
  }

  get iniciales(): string {
    if (!this.persona?.nombre || !this.persona?.apellido) return '';
    return (
      this.persona.nombre.charAt(0).toUpperCase() +
      this.persona.apellido.charAt(0).toUpperCase()
    );
  }

  logout() {
    this.authService.logout();
    this.logueado = false;
    this.persona = null;
    this.router.navigate(['/ofertasInicio']);
  }
}
