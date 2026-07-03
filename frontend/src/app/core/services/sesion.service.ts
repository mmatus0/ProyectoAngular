import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SesionService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private url          = `${environment.apiUrl}/sesiones`;

  private headers() {
    return { headers: this.authService.getAuthHeaders() };
  }

  getSesiones(estado: number) {
    return this.http.get<any>(`${this.url}?estado=${estado}`, this.headers());
  }

  getFormData() {
    return this.http.get<any>(`${this.url}/form-data`, this.headers());
  }

  crear(data: any) {
    return this.http.post<any>(this.url, data, this.headers());
  }

  actualizar(id: number, data: any) {
    return this.http.put<any>(`${this.url}/${id}`, data, this.headers());
  }

  desactivar(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`, this.headers());
  }

  activar(id: number) {
    return this.http.post<any>(`${this.url}/${id}/activar`, {}, this.headers());
  }

  finalizar(id: number) {
    return this.http.post<any>(`${this.url}/${id}/finalizar`, {}, this.headers());
  }

  getDetalle(id: number) {
    return this.http.get<any>(`${this.url}/${id}/detalle`, this.headers());
  }

  actualizarDetalle(id: number, data: any) {
    return this.http.put<any>(`${this.url}/${id}/detalle`, data, this.headers());
  }

  finalizarDetalle(id: number, data: any) {
    return this.http.put<any>(`${this.url}/${id}/finalizar-detalle`, data, this.headers());
  }

  getMisSesiones() {
    return this.http.get<any>(`${environment.apiUrl}/mis-sesiones`, this.headers());
  }
}