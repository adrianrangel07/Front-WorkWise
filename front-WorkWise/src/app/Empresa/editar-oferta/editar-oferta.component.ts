import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthOfertasService } from '../../services/auth-ofertas.service';
import { Router } from '@angular/router';
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import Swal from 'sweetalert2';
import flatpickr from "flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { timer } from 'rxjs';

@Component({
  selector: 'app-editar-oferta',
  imports: [NavbarAcordionComponent, NavbarbusquedaComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './editar-oferta.component.html',
  styleUrl: './editar-oferta.component.css'
})
export class EditarOfertaComponent implements OnInit {
  oferta: any = {};
  step: number = 1
  habilidades: string[] = [];
  nuevaHabilidad: string = '';
  showPreview: boolean = false;
  showDropdown: boolean = false;
  selectedValue = '';
  selectedLabel = '';

  options = [
    { value: 'Aeroespacial', label: 'Aeroespacial' },
    { value: 'Agricultura', label: 'Agricultura' },
    { value: 'Agroindustria', label: 'Agroindustria' },
    { value: 'Ambiental', label: 'Medio ambiente' },
    { value: 'ArtesCreativas', label: 'Artes creativas' },
    { value: 'Automotriz', label: 'Automotriz' },
    { value: 'BienesRaices', label: 'Bienes raíces' },
    { value: 'Biotecnologia', label: 'Biotecnología' },
    { value: 'Comercio', label: 'Comercio' },
    { value: 'Construccion', label: 'Construcción' },
    { value: 'Consultoria', label: 'Consultoría' },
    { value: 'Deportes', label: 'Deportes y recreación' },
    { value: 'Diseño', label: 'Diseño' },
    { value: 'Educacion', label: 'Educación' },
    { value: 'Energia', label: 'Energía' },
    { value: 'Finanzas', label: 'Finanzas' },
    { value: 'Gobierno', label: 'Gobierno' },
    { value: 'Investigacion', label: 'Investigación' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Logistica', label: 'Logística' },
    { value: 'Manufactura', label: 'Manufactura' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Medios', label: 'Medios de comunicación' },
    { value: 'Mineria', label: 'Minería' },
    { value: 'Naval', label: 'Naval' },
    { value: 'Quimica', label: 'Química y farmacéutica' },
    { value: 'RRHH', label: 'Recursos humanos' },
    { value: 'Salud', label: 'Salud' },
    { value: 'Seguros', label: 'Seguros' },
    { value: 'Servicios', label: 'Servicios' },
    { value: 'Social', label: 'Trabajo social' },
    { value: 'Tecnologia', label: 'Tecnología' },
    { value: 'Textil', label: 'Textil y confección' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Turismo', label: 'Turismo' }
  ];

  filteredOptions = [...this.options];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  filterOptions(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredOptions = this.options.filter(opt =>
      opt.label.toLowerCase().includes(query)
    );
  }

  selectOption(item: any) {
    this.oferta.sector_oferta = item.value
    this.selectedValue = item.value;
    this.selectedLabel = item.label;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.col-sm-6 mb-3')) {
      this.showDropdown = false;
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  addHabilidad() {
    const valor = this.nuevaHabilidad.trim();
    console.log(valor)

    if (!valor) return;
    this.habilidades.push(valor);

    this.nuevaHabilidad = '';
  }

  removeHabilidad(index: number) {
    this.habilidades.splice(index, 1);
  }

  constructor(private authOfertasService: AuthOfertasService, private router: Router) { }

  ngOnInit() {
    this.oferta = this.authOfertasService.getOfertaSeleccionada();
    console.log(this.oferta);
  }

  guardarCambios() {
    this.oferta.habilidades = this.habilidades.map(h => ({habilidad: { nombre: h }}));

    this.authOfertasService.actualizarOferta(this.oferta.id, this.oferta)
      .subscribe({
        next: (res) => {
          console.log("Oferta actualizada", res);
          Swal.fire({
            icon: 'success',
            title: 'Oferta actualizada',
            timer: 2000
          });
        },
        error: (err) => {
          console.error("Error al actualizar: ", err);
        }
      });
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
      console.log();
      setTimeout(() => {
        const fechaInput = document.getElementById('fecha');

        if (fechaInput) {
          flatpickr(fechaInput, {
            dateFormat: 'Y-m-d',
            altFormat: 'd/m/Y',
            locale: Spanish,
            minDate: 'today',
            maxDate: ''
          });
        }
        console.log(fechaInput);
      }, 100);
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }


}
