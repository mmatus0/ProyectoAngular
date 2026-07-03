import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../../../core/services/dashboard.service';

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
  private dashboardService = inject(DashboardService);

  user     = this.authService.usuario;
  loading  = signal<boolean>(true);

  esCliente  = computed(() => this.authService.esCliente());

  metricasAdmin   = signal<MetricasAdmin | null>(null);
  metricasCliente = signal<MetricasCliente | null>(null);

  ngOnInit() {
    if (this.esCliente()) {
      this.dashboardService.getMetricasCliente().subscribe({
        next: r  => { this.metricasCliente.set(r.data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.dashboardService.getMetricasAdmin().subscribe({
        next: r  => { this.metricasAdmin.set(r.data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }
}