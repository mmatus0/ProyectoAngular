import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private api          = environment.apiUrl;

  getCategorias() {
    return this.http.get<any>(`${this.api}/categorias`, { headers: this.authService.getAuthHeaders() });
  }

  getClientes() {
    return this.http.get<any>(`${this.api}/biblioteca/clientes`, { headers: this.authService.getAuthHeaders() });
  }

  getByTipo(tipo: 'digital' | 'audiovisual', estado: number = 1) {
    return this.http.get<any>(`${this.api}/biblioteca?tipo=${tipo}&estado=${estado}`, { headers: this.authService.getAuthHeaders() });
  }

  crearDigital(formData: FormData) {
    return this.http.post<any>(`${this.api}/biblioteca/digital`, formData, { headers: this.authService.getAuthHeaders() });
  }

  editarDigital(id: number, formData: FormData) {
    return this.http.put<any>(`${this.api}/biblioteca/digital/${id}`, formData, { headers: this.authService.getAuthHeaders() });
  }

  crearAudiovisual(body: any) {
    return this.http.post<any>(`${this.api}/biblioteca/audiovisual`, body, { headers: this.authService.getAuthHeaders() });
  }

  editarAudiovisual(id: number, body: any) {
    return this.http.put<any>(`${this.api}/biblioteca/audiovisual/${id}`, body, { headers: this.authService.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.post<any>(`${this.api}/biblioteca/${id}/desactivar`, {}, { headers: this.authService.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.api}/biblioteca/${id}/activar`, {}, { headers: this.authService.getAuthHeaders() });
  }

  getMiBiblioteca() {
    return this.http.get<any>(`${this.api}/mi-biblioteca`, { headers: this.authService.getAuthHeaders() });
  }

  getUrlArchivo(ruta: string): string {
    const base = environment.apiUrl.replace('/api', '');
    return `${base}/uploads/${ruta}`;
  }
}