import { Component, HostListener } from '@angular/core';
import { NavbarAcordionComponent } from "../../reutilzar/navbar-acordion/navbar-acordion.component";
import { NavbarbusquedaComponent } from "../../reutilzar/navbarbusqueda/navbarbusqueda.component";
import { FooterComponent } from "../../reutilzar/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthEmpresaService } from '../../services/auth-empresa.service';
import Swal from 'sweetalert2';
import flatpickr from "flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';

interface Oferta {
  titulo: string;
  descripcion: string;
  salario: number | null;
  moneda: string;
  ubicacion: string;
  tipo_Contrato: string;
  tipo_Empleo: string;
  modalidad: string;
  fecha_Publicacion: Date;
  fecha_Cierre: string;
  sector_oferta: string;
  habilidades: string[];
  experiencia: number | null;
  nivel_Educacion: string;
}

@Component({
  selector: 'app-crear-oferta',
  imports: [NavbarAcordionComponent, NavbarbusquedaComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './crear-oferta.component.html',
  styleUrl: './crear-oferta.component.css'
})
export class CrearOfertaComponent {
  step: number = 1
  sectorSeleccionado: string = "";
  showDropdown: boolean = false;
  selectedValue = '';
  selectedLabel = '';
  habilidades: string[] = [];
  nuevaHabilidad: string = '';
  showPreview: boolean = false;
  experiencia: string ='';
  Tipo_empleo: string = '';
  tipo_Contrato: string = '';
  nivel_Educacion: string = '';

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



  oferta: Oferta = {
    titulo: '',
    descripcion: '',
    salario: null,
    moneda: '',
    ubicacion: '',
    tipo_Contrato: '',
    tipo_Empleo: '',
    modalidad: '',
    fecha_Publicacion: new Date(),
    fecha_Cierre: '',
    sector_oferta: '',
    habilidades: [] as string[],
    experiencia: null,
    nivel_Educacion: '',
  };


  constructor(private authEmpresaService: AuthEmpresaService) { }

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

  enviarOferta() {
    this.oferta.habilidades = [...this.habilidades];
    this.authEmpresaService.crearOferta(this.oferta).subscribe({
      next: (resp) => {
        Swal.fire({
          title: 'la oferta ha sido creada con exito',
          icon: 'success',
          timer: 2000,
        }).then(() => {
          window.location.reload();
        })
      },
      error: (err) => {
        Swal.fire({
          title: 'error',
          text: err.error?.mensaje,
          icon: 'error',
          timer: 2000,
        })
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

  openPreview() {
    this.oferta.habilidades = [...this.habilidades];
    switch (this.oferta.experiencia) {
        case 0:
          this.experiencia = "Sin experiencia";
          break
        case 1:
          this.experiencia = "Menos de 1 año";
          break
        case 2:
          this.experiencia = "Entre 1 y 3 años";
          break
        case 3:
          this.experiencia = "Entre 3 y 5 años";
          break
        case 4:
          this.experiencia = "Entre 5 y 10 años";
          break
        case 5:
          this.experiencia = "Más de 10 años";
          break
        default:
          this.experiencia = "No especificado";
      }
    switch (this.oferta.tipo_Empleo) {
        case 'Tiempo_Completo':
          this.Tipo_empleo = "Tiempo Completo";
          break
        case "Medio_Tiempo":
          this.Tipo_empleo = "Medio Tiempo";
          break
        case "Por_Horas":
          this.Tipo_empleo = "Por Horas";
          break
        case "Freelance":
          this.Tipo_empleo = "Freelance";
          break
        default:
          this.Tipo_empleo = "No especificado";
      }
    switch (this.oferta.tipo_Contrato) {
        case "Obra_Labor":
          this.tipo_Contrato = "Obra labor";
          break
        case "Fijo":
          this.tipo_Contrato = "Fijo";
          break
        case "Indefinido":
          this.tipo_Contrato = "Indefinido";
          break
        case "Practicas":
          this.tipo_Contrato = "Practicas";
          break
        default:
          this.tipo_Contrato = "No especificado";
      }
    switch (this.oferta.nivel_Educacion) {
        case "Sin_estudios":
          this.nivel_Educacion = "Sin estudios";
          break
        case "Bachiller":
          this.nivel_Educacion = "Bachiller";
          break
        case "Tecnico_Tecnologo":
          this.nivel_Educacion = "Tecnico/Tecnologo";
          break
        case "Tecnico_Universitario":
          this.nivel_Educacion = "Tecnico o Universitario";
          break
        case "Universitario":
          this.nivel_Educacion = "Universitario";
          break
        case "Master":
          this.nivel_Educacion = "Master";
          break
        case "Doctorado":
          this.nivel_Educacion = "Doctorado";
          break
        default:
          this.nivel_Educacion = "No especificado";
      }
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
  }
}
