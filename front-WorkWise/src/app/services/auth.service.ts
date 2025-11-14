import { Injectable } from '@angular/core';
import { AuthPersonaService } from './auth-personsa.service';
import { AuthEmpresaService } from './auth-empresa.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private rolSubject = new BehaviorSubject<'PERSONA' | 'EMPRESA' | 'INVITADO'>('INVITADO');

  private loggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private authPersonaService: AuthPersonaService, private authEmpresaService: AuthEmpresaService) {
    this.updateLoginStatus();
  }

  rolActual(): Observable<'PERSONA' | 'EMPRESA' | 'INVITADO'> {
    return this.rolSubject.asObservable();
  }

  actualizarRol() {
    const personaRol = this.authPersonaService.getRol();
    const empresaRol = this.authEmpresaService.getRol();

    if (personaRol === 'PERSONA') {
      this.authPersonaService.getPersona().pipe(catchError(() => of(null))).subscribe(persona => {
        if (persona?.usuario?.rol === 'PERSONA') {
          this.rolSubject.next('PERSONA');
          console.log('persona')
        } else {
          this.rolSubject.next('INVITADO');
        }
      });
    } else if (empresaRol) {
      this.authEmpresaService.getEmpresa().pipe(catchError(() => of(null))).subscribe(empresa => {
        if (empresa?.usuario?.rol === 'EMPRESA') {
          this.rolSubject.next('EMPRESA');
          console.log('empresa')
        } else {
          this.rolSubject.next('INVITADO');
        }
      });
    } else {
      this.rolSubject.next('INVITADO');
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  updateLoginStatus() {
    const personaToken = this.authPersonaService.getToken();
    const empresaToken = this.authEmpresaService.getToken();
    
    if (personaToken || empresaToken) {
      this.loggedInSubject.next(true);
    } else {
      this.loggedInSubject.next(false);
    }
  }

  logout() {
    this.authPersonaService.logout();
    this.authEmpresaService.logout();
    this.rolSubject.next('INVITADO');
  }
}
