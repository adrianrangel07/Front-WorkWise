import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { BARRIOS_CARTAGENA } from '../../data/barrios';
import { profesiones } from '../../data/profesiones';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  barrios = BARRIOS_CARTAGENA;
  profesiones = profesiones;

  profesionesFiltradas: string[] = [];
  filtroProfesion: string = '';
  mostrarDropdown: boolean = false;

  step: number = 1;
  private flatpickrInstance: any;
  passwordsMatch: boolean | null = null;
  confirmPassword: string = '';

  @ViewChild('searchInput') searchInput!: ElementRef;

  persona = {
    nombre: '',
    apellido: '',
    numero_documento: '',
    tipo_Documento: '',
    fecha_Nacimiento: '',
    genero: '',
    direccion: '',
    telefono: '',
    tipo_telefono: '',
    profesion: '',
    usuario: {
      email: '',
      password: '',
    },
  };

  ngOnInit() {
    this.profesionesFiltradas = [...this.profesiones];
  }

  onSearchInput(event: any) {
    this.filtroProfesion = event.target.value;
    this.filtrarProfesiones();
  }

  // Método para abrir el dropdown y permitir búsqueda
  abrirBusqueda() {
    this.mostrarDropdown = true;
    this.filtroProfesion = '';
    this.profesionesFiltradas = [...this.profesiones];

    // Enfocar el input virtual después de que se renderice
    setTimeout(() => {
      if (this.searchInput && this.searchInput.nativeElement) {
        this.searchInput.nativeElement.focus();
      }
    }, 50);
  }

  // Filtrar profesiones en tiempo real
  filtrarProfesiones() {
    console.log('Buscando:', this.filtroProfesion); // Para debug
    console.log('Total profesiones:', this.profesiones.length); // Para debug

    if (!this.filtroProfesion) {
      this.profesionesFiltradas = [...this.profesiones];
    } else {
      const filtro = this.normalizarTexto(this.filtroProfesion);

      this.profesionesFiltradas = this.profesiones.filter((profesion) =>
        this.normalizarTexto(profesion).includes(filtro)
      );
    }

    console.log('Resultados encontrados:', this.profesionesFiltradas.length); // Para debug
    console.log('Resultados:', this.profesionesFiltradas); // Para debug
  }

  // Función para normalizar texto (quitar tildes y convertir a minúsculas)
  normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar tildes
      .trim();
  }
  
  // Seleccionar una profesión
  seleccionarProfesion(profesion: string) {
    this.persona.profesion = profesion;
    this.mostrarDropdown = false;
    this.filtroProfesion = '';
  }

  // Manejar teclas en el input virtual
  manejarTecla(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.mostrarDropdown = false;
      this.filtroProfesion = '';
    } else if (event.key === 'Enter' && this.profesionesFiltradas.length > 0) {
      this.seleccionarProfesion(this.profesionesFiltradas[0]);
    }
  }

  // Cerrar dropdown cuando se hace clic fuera del componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest(
      '.dropdown-container'
    );
    if (!clickedInside && this.mostrarDropdown) {
      this.mostrarDropdown = false;
      this.filtroProfesion = '';
    }
  }

  nextStep() {
    if (this.step < 2) {
      this.step++;
      console.log(this.persona);
      setTimeout(() => {
        const fechaInput = document.getElementById('fecha');

        if (fechaInput) {
          flatpickr(fechaInput, {
            dateFormat: 'Y-m-d',
            altFormat: 'd/m/Y',
            locale: Spanish,
            maxDate: 'today',
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

  constructor(
    private authService: AuthPersonaService,
    private router: Router
  ) {}

  register() {
    const nacimiento = new Date(this.persona.fecha_Nacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      Swal.fire({
        title: 'Error',
        text: 'Debes ser mayor de 18 años para registrarte.',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    this.authService.register(this.persona).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'Usuario registrado con éxito.',
          icon: 'success',
          timer: 2000,
        }).then(() => {
          this.router.navigate(['/loginPersona']);
        });
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar el Usuario.',
          icon: 'error',
          timer: 2000,
        });
      },
    });
  }

  checkPasswordsMatch() {
    if (!this.persona.usuario.password || !this.confirmPassword) {
      this.passwordsMatch = null; // no mostrar nada si alguno está vacío
      return;
    }
    this.passwordsMatch =
      this.persona.usuario.password === this.confirmPassword;
  }

  passwordStrength = {
    width: '0%',
    color: 'red',
    text: '',
  };

  checkPasswordStrength(password: string) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    switch (strength) {
      case 0:
        this.passwordStrength = { width: '0%', color: 'red', text: '' };
        break;
      case 1:
        this.passwordStrength = { width: '25%', color: 'red', text: 'Débil' };
        break;
      case 2:
        this.passwordStrength = {
          width: '50%',
          color: 'orange',
          text: 'Media',
        };
        break;
      case 3:
        this.passwordStrength = {
          width: '75%',
          color: 'yellowgreen',
          text: 'Buena',
        };
        break;
      case 4:
        this.passwordStrength = {
          width: '100%',
          color: 'green',
          text: 'Fuerte',
        };
        break;
    }
  }

  togglePasswordVisibility(fieldId: string) {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    const icon = input?.nextElementSibling as HTMLElement;

    if (input) {
      if (input.type === 'password') {
        input.type = 'text';
        icon?.classList.remove('fa-eye');
        icon?.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon?.classList.remove('fa-eye-slash');
        icon?.classList.add('fa-eye');
      }
    }
  }
}
