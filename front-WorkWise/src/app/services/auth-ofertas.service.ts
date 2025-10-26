import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { HOME } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class AuthOfertasService {

  private apiUrl = 'http://localhost:8080/api/ofertas';

  constructor(private http: HttpClient) { }

  // 🔹 Obtener datos del usurio
  getOfertas(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/home`);
  }
}
