import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

interface Oferta {
  id: number;
  titulo: string;
  empresa: {
    id: number;
    nombre: string;
  };
  salario: number;
  moneda: string;
  ubicacion: string;
  tipo_Empleo: string;
  descripcion: string;
  habilidades: string[];
  nivel_Educacion: string;
  experiencia: number;
  modalidad: string;
  sector_oferta: string;
  fecha_Cierre: Date;
  activo: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthOfertasService {
  private ofertaSeleccionada: Oferta | null = null;

  private apiUrl = 'http://localhost:8080/api/ofertas';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener datos del usurio
  getOfertas(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/home`);
  }

  actualizarOferta(id: number, oferta: Oferta): Observable<Oferta> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Oferta>(`${this.apiUrl}/${id}`, oferta, { headers });
  }

  toggleOferta(id: number): Observable<Oferta> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.put<Oferta>(
      `${this.apiUrl}/${id}/toggle`,
      {},
      { headers }
    );
  }

  setOfertaSeleccionada(oferta: Oferta) {
    this.ofertaSeleccionada = oferta;
  }

  getOfertaSeleccionada(): Oferta | null {
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
