import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class personaLoginComponent {

  usuario = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthPersonaService, private router: Router) { }

  login() {
    this.authService.login(this.usuario).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/ofertasInicio']); 
      },
      error: (error) => {
        console.error('Error de login:', error);
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
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
