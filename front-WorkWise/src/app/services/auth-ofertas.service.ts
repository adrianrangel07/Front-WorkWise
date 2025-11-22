import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, delay } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthOfertasService {

  private ofertaSeleccionada: any | null = null;

  private apiUrl = 'https://workwise-backend-s3w4.onrender.com/api/ofertas';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener datos del usurio
  getOfertas(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/home`);
  }

  actualizarOferta(id: number, oferta: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<any>(`${this.apiUrl}/${id}`, oferta, { headers });
  }

  toggleOferta(id: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.put<any>(
      `${this.apiUrl}/${id}/toggle`,
      {},
      { headers }
    );
  }

  setOfertaSeleccionada(oferta: any) {
    this.ofertaSeleccionada = oferta;
  }

  getOfertaSeleccionada(): any | null {
    return this.ofertaSeleccionada;
  }

  clearOfertaSeleccionada() {
    this.ofertaSeleccionada = null;
  }

  getOfertasCompatibles(personaId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/compatibles/${personaId}`, {
      headers,
    });
  }
}
