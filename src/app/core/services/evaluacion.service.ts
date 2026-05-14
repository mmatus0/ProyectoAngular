import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Evaluacion } from '../models/evaluacion.model';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evaluaciones`;

  getAll() {
    return this.http.get<Evaluacion[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Evaluacion>) {
    return this.http.post<Evaluacion>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Evaluacion>) {
    return this.http.put<Evaluacion>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
