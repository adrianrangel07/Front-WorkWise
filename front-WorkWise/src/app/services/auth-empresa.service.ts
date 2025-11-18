import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthEmpresaService {

  private loggedin = new BehaviorSubject<boolean>(this.getToken() !== null);
  
  private apiUrl = 'http://localhost:8080/api/empresas';

  constructor(private http: HttpClient) { }

   // Iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Registrar nuevo usuario
  register(persona: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, persona);
  }

  // Obtener datos de la empresa
  getEmpresa(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      console.warn('No se encontró token de autenticación para empresa.');
      return of(null);
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/perfil`, { headers });
  }

  crearOferta(oferta: any): Observable<any>{
    const token = this.getToken();

    if (!token) {
      console.warn('No se encontró token de autenticación para empresa.');
      return of(null);
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/ofertas`, oferta ,{ headers});
  }

  getOfertas(page: number , size: number){
    const token = this.getToken();

    if(!token){
      console.warn('No se encontró token de autenticación para empresa.');
      return of([]);
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/ofertas?page=${page}&size=${size}`,{headers});
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedin.next(true);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //Guardar rol en el navegador
  saveRol(rol: string) {
    localStorage.setItem('rol', rol);
    this.loggedin.next(true);
  }

  // Obtener rol
  getRol():string | null{
    return localStorage.getItem('rol')
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol')
    this.loggedin.next(false);
  }

  // Verificar si está logueado
  isLoggedIn(): Observable<boolean> {
    return this.loggedin.asObservable();
  }
}
