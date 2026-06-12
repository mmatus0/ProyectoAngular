import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InstitucionService {

  private http   = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/instituciones`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(estadoId: number) {
    return this.http.get<any>(`${this.apiUrl}?estado=${estadoId}`, { headers: this.getAuthHeaders() });
  }

  create(data: any) {
    return this.http.post<any>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  desactivar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/desactivar`, {}, { headers: this.getAuthHeaders() });
  }

  activar(id: number) {
    return this.http.post<any>(`${this.apiUrl}/${id}/activar`, {}, { headers: this.getAuthHeaders() });
  }

  cargaMasiva(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<any>(`${this.apiUrl}/carga-masiva`, formData, { headers: this.getAuthHeaders() });
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