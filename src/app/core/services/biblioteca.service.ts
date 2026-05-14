import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Biblioteca } from '../models/biblioteca.model';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/biblioteca`;

  getAll() {
    return this.http.get<Biblioteca[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Biblioteca>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Biblioteca>) {
    return this.http.post<Biblioteca>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Biblioteca>) {
    return this.http.put<Biblioteca>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
