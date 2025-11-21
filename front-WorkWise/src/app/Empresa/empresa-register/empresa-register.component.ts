import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthEmpresaService } from '../../services/auth-empresa.service';
import { sectores_empresariales } from '../../data/sectores_empresariales';
import { BARRIOS_CARTAGENA } from '../../data/barrios';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-register',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './empresa-register.component.html',
  styleUrl: './empresa-register.component.css'
})
export class EmpresaRegisterComponent {
  step: number = 1;
  confirmPassword: string = '';
  passwordsMatch: boolean | null = null;
  sectores = sectores_empresariales;
  barrios = BARRIOS_CARTAGENA;

  empresa = {
    nombre: '',
    razonSocial: '',
    direccion: '',
    nit: '',
    telefono: '',
    tipo_telefono: '',
    sector: '',
    descripcion: '',
    usuario: {
      email: '',
      password: ''
    }
  };


  nextStep() {
    if (this.step < 2) {
      this.step++;
      console.log();
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  constructor(private authService: AuthEmpresaService, private router: Router) { }

  registerEmpresa() {
    if (this.empresa.usuario.password !== this.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        timer: 2000,
      });
      return
    }

    this.authService.register(this.empresa).subscribe({
      next: (response) => {
        console.log('Empresa registrada con éxito', response);
        Swal.fire({
          title: 'Éxito',
          text: 'Empresa registrada con éxito.',
          icon: 'success',
          timer: 2000,
        }).then(() => {
          this.router.navigate(['/loginEmpresa']);
        });
      }, error: (error) => {
        console.error('Error al registrar la empresa', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar la empresa.',
          icon: 'error',
          timer: 2000,
        });
      }
    });
  }


  checkPasswordsMatch() {
    if (!this.empresa.usuario.password || !this.confirmPassword) {
      this.passwordsMatch = null; // no mostrar nada si alguno está vacío
      return;
    }
    this.passwordsMatch = this.empresa.usuario.password === this.confirmPassword;
  }

  passwordStrength = {
    width: '0%',
    color: 'red',
    text: ''
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
        this.passwordStrength = { width: '50%', color: 'orange', text: 'Media' };
        break;
      case 3:
        this.passwordStrength = { width: '75%', color: 'yellowgreen', text: 'Buena' };
        break;
      case 4:
        this.passwordStrength = { width: '100%', color: 'green', text: 'Fuerte' };
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
