import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

interface Metricas {
  clientes_total:          number;
  clientes_por_asesorar:   number;
  clientes_asesorados:     number;
  evaluaciones_pendientes: number;
  evaluaciones_finalizadas: number;
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
  metricas = signal<Metricas | null>(null);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/dashboard`, { headers: this.getAuthHeaders() }).subscribe({
      next: r  => { this.metricas.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}