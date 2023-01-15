import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hardysoft } from '../model/hardysoft';

@Injectable({
  providedIn: 'root'
})
export class SHysskillsService {
  hysURL = 'http://backendpti.onrender.com/skill/'
  constructor(private httpClient : HttpClient) { }

  public lista(): Observable<Hardysoft[]>{
    return this.httpClient.get<Hardysoft[]>(this.hysURL + 'lista');
  }

  public detail(id: number): Observable<Hardysoft>{
    return this.httpClient.get<Hardysoft>(this.hysURL + `detail/${id}`);
  }

  public save(skills:Hardysoft): Observable<any>{
    return this.httpClient.post<any>(this.hysURL + 'create', skills);
  }

  public update(id: number, skills: Hardysoft): Observable<any>{
    return this.httpClient.put<any>(this.hysURL + `update/${id}`, skills);
  }

  public delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(this.hysURL + `delete/${id}`);
  }
}