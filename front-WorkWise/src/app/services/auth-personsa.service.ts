import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { A } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class AuthPersonaService {

  private loggedin = new BehaviorSubject<boolean>(this.getToken() !== null);

  private apiUrl = 'http://localhost:8080/api/personas';

  constructor(private http: HttpClient) { }

  // Iniciar sesión
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Registrar nuevo usuario
  register(persona: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, persona);
  }

  // Obtener datos del usurio
  getPersona(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/perfil`, { headers });
  }

  // Subir cv
  uploadCV(file: File): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/cv`, formData, { headers, responseType: 'text' });
  }

  // obetener cv
  getCV(id: number): Observable<Blob> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/cv/${id}`, { headers, responseType: 'blob' });
  }

  // Eliminar CV
  eliminarCV(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/cv`, { headers, responseType: 'text' });
  }

  // subir foto de perfil
  uploadFoto(file: File): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const formData = new FormData();
    formData.append('file', file);


    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/foto`, formData, { headers, responseType: 'text' });
  }

  getFotoPerfil(id: number): Observable<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/foto/${id}`, { headers, responseType: 'blob' });
  }

  // eliminar foto de perfil
  // eliminarFoto(): Observable<any> {
  //   const token = this.getToken();
  //   if (!token) {
  //     throw new Error('No hay token disponible');
  //   }
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  //   return this.http.delete(`${this.apiUrl}/foto`, { headers, responseType: 'text' });
  // }

  // Guardar token en el navegador
  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedin.next(true);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.loggedin.next(false);
  }

  // erificar si está logueado
  isLoggedIn(): Observable<boolean> {
    return this.loggedin.asObservable();
  }
}
