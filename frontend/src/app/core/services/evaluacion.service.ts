import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {

  private http = inject(HttpClient);
  private url  = 'http://localhost:3000/api/evaluaciones';

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
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
    return this.http.get<any>('http://localhost:3000/api/mis-evaluaciones', this.headers());
  }
}