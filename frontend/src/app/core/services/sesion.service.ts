import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sesion } from '../models/sesion.model';

@Injectable({ providedIn: 'root' })
export class SesionService {

  private http   = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/sesiones';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll() {
    return this.http.get<Sesion[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<Sesion>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: Partial<Sesion>) {
    return this.http.post<Sesion>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: Partial<Sesion>) {
    return this.http.put<Sesion>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}