import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HerramientaService {

  private http = inject(HttpClient);
  private url  = 'http://localhost:3000/api/herramientas';

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
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
}