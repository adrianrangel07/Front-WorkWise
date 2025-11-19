import { Component, ViewChild } from '@angular/core';
import { NavbarAcordionComponent } from '../reutilzar/navbar-acordion/navbar-acordion.component';
import { NavbarbusquedaComponent } from '../reutilzar/navbarbusqueda/navbarbusqueda.component';
import { AuthPersonaService } from '../services/auth-personsa.service';
import { OfertaCardComponent } from './oferta-card/oferta-card.component';
import { FooterComponent } from '../reutilzar/footer/footer.component';

@Component({
  selector: 'app-ofertas',
  imports: [
    NavbarAcordionComponent,
    NavbarbusquedaComponent,
    OfertaCardComponent,
    FooterComponent,
  ],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css',
})
export class OfertasComponent {
  ofertas: any[] = [];
  logueado = false;

  constructor(private authService: AuthPersonaService) {}
  @ViewChild(OfertaCardComponent)
  ofertaCard!: OfertaCardComponent;

  mostrarFavoritosPrimero: boolean = false;

  toggleMostrarFavoritos() {
    this.mostrarFavoritosPrimero = !this.mostrarFavoritosPrimero;
    this.ofertaCard.ordenarFavoritosDesdePadre(); 
  }
}
