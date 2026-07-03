import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private url          = `${environment.apiUrl}/evaluaciones`;

  private headers() {
    return { headers: this.authService.getAuthHeaders() };
  }

  getEvaluaciones(estado: number) {
    return this.http.get<any>(`${this.url}?estado=${estado}`, this.headers());
  }

  getFormData() {
    return this.http.get<any>(`${this.url}/form-data`, this.headers());
  }

  asignar(data: any) {
    return this.http.post<any>(`${this.url}/asignar`, data, this.headers());
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

  getMisEvaluaciones() {
    return this.http.get<any>(`${environment.apiUrl}/mis-evaluaciones`, this.headers());
  }

  getAsignadasPorUsuario(usuarioId: number) {
    return this.http.get<any>(`${this.url}/asignadas/${usuarioId}`, this.headers());
  }

  asignarLote(data: any) {
    return this.http.post<any>(`${this.url}/asignar-lote`, data, this.headers());
  }

  getTest(asignacionId: number) {
    return this.http.get<any>(`${environment.apiUrl}/mis-evaluaciones/${asignacionId}/test`, this.headers());
  }

  guardarTest(asignacionId: number, body: any) {
    return this.http.post<any>(`${environment.apiUrl}/mis-evaluaciones/${asignacionId}/guardar`, body, this.headers());
  }

  getResultados(asignacionId: number) {
    return this.http.get<any>(`${environment.apiUrl}/mis-evaluaciones/${asignacionId}/resultados`, this.headers());
  }
}