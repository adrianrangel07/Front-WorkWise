import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { LoadingComponent } from '../../reutilzar/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class personaLoginComponent {

  usuario = {
    email: '',
    password: ''
  };

  loading = false;

  constructor(private authService: AuthPersonaService, private router: Router) { }

  login() {
    this.loading = true;
    this.authService.login(this.usuario).pipe(finalize(() => this.loading = false)).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveRol(response.rol)
        Swal.fire({
          icon: 'success',
          title: '¡Login exitoso!',
          timer: 1500
        }).then(() => {
          this.router.navigate(['/ofertasInicio']);
        });
      },
      error: (error) => {
        console.error('Error de login:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de login',
          text: 'Credenciales incorrectas. Por favor, intenta de nuevo.'
        });
      }
    });
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
