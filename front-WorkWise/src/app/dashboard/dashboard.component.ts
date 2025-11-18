import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from '../reutilzar/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Capturar formulario y manejar búsqueda
    const formBusqueda = document.getElementById('formBusqueda');
    if (formBusqueda) {
      formBusqueda.addEventListener('submit', (e) => {
        e.preventDefault();
        const terminoInput = document.getElementById(
          'termino'
        ) as HTMLInputElement;
        const termino = terminoInput.value.trim();
        if (termino !== '') {
          window.location.href = `/ofertasInicio?termino=${encodeURIComponent(
            termino
          )}`;
        }
      });
    }

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
