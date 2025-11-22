import { Component, ViewChild } from '@angular/core';
import { NavbarAcordionComponent } from '../reutilzar/navbar-acordion/navbar-acordion.component';
import { NavbarbusquedaComponent } from '../reutilzar/navbarbusqueda/navbarbusqueda.component';
import { AuthPersonaService } from '../services/auth-personsa.service';
import { OfertaCardComponent } from './oferta-card/oferta-card.component';
import { FooterComponent } from '../reutilzar/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ofertas',
  imports: [
    NavbarAcordionComponent,
    NavbarbusquedaComponent,
    OfertaCardComponent,
    FooterComponent,
    CommonModule,
  ],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css',
})
export class OfertasComponent {
  ofertas: any[] = [];
  logueado = false;
  terminoBusqueda: string = '';

  constructor(
    private authService: AuthPersonaService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(OfertaCardComponent)
  ofertaCard!: OfertaCardComponent;

  mostrarFavoritosPrimero: boolean = false;
  loading: boolean = true;

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      if (this.ofertaCard) {
        if (this.terminoBusqueda) {
          this.ofertaCard.filtrarOfertas(this.terminoBusqueda);
        }
        this.loading = false;
      }
    }, 800);

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

  toggleMostrarFavoritos() {
    this.mostrarFavoritosPrimero = !this.mostrarFavoritosPrimero;
    this.ofertaCard.ordenarFavoritosDesdePadre();
  }

  onBuscar(termino: string) {
    this.terminoBusqueda = termino;
    if (this.ofertaCard) {
      this.ofertaCard.filtrarOfertas(termino);
    }
  }

  onAplicarFiltros(filtros: any) {
    this.loading = true;
    if (this.ofertaCard) {
      this.ofertaCard.aplicarFiltrosAvanzados(filtros);
    }
  }
}
