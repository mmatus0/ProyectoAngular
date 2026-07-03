import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InstitucionService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl       = `${environment.apiUrl}/instituciones`;

  getAll(estadoId: number) {
    return this.http.get<any>(`${this.apiUrl}?estado=${estadoId}`, { headers: this.authService.getAuthHeaders() });
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data, { headers: this.authService.getAuthHeaders() });
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.authService.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/desactivar`, {}, { headers: this.authService.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/activar`, {}, { headers: this.authService.getAuthHeaders() });
  }

  cargaMasiva(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(`${this.apiUrl}/carga-masiva`, formData, { headers: this.authService.getAuthHeaders() });
  }

  descargarPlantilla() {
  import('xlsx').then(XLSX => {
    const datos = [
      ['empresa', 'razonsocial', 'nroidentfiscal', 'direccion', 'telefonos', 'paginaweb'],
      ['Empresa Ejemplo', 'Ejemplo S.A.', '12345678-9', 'Av. Principal 123', '+56912345678', 'https://ejemplo.com']
    ];
    const ws = XLSX.utils.aoa_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Instituciones');
    XLSX.writeFile(wb, 'plantilla_instituciones.xlsx');
  });
 }
}