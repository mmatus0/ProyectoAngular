import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Herramienta } from '../models/herramienta.model';

@Injectable({ providedIn: 'root' })
export class HerramientaService {

  private http   = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/herramientas';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll() {
    return this.http.get<Herramienta[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<Herramienta>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: Partial<Herramienta>) {
    return this.http.post<Herramienta>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: Partial<Herramienta>) {
    return this.http.put<Herramienta>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}