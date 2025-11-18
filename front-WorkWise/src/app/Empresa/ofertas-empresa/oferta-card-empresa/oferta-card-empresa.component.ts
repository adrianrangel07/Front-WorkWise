import { Component } from '@angular/core';
import { AuthEmpresaService } from '../../../services/auth-empresa.service';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    this.cargarOfertas();
  }

  constructor(private authEmpresaService: AuthEmpresaService) {}

  seleccionarOferta(oferta: any) {
    this.ofertaSeleccionada = oferta;
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

}
