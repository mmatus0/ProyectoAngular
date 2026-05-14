import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Herramienta } from '../models/herramienta.model';

@Injectable({ providedIn: 'root' })
export class HerramientaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/herramientas`;

  getAll() {
    return this.http.get<Herramienta[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Herramienta>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Herramienta>) {
    return this.http.post<Herramienta>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Herramienta>) {
    return this.http.put<Herramienta>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
