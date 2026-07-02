import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

interface MetricasAdmin {
  clientes_total:           number;
  clientes_por_asesorar:    number;
  clientes_asesorados:      number;
  evaluaciones_pendientes:  number;
  evaluaciones_finalizadas: number;
}

interface MetricasCliente {
  evaluaciones_pendientes:  number;
  evaluaciones_finalizadas: number;
  herramientas_asignadas:   number;
  sesiones_activas:         number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  authService = inject(AuthService);
  private http = inject(HttpClient);

  user     = this.authService.usuario;
  loading  = signal<boolean>(true);

  esCliente  = computed(() => this.authService.esCliente());

  metricasAdmin   = signal<MetricasAdmin | null>(null);
  metricasCliente = signal<MetricasCliente | null>(null);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  ngOnInit() {
    if (this.esCliente()) {
      this.http.get<any>(`${environment.apiUrl}/dashboard/cliente`, { headers: this.getAuthHeaders() }).subscribe({
        next: r  => { this.metricasCliente.set(r.data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.http.get<any>(`${environment.apiUrl}/dashboard`, { headers: this.getAuthHeaders() }).subscribe({
        next: r  => { this.metricasAdmin.set(r.data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }
}