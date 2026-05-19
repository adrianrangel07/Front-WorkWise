import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private apiUrl = `${environment.apiUrl}/password`;

  constructor(private http: HttpClient) {}

  enviarCodigo(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/forgot-password`, null, { params });
  }

  actualizarPassword(email: string, codigo: string, nuevaPassword: string) {
    const body = {
      email: email,
      token: codigo,
      newPassword: nuevaPassword,
    };

    return this.http.post(`${this.apiUrl}/reset-password`, body);
  }
}
