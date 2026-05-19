import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { __param } from 'tslib';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthChatbotService {

  private apiUrlAntiguo = `${environment.apiUrl}/chatbot/message`;
  private apiUrlNuevo = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  enviarMensaje(mensaje: string, tipo: 'antiguo' | 'nuevo'): Observable<any> {
    if(tipo === 'nuevo'){
      const params = new HttpParams().set('message', mensaje);
      return this.http.get(this.apiUrlNuevo, { params, responseType: 'text' }  );
    }
    else{
      return this.http.post<any>(this.apiUrlAntiguo, { mensaje });
    }
  }
}
