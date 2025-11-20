import { Component } from '@angular/core';
import { NavbarComponent } from '../reutilzar/navbar/navbar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  terminoBusqueda: string = '';

  constructor(private router: Router) {}

  buscarEmpleo(event: Event) {
    event.preventDefault();

    if (this.terminoBusqueda.trim()) {
      // Navegar a ofertasInicio con el término de búsqueda como parámetro
      this.router.navigate(['/ofertasInicio'], {
        queryParams: { termino: this.terminoBusqueda.trim() },
      });
    } else {
      // Si no hay término, ir a ofertasInicio sin filtro
      this.router.navigate(['/ofertasInicio']);
    }
  }

  ngAfterViewInit(): void {
    // Función para animar contador
    const animateCounter = (
      element: string,
      target: number,
      duration: number
    ) => {
      let start = 0;
      const increment = target / (duration / 16);
      const el = document.querySelector(element) as HTMLElement;

      const updateCounter = () => {
        start += increment;
        if (start < target) {
          el.textContent = `+${Math.floor(start)}`;
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `+${target}`;
        }
      };

      updateCounter();
    };

    // IntersectionObserver para lanzar el contador
    const stats = document.querySelector('.stats');
    if (stats) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animateCounter('.stats span:first-child', 5000, 2000);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(stats);
    }
  }

}
