import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { AuthEmpresaService } from '../../services/auth-empresa.service';
import { AuthService } from '../../services/auth.service';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, interval, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import Swal from 'sweetalert2';

import {
  NotificacionService,
  Notificacion,
} from '../../services/notificacion.service';

@Component({
  selector: 'app-navbarbusqueda',
  imports: [RouterLink, RouterLinkActive, NgIf, CommonModule, FormsModule],
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
  esPersona = false;
  esEmpresa = false;

  // 🔔 NOTIFICACIONES
  notificaciones: Notificacion[] = [];
  cantidadNoLeidas = 0;
  mostrarNotificaciones = false;
  private pollingSub!: Subscription;

  filtros = {
    salarioMin: null as number | null,
    salarioMax: null as number | null,
    tipoContrato: '',
    tipoEmpleo: '',
    modalidades: [] as string[],
  };

  private searchSubject = new Subject<string>();

  constructor(
    private authPersonaService: AuthPersonaService,
    private authEmpresaService: AuthEmpresaService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.rolActual().subscribe((rol) => {
      this.logueado = rol !== 'INVITADO';

      if (this.logueado && rol === 'PERSONA') {
        this.iniciarPollingNotificaciones();
      }
    });

    this.authService.actualizarRol();
    this.cargarUsuario();
    this.cargarEmpresa();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((termino) => {
        this.buscar.emit(termino);
      });
  }

  iniciarPollingNotificaciones() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }

    this.pollingSub = interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => this.notificacionService.obtenerCantidadNoLeidas()),
      )
      .subscribe({
        next: (count) => {
          this.cantidadNoLeidas = Number(count) || 0;
        },
        error: (err) => {
          console.error('Error polling contador', err);
          this.cantidadNoLeidas = 0;
        },
      });
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;

    if (this.mostrarNotificaciones) {
      this.cargarListaNotificaciones();
    }
  }

  cargarListaNotificaciones() {
    console.log('🔍 Cargando lista de notificaciones...');
    console.log('📤 Llamando al endpoint: /api/notificaciones/no-leidas');

    this.notificacionService.obtenerNoLeidas().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos del backend:', data);
        console.log('📊 Cantidad de notificaciones:', data.length);
        this.notificaciones = data;

        // Verificar que las notificaciones tengan los campos correctos
        if (data.length > 0) {
          console.log('📝 Primera notificación:', data[0]);
        }
      },
      error: (err) => {
        console.error('❌ Error cargando notificaciones:', err);
        console.error('Detalles del error:', err.message);
      },
    });
  }

  abrirNotificacion(n: Notificacion) {
    this.notificacionService.marcarComoLeida(n.id).subscribe(() => {
      this.notificaciones = this.notificaciones.filter(
        (not) => not.id !== n.id,
      );

      this.cantidadNoLeidas--;

      if (n.link) {
        this.router.navigateByUrl(n.link);
      }
    });
  }

  onBuscar(event: Event) {
    event.preventDefault();
    this.searchSubject.next(this.terminoBusqueda.trim());
  }

  onInputChange() {
    this.searchSubject.next(this.terminoBusqueda.trim());
  }

  async logout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres salir de tu cuenta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0a1128',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      this.authService.logout();
      this.logueado = false;
      this.persona = null;

      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
      }).then(() => {
        this.router.navigate(['/ofertasInicio']);
      });
    }
  }

  cargarUsuario() {
    this.authPersonaService.getPersona().subscribe({
      next: (data) => {
        if (!data) return;

        this.persona = data;
        this.esPersona = true;
        this.esEmpresa = false;

        this.authPersonaService
          .getFotoPerfil(this.persona.id)
          .subscribe((blob) => {
            this.persona.photo = URL.createObjectURL(blob);
          });
      },
    });
  }

  cargarEmpresa() {
    this.authEmpresaService.getEmpresa().subscribe({
      next: (data) => {
        if (!data || this.esPersona) return;

        this.empresa = data;
        this.esEmpresa = true;
        this.esPersona = false;
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

    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  // Métodos para los filtros
  aplicarFiltrosHandler() {
    // Obtener valores actuales de los inputs
    const salarioMinInput = document.getElementById(
      'salarioMin',
    ) as HTMLInputElement;
    const salarioMaxInput = document.getElementById(
      'salarioMax',
    ) as HTMLInputElement;
    const tipoContratoSelect = document.getElementById(
      'typeContract',
    ) as HTMLSelectElement;
    const tipoEmpleoSelect = document.getElementById(
      'tipoEmpleoSelect',
    ) as HTMLSelectElement;
    const modalidadPresencial = document.getElementById(
      'modalidadPresencial',
    ) as HTMLInputElement;
    const modalidadRemoto = document.getElementById(
      'modalidadRemoto',
    ) as HTMLInputElement;
    const modalidadHibrido = document.getElementById(
      'modalidadHibrido',
    ) as HTMLInputElement;

    // Actualizar objeto de filtros
    this.filtros.salarioMin = salarioMinInput.value
      ? Number(salarioMinInput.value)
      : null;
    this.filtros.salarioMax = salarioMaxInput.value
      ? Number(salarioMaxInput.value)
      : null;
    this.filtros.tipoContrato = tipoContratoSelect.value;
    this.filtros.tipoEmpleo = tipoEmpleoSelect.value;

    // Actualizar modalidades
    this.filtros.modalidades = [];
    if (modalidadPresencial.checked)
      this.filtros.modalidades.push('presencial');
    if (modalidadRemoto.checked) this.filtros.modalidades.push('remoto');
    if (modalidadHibrido.checked) this.filtros.modalidades.push('híbrido');

    console.log('Filtros aplicados:', this.filtros);
    this.aplicarFiltros.emit(this.filtros);

    // Cerrar el menú de filtros
    this.cerrarMenuFiltros();
  }

  restablecerFiltros() {
    // Limpiar inputs
    const salarioMinInput = document.getElementById(
      'salarioMin',
    ) as HTMLInputElement;
    const salarioMaxInput = document.getElementById(
      'salarioMax',
    ) as HTMLInputElement;
    const tipoContratoSelect = document.getElementById(
      'typeContract',
    ) as HTMLSelectElement;
    const tipoEmpleoSelect = document.getElementById(
      'tipoEmpleoSelect',
    ) as HTMLSelectElement;
    const modalidadPresencial = document.getElementById(
      'modalidadPresencial',
    ) as HTMLInputElement;
    const modalidadRemoto = document.getElementById(
      'modalidadRemoto',
    ) as HTMLInputElement;
    const modalidadHibrido = document.getElementById(
      'modalidadHibrido',
    ) as HTMLInputElement;

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
      modalidades: [],
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
}
