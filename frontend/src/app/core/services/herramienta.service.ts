import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HerramientaService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private url          = `${environment.apiUrl}/herramientas`;

  private headers() {
    return { headers: this.authService.getAuthHeaders() };
  }

  getAsignaciones(estado: number) {
    return this.http.get<any>(`${this.url}?estado=${estado}`, this.headers());
  }

  getFormData() {
    return this.http.get<any>(`${this.url}/form-data`, this.headers());
  }

  getAsignadasPorUsuario(usuarioId: number) {
    return this.http.get<any>(`${this.url}/asignadas/${usuarioId}`, this.headers());
  }

  asignar(data: { usuario_id: number; herramientas: number[] }) {
    return this.http.post<any>(`${this.url}/asignar`, data, this.headers());
  }

  desactivar(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`, this.headers());
  }

  activar(id: number) {
    return this.http.post<any>(`${this.url}/${id}/activar`, {}, this.headers());
  }

  getMisHerramientas() {
    return this.http.get<any>(`${environment.apiUrl}/mis-herramientas`, this.headers());
  }

  getCuadrantes(asignacionId: number) {
    return this.http.get<any>(`${environment.apiUrl}/mis-herramientas/${asignacionId}/cuadrantes`, this.headers());
  }

  crearAtributo(asignacionId: number, body: any) {
    return this.http.post<any>(`${environment.apiUrl}/mis-herramientas/${asignacionId}/atributo`, body, this.headers());
  }

  actualizarAtributo(atributoId: number, body: any) {
    return this.http.put<any>(`${environment.apiUrl}/mis-herramientas/atributo/${atributoId}`, body, this.headers());
  }

  eliminarAtributo(atributoId: number) {
    return this.http.delete<any>(`${environment.apiUrl}/mis-herramientas/atributo/${atributoId}`, this.headers());
  }
}