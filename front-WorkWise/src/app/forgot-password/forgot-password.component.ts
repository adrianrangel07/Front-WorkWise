import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = '';
  codigo: string = '';
  password: string = '';
  confirmPassword: string = '';

  step: number = 1; // 1 = correo, 2 = código y contraseña
  loading: boolean = false;

  constructor(
    private resetService: PasswordResetService,
    private router: Router
  ) {}

  enviarCodigo() {
    if (!this.email || !this.validarEmail(this.email)) {
      Swal.fire('Error', 'Ingresa un correo válido', 'error');
      return;
    }

    this.loading = true;

    this.resetService.enviarCodigo(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2;
        this.startResendCountdown();

        Swal.fire(
          'Código enviado',
          'Revisa tu correo para continuar. <br><br><strong>Tu código expira en 15 minutos.</strong>',
          'success'
        );
      },

      error: (err) => {
        this.loading = false;
        console.error('Error completo:', err);

        let errorMessage = 'No se pudo enviar el código';

        if (err.status === 403) {
          errorMessage =
            'Acceso denegado. Verifica la configuración del servidor.';
        } else if (err.status === 404) {
          errorMessage =
            'Endpoint no encontrado. Verifica la URL del servicio.';
        } else if (err.status === 500) {
          errorMessage = 'Error interno del servidor. Intenta nuevamente.';
        } else if (err.error) {
          if (typeof err.error === 'object') {
            errorMessage = err.error.message || JSON.stringify(err.error);
          } else {
            errorMessage = err.error;
          }
        }

        Swal.fire('Atención', String(errorMessage), 'info');
      },
    });
  }

  cambiarPassword() {
    if (!this.codigo) {
      Swal.fire('Error', 'Ingresa el código de verificación', 'error');
      return;
    }

    if (!this.password || !this.confirmPassword) {
      Swal.fire('Error', 'Debe llenar todos los campos', 'error');
      return;
    }

    if (this.password.length < 6) {
      Swal.fire(
        'Error',
        'La contraseña debe tener al menos 6 caracteres',
        'error'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.loading = true;

    this.resetService
      .actualizarPassword(this.email, this.codigo, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: '¡Éxito!',
            text: 'Tu contraseña fue actualizada correctamente',
            icon: 'success',
            confirmButtonText: 'Ir al inicio de sesión',
          }).then((result) => {
            if (result.isConfirmed) {
              this.redirigirALogin();
            }
          });
        },
        error: (err) => {
          this.loading = false;
          console.error('Error completo:', err);

          let errorMessage = 'No se pudo cambiar la contraseña';

          if (err.status === 403) {
            errorMessage =
              'Acceso denegado. El código puede ser inválido o haber expirado.';
          } else if (err.status === 400) {
            errorMessage = 'Solicitud inválida. Verifica los datos ingresados.';
          } else if (err.error) {
            if (typeof err.error === 'object') {
              errorMessage = err.error.message || JSON.stringify(err.error);
            } else {
              errorMessage = err.error;
            }
          }

          Swal.fire('Error', String(errorMessage), 'error');
        },
      });
  }

  private reiniciarFormulario() {
    this.step = 1;
    this.email = '';
    this.codigo = '';
    this.password = '';
    this.confirmPassword = '';
  }

  private redirigirALogin() {
    this.reiniciarFormulario();
    this.router.navigate(['/loginPersona']);
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  volver() {
    if (this.step > 1) {
      this.step--;
    } else {
      // Si está en el paso 1, redirigir al login
      this.redirigirALogin();
    }
  }

  irALogin() {
    this.redirigirALogin();
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

  resendDisabled: boolean = true;
  resendTimer: number = 60;
  resendInterval: any;

  startResendCountdown() {
    this.resendDisabled = true;
    this.resendTimer = 60;

    this.resendInterval = setInterval(() => {
      this.resendTimer--;

      if (this.resendTimer <= 0) {
        this.resendDisabled = false;
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  reenviarCodigo() {
    if (this.resendDisabled) return;

    this.resendDisabled = true;
    this.startResendCountdown();

    this.resetService.enviarCodigo(this.email).subscribe({
      next: () => {
        Swal.fire(
          'Código reenviado',
          'Se ha enviado un nuevo código a tu correo.',
          'success'
        );
      },
      error: () => {
        Swal.fire('Error', 'No se pudo reenviar el código', 'error');
      },
    });
  }
}
