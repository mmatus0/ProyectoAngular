import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Biblioteca } from '../models/biblioteca.model';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {

  private http   = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/biblioteca';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll() {
    return this.http.get<Biblioteca[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<Biblioteca>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: Partial<Biblioteca>) {
    return this.http.post<Biblioteca>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: Partial<Biblioteca>) {
    return this.http.put<Biblioteca>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}