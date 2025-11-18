import { Component } from '@angular/core';
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { OfertaCardEmpresaComponent } from "./oferta-card-empresa/oferta-card-empresa.component";

@Component({
  selector: 'app-ofertas-empresa',
  imports: [NavbarAcordionComponent, FooterComponent, NavbarbusquedaComponent, OfertaCardEmpresaComponent],
  templateUrl: './ofertas-empresa.component.html',
  styleUrl: './ofertas-empresa.component.css'
})
export class OfertasEmpresaComponent {

}
