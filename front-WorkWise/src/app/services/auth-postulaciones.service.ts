import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthPostulacionesService {

  private apiUrl = 'https://workwise-backend-s3w4.onrender.com/api/postulaciones';

  constructor(private http: HttpClient) { }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // postular a oferta
  postularse(ofertaId: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.warn('No hay token disponible');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { ofertaId };

    return this.http.post(`${this.apiUrl}/postularse`, body, { headers });
  }

  // obtener postulaciones del usuario
  getPostulaciones(): Observable<any> {
    const token = this.getToken();
    if (!token) {

      return of([]); 
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(`${this.apiUrl}/mis-postulaciones`, { headers });
  }

}
