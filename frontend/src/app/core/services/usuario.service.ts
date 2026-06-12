import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private http   = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(estado: number = 1) {
    return this.http.get<any>(`${this.apiUrl}?estado=${estado}`, { headers: this.getAuthHeaders() });
  }

  getFormData() {
    return this.http.get<any>(`${this.apiUrl}/form-data`, { headers: this.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/activar`, {}, { headers: this.getAuthHeaders() });
  }

  cargaMasiva(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrl}/carga-masiva`, formData, { headers });
  }
}