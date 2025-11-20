import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { AuthEmpresaService } from '../../services/auth-empresa.service';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbarbusqueda',
  imports: [RouterLink, RouterLinkActive, NgIf, FormsModule],
  templateUrl: './navbarbusqueda.component.html',
  styleUrl: './navbarbusqueda.component.css',
})
export class NavbarbusquedaComponent {
  @Input() modo: 'link' | 'buscador' = 'link';
  @Output() buscar = new EventEmitter<string>();
  @Output() aplicarFiltros = new EventEmitter<any>();

  logueado = false;
  persona: any = null;
  empresa: any = null;
  terminoBusqueda: string = '';

  // Propiedades para los filtros
  filtros = {
    salarioMin: null as number | null,
    salarioMax: null as number | null,
    tipoContrato: '',
    tipoEmpleo: '',
    modalidades: [] as string[]
  };

  private searchSubject = new Subject<string>();

  constructor(
    private authPersonaService: AuthPersonaService,
    private authEmpresaService: AuthEmpresaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.rolActual().subscribe((rol) => {
      this.logueado = rol !== 'INVITADO';
      console.log('Logueado:', this.logueado);
    });

    this.authService.actualizarRol();
    this.cargarUsuario();
    this.cargarEmpresa();

    // Configurar el debounce para búsqueda en tiempo real
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((termino) => {
        this.buscar.emit(termino);
      });
  }

  onBuscar(event: Event) {
    event.preventDefault();
    this.searchSubject.next(this.terminoBusqueda.trim());
  }

  onInputChange() {
    this.searchSubject.next(this.terminoBusqueda.trim());
  }

  // Métodos para los filtros
  aplicarFiltrosHandler() {
    // Obtener valores actuales de los inputs
    const salarioMinInput = document.getElementById('salarioMin') as HTMLInputElement;
    const salarioMaxInput = document.getElementById('salarioMax') as HTMLInputElement;
    const tipoContratoSelect = document.getElementById('typeContract') as HTMLSelectElement;
    const tipoEmpleoSelect = document.getElementById('tipoEmpleoSelect') as HTMLSelectElement;
    const modalidadPresencial = document.getElementById('modalidadPresencial') as HTMLInputElement;
    const modalidadRemoto = document.getElementById('modalidadRemoto') as HTMLInputElement;
    const modalidadHibrido = document.getElementById('modalidadHibrido') as HTMLInputElement;

    // Actualizar objeto de filtros
    this.filtros.salarioMin = salarioMinInput.value ? Number(salarioMinInput.value) : null;
    this.filtros.salarioMax = salarioMaxInput.value ? Number(salarioMaxInput.value) : null;
    this.filtros.tipoContrato = tipoContratoSelect.value;
    this.filtros.tipoEmpleo = tipoEmpleoSelect.value;
    
    // Actualizar modalidades
    this.filtros.modalidades = [];
    if (modalidadPresencial.checked) this.filtros.modalidades.push('presencial');
    if (modalidadRemoto.checked) this.filtros.modalidades.push('remoto');
    if (modalidadHibrido.checked) this.filtros.modalidades.push('híbrido');

    console.log('Filtros aplicados:', this.filtros);
    this.aplicarFiltros.emit(this.filtros);

    // Cerrar el menú de filtros
    this.cerrarMenuFiltros();
  }

  restablecerFiltros() {
    // Limpiar inputs
    const salarioMinInput = document.getElementById('salarioMin') as HTMLInputElement;
    const salarioMaxInput = document.getElementById('salarioMax') as HTMLInputElement;
    const tipoContratoSelect = document.getElementById('typeContract') as HTMLSelectElement;
    const tipoEmpleoSelect = document.getElementById('tipoEmpleoSelect') as HTMLSelectElement;
    const modalidadPresencial = document.getElementById('modalidadPresencial') as HTMLInputElement;
    const modalidadRemoto = document.getElementById('modalidadRemoto') as HTMLInputElement;
    const modalidadHibrido = document.getElementById('modalidadHibrido') as HTMLInputElement;

    salarioMinInput.value = '';
    salarioMaxInput.value = '';
    tipoContratoSelect.value = '';
    tipoEmpleoSelect.value = '';
    modalidadPresencial.checked = false;
    modalidadRemoto.checked = false;
    modalidadHibrido.checked = false;

    // Limpiar objeto de filtros
    this.filtros = {
      salarioMin: null,
      salarioMax: null,
      tipoContrato: '',
      tipoEmpleo: '',
      modalidades: []
    };

    console.log('Filtros restablecidos');
    this.aplicarFiltros.emit(this.filtros);

    // Cerrar el menú de filtros
    this.cerrarMenuFiltros();
  }

  private cerrarMenuFiltros() {
    const btnMenu = document.getElementById('btn-menu') as HTMLInputElement;
    if (btnMenu) {
      btnMenu.checked = false;
    }
  }

  async logout() {
    // Mostrar confirmación antes de cerrar sesión
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0a1128',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      // Realizar logout
      this.authService.logout();
      this.logueado = false;
      this.persona = null;
      
      // Mostrar mensaje de éxito
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
        background: '#f8f9fa',
        iconColor: '#28a745'
      }).then(() => {
        // Redirigir después de mostrar el mensaje
        this.router.navigate(['/ofertasInicio']);
      });
    }
  }

  cargarUsuario() {
    this.authPersonaService.getPersona().subscribe({
      next: (data) => {
        this.persona = data;
        console.log(this.persona);
        this.authPersonaService
          .getFotoPerfil(this.persona.id)
          .subscribe((blob) => {
            this.persona.photo = URL.createObjectURL(blob);
          });
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario', err);
      },
    });
  }

  cargarEmpresa() {
    this.authEmpresaService.getEmpresa().subscribe({
      next: (data) => {
        this.empresa = data;
        console.log(this.empresa);
      },
      error: (err) => {
        console.error('Error al cargar los datos de la empresa', err);
      },
    });
  }

  get inicialesPer(): string {
    if (!this.persona?.nombre || !this.persona?.apellido) return '';
    return (
      this.persona.nombre.charAt(0).toUpperCase() +
      this.persona.apellido.charAt(0).toUpperCase()
    );
  }

  get inicialesEmp(): string {
    if (!this.empresa?.nombre) return '';
    return (
      this.empresa.nombre.charAt(0).toUpperCase() +
      this.empresa.nombre.charAt(1).toUpperCase()
    );
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}