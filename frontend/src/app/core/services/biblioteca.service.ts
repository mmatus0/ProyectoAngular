import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getCategorias() {
    return this.http.get<any>(`${this.api}/categorias`, { headers: this.getAuthHeaders() });
  }

  getByTipo(tipo: 'digital' | 'audiovisual', estado: number = 1) {
    return this.http.get<any>(`${this.api}/biblioteca?tipo=${tipo}&estado=${estado}`, { headers: this.getAuthHeaders() });
  }

  crearDigital(formData: FormData) {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${this.api}/biblioteca/digital`, formData,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) });
  }

  editarDigital(id: number, formData: FormData) {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${this.api}/biblioteca/digital/${id}`, formData,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) });
  }

  crearAudiovisual(body: any) {
    return this.http.post<any>(`${this.api}/biblioteca/audiovisual`, body, { headers: this.getAuthHeaders() });
  }

  editarAudiovisual(id: number, body: any) {
    return this.http.put<any>(`${this.api}/biblioteca/audiovisual/${id}`, body, { headers: this.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.post<any>(`${this.api}/biblioteca/${id}/desactivar`, {}, { headers: this.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.api}/biblioteca/${id}/activar`, {}, { headers: this.getAuthHeaders() });
  }

  getMiBiblioteca() {
    return this.http.get<any>(`${this.api}/mi-biblioteca`, { headers: this.getAuthHeaders() });
  }

  getUrlArchivo(ruta: string): string {
    const base = environment.apiUrl.replace('/api', '');
    return `${base}/uploads/${ruta}`;
  }
}