import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { persona } from '../model/persona.model';
import { AppConfig } from '../core/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  URL = `${AppConfig.url}/personas/`;

  constructor(private http: HttpClient) { }

  public getPersonas(): Observable<persona> {
    return this.http.get<persona>(this.URL + 'traer/perfil');
  }

  public update(id: number, pers: persona): Observable<persona> {
    return this.http.put<persona>(this.URL + `update/${id}`, pers);
  }
}
