import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';
import { AuthPersonaService } from '../../services/auth-personsa.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar-acordion',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar-acordion.component.html',
  styleUrl: './navbar-acordion.component.css'
})
export class NavbarAcordionComponent implements OnInit {
  logueado = false;

  constructor(private authService: AuthPersonaService, private router:Router ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((estado) => {
      this.logueado = estado;
      console.log('Estado de logueo en Navbar:', this.logueado);  
    });
  }
}
