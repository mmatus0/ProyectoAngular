import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl       = `${environment.apiUrl}/usuarios`;

  getAll(estado: number = 1) {
    return this.http.get<any>(`${this.apiUrl}?estado=${estado}`, { headers: this.authService.getAuthHeaders() });
  }

  getFormData() {
    return this.http.get<any>(`${this.apiUrl}/form-data`, { headers: this.authService.getAuthHeaders() });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data, { headers: this.authService.getAuthHeaders() });
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.authService.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/activar`, {}, { headers: this.authService.getAuthHeaders() });
  }

  cargaMasiva(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(`${this.apiUrl}/carga-masiva`, formData, { headers: this.authService.getAuthHeaders() });
  }
}