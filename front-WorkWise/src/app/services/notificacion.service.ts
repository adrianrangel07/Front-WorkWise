import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  link?: string;
  fechaCreacion: string;
  leido: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private apiUrl = 'http://localhost:8080/api/notificaciones';

  constructor(private http: HttpClient) {}

  // Método privado para no repetir código de cabeceras
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  obtenerNoLeidas(): Observable<Notificacion[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]); // Si no hay token, devolvemos un array vacío sin error
    }

    return this.http.get<Notificacion[]>(`${this.apiUrl}/no-leidas`, {
      headers: this.getHeaders(),
    });
  }

  obtenerCantidadNoLeidas(): Observable<number> {
    const token = localStorage.getItem('token');
    if (!token) return of(0);

    return this.http.get<number>(`${this.apiUrl}/no-leidas/count`, {
      headers: this.getHeaders(),
    });
  }

  marcarComoLeida(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) return of();

    return this.http.put<void>(
      `${this.apiUrl}/${id}/leida`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}
