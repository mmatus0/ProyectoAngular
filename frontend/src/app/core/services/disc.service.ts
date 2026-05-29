import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscInstancia } from '../models/disc.model';

@Injectable({ providedIn: 'root' })
export class DiscService {

  private http   = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/disc';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll() {
    return this.http.get<DiscInstancia[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<DiscInstancia>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: Partial<DiscInstancia>) {
    return this.http.post<DiscInstancia>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: Partial<DiscInstancia>) {
    return this.http.put<DiscInstancia>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}