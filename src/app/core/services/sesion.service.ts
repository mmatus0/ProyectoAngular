import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Sesion } from '../models/sesion.model';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sesiones`;

  getAll() {
    return this.http.get<Sesion[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Sesion>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Sesion>) {
    return this.http.post<Sesion>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Sesion>) {
    return this.http.put<Sesion>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
