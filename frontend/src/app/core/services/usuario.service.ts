import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http   = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll(estado: number = 1) {
    return this.http.get<any>(`${this.apiUrl}?estado=${estado}`);
  }

  getFormData() {
    return this.http.get<any>(`${this.apiUrl}/form-data`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  desactivar(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  activar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/activar`, {});
  }
}