import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PerfilService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl       = `${environment.apiUrl}/perfil`;

  getPerfil() {
    return this.http.get<any>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  actualizar(data: any) {
    return this.http.put<any>(this.apiUrl, data, { headers: this.authService.getAuthHeaders() });
  }
}