import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl       = environment.apiUrl;

  getMetricasAdmin() {
    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers: this.authService.getAuthHeaders() });
  }

  getMetricasCliente() {
    return this.http.get<any>(`${this.apiUrl}/dashboard/cliente`, { headers: this.authService.getAuthHeaders() });
  }
}