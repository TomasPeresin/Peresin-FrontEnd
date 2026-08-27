import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDto } from '../model/jwt-dto';
import { LoginUsuario } from '../model/login-usuario';
import { NuevoUsuario } from '../model/nuevo-usuario';
import { AppConfig } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURL = `${AppConfig.url}/auth/`;

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }

  public solicitarRecuperacion(email: string): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'recuperar-password', { email });
  }

  public verificarToken(token: string): Observable<any> {
    return this.httpClient.get<any>(`${this.authURL}verificar-token/${token}`);
  }

  public cambiarPassword(token: string, newPassword: string): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'cambiar-password', { token, newPassword });
  }
}
