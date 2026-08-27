import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/config/app.config';

export interface FileResponse {
  nombreArchivo: string;
  url: string;
  tipo: string;
  tamano: number;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private fileUrl = `${AppConfig.url}/files`;

  constructor(private httpClient: HttpClient) {}

  public upload(file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<FileResponse>(`${this.fileUrl}/upload`, formData);
  }

  public delete(filename: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.fileUrl}/${filename}`);
  }
}
