import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Evaluacion } from '../models/evaluacion.model';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {

  private http   = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/evaluaciones';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll() {
    return this.http.get<Evaluacion[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: Partial<Evaluacion>) {
    return this.http.post<Evaluacion>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: Partial<Evaluacion>) {
    return this.http.put<Evaluacion>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}