import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DiscInstancia } from '../models/disc.model';

@Injectable({ providedIn: 'root' })
export class DiscService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/disc`;

  getAll() {
    return this.http.get<DiscInstancia[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<DiscInstancia>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<DiscInstancia>) {
    return this.http.post<DiscInstancia>(this.apiUrl, data);
  }

  update(id: number, data: Partial<DiscInstancia>) {
    return this.http.put<DiscInstancia>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
