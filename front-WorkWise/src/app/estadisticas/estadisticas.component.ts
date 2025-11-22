import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAcordionComponent } from '../reutilzar/navbar-acordion/navbar-acordion.component';
import { FooterComponent } from '../reutilzar/footer/footer.component';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, NavbarAcordionComponent, FooterComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit {
  isLoading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
  }
}
