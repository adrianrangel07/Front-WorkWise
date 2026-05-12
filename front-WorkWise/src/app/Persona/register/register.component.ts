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
import {
  debounceTime,
  distinctUntilChanged,
  pipe,
  Subject,
  Subscription,
} from 'rxjs';
import { LoadingComponent } from '../../reutilzar/loading/loading.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, LoadingComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  barrios = BARRIOS_CARTAGENA;
  profesiones = profesiones;

  profesionesFiltradas: string[] = [];
  filtroProfesion: string = '';
  
  barriosFiltrados: string[] = [];
  filtroBarrio: string = '';



  step: number = 1;
  private flatpickrInstance: any;
  passwordsMatch: boolean | null = null;
  confirmPassword: string = '';

  // Variables para verificación en tiempo real
  emailExiste: boolean = false;
  documentoExiste: boolean = false;
  emailValidando: boolean = false;
  documentoValidando: boolean = false;
  emailMensaje: string = '';
  documentoMensaje: string = '';

  private emailSubject = new Subject<string>();
  private documentoSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

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

  loading = false;

  ngOnInit() {
    this.profesionesFiltradas = [];
    this.barriosFiltrados = [];

    // Configurar debounce para email
    const emailSubscription = this.emailSubject
      .pipe(
        debounceTime(500), // Esperar 500ms después de la última tecla
        distinctUntilChanged(), // Solo si el valor cambió
      )
      .subscribe((email) => {
        this.verificarEmail(email);
      });

    // Configurar debounce para documento
    const documentoSubscription = this.documentoSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((documento) => {
        this.verificarDocumento(documento);
      });

    this.subscriptions.push(emailSubscription, documentoSubscription);
  }

  // Método para verificar email
  onEmailChange(email: string) {
    if (!email || email.length < 5) {
      this.emailExiste = false;
      this.emailMensaje = '';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.emailMensaje = 'Formato de email inválido';
      return;
    }

    this.emailValidando = true;
    this.emailSubject.next(email);
  }

  verificarEmail(email: string) {
    this.authService.verificarEmail(email).subscribe({
      next: (response) => {
        this.emailExiste = response.exists;
        this.emailMensaje = response.message;
        this.emailValidando = false;
      },
      error: (error) => {
        console.error('Error verificando email:', error);
        this.emailMensaje = 'Error verificando email';
        this.emailValidando = false;
      },
    });
  }

  // Método para verificar documento
  onDocumentoChange(documento: string) {
    if (!documento || documento.length < 4) {
      this.documentoExiste = false;
      this.documentoMensaje = '';
      return;
    }

    // Validar que sea solo números
    if (!/^\d+$/.test(documento)) {
      this.documentoMensaje = 'Solo se permiten números';
      return;
    }

    this.documentoValidando = true;
    this.documentoSubject.next(documento);
  }

  verificarDocumento(documento: string) {
    this.authService.verificarDocumento(documento).subscribe({
      next: (response) => {
        this.documentoExiste = response.exists;
        this.documentoMensaje = response.message;
        this.documentoValidando = false;
      },
      error: (error) => {
        console.error('Error verificando documento:', error);
        this.documentoMensaje = 'Error verificando documento';
        this.documentoValidando = false;
      },
    });
  }

  onSearchInputProfesion(event: any) {
    this.filtroProfesion = event.target.value;
    this.filtrarProfesiones();
  }
  
  // Filtrar profesiones en tiempo real
  filtrarProfesiones() {
    // console.log('Filtro:', this.filtroProfesion);

    if (!this.filtroProfesion || this.filtroProfesion.trim() === '') {
      this.profesionesFiltradas = [];
      return;
    }

    const filtro = this.normalizarTexto(this.filtroProfesion);

    this.profesionesFiltradas = this.profesiones.filter((profesion) =>
      this.normalizarTexto(profesion).includes(filtro)
    );

    // console.log('Resultados:', this.profesionesFiltradas);
  }

  // Seleccionar una profesión
  seleccionarProfesion(profesion: string) {
    this.persona.profesion = profesion;
    this.filtroProfesion = profesion;
    this.profesionesFiltradas = [];
  }

    // Manejar teclas en el input virtual
  manejarTeclaProfesion(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.filtroProfesion = '';
      this.profesionesFiltradas = [];
    } else if (event.key === 'Enter' && this.profesionesFiltradas.length > 0) {
      this.seleccionarProfesion(this.profesionesFiltradas[0]);
    }
  }

  onSearchInputBarrio(event: any) {
    this.filtroBarrio = event.target.value;
    this.filtrarBarrios();
  }

  filtrarBarrios() {
     // console.log('Filtro:', this.filtroProfesion);

    if (!this.filtrarBarrios || this.filtroBarrio.trim() === '') {
      this.barriosFiltrados = [];
      return;
    }

    const filtro = this.normalizarTexto(this.filtroBarrio);

    this.barriosFiltrados = this.barrios.filter((barrio) =>
      this.normalizarTexto(barrio).includes(filtro)
    );

    console.log('Resultados:', this.barriosFiltrados);
  }

  seleccionarBarrio(barrio: string) {
    this.persona.direccion = barrio;
    this.filtroBarrio = barrio;
    this.barriosFiltrados = [];
  }
  
  manejarTeclaBarrio(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.filtroBarrio = '';
      this.barriosFiltrados = [];
    } else if (event.key === 'Enter' && this.barriosFiltrados.length > 0) {
      this.seleccionarBarrio(this.barriosFiltrados[0]);
    }
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
  


  nextStep() {
    if (this.emailExiste) {
      Swal.fire({
        title: 'Email ya registrado',
        text: 'El correo electrónico ya está en uso. Por favor usa otro.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    if (this.documentoExiste) {
      Swal.fire({
        title: 'Documento ya registrado',
        text: 'El número de documento ya está registrado.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
      });
      return;
    }
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
    private router: Router,
  ) {}

  register() {
    // Validaciones finales antes de enviar
    if (this.emailExiste) {
      Swal.fire({
        title: 'Error',
        text: 'El correo electrónico ya está registrado.',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

    if (this.documentoExiste) {
      Swal.fire({
        title: 'Error',
        text: 'El número de documento ya está registrado.',
        icon: 'error',
        timer: 2000,
      });
      return;
    }

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
    this.loading = true;
    this.authService.register(this.persona).pipe(finalize(() => this.loading = false)).subscribe({
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
    this.passwordsMatch = this.persona.usuario.password === this.confirmPassword;
  }

  passwordStrength = {
    width: '0%',
    color: 'red',
    text: '',
  };

  validacion = false;

  checkPasswordStrength(password: string) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    switch (strength) {
      case 0:
        this.validacion = true;
        this.passwordStrength = { 
          width: '0%', 
          color: 'red', 
          text: 'Mejora tu contraseña' 
        };
        break;
      case 1:
        this.validacion = true;
        this.passwordStrength = { 
          width: '25%', 
          color: 'red', 
          text: 'Débil' 
        };
        break;
      case 2:
        this.validacion = true;
        this.passwordStrength = {
          width: '50%',
          color: 'orange',
          text: 'Media',
        };
        break;
      case 3:
        this.validacion = true;
        this.passwordStrength = {
          width: '75%',
          color: 'yellowgreen',
          text: 'Buena',
        };
        break;
      case 4:
        this.validacion = true;
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

  isStep1Valid(): boolean {
    return (
      !this.emailExiste &&
      !this.documentoExiste &&
      !!this.persona.nombre &&
      !!this.persona.apellido &&
      !!this.persona.usuario.password &&
      !!this.confirmPassword &&
      !!this.persona.usuario.email &&
      !!this.persona.numero_documento &&
      !!this.persona.tipo_Documento &&
      this.persona.usuario.password === this.confirmPassword
    );
  }

  isStep2Valid(): boolean {
    return (
      !!this.persona.fecha_Nacimiento &&
      !!this.persona.genero &&
      !!this.persona.direccion &&
      !!this.persona.telefono &&
      !!this.persona.tipo_telefono &&
      !!this.persona.profesion
    );
  }
}
