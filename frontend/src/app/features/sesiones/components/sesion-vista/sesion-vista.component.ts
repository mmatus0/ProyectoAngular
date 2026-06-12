import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sesion-vista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sesion-vista.component.html'
})
export class SesionVistaComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private http   = inject(HttpClient);

  sesion   = signal<any>(null);
  tipos    = signal<any[]>([]);
  actividades = signal<{ [key: number]: string }>({});
  loading  = signal<boolean>(true);
  tabActiva = signal<number>(0);

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`${environment.apiUrl}/sesiones/${id}/detalle`, this.headers()).subscribe({
      next: (resp) => {
        this.sesion.set(resp.sesion);
        this.tipos.set(resp.tipos);
        this.actividades.set(resp.actividades || {});
        if (resp.tipos.length > 0) this.tabActiva.set(resp.tipos[0].id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setTab(id: number) { this.tabActiva.set(id); }

  getActividad(tipoId: number): string {
    return this.actividades()[tipoId] || 'Sin información registrada.';
  }

  formatLabel(tipo: string): string {
    return tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatTiempo(duracion: number, segundos: number): string {
    const mm = String(duracion ?? 0).padStart(2, '0');
    const ss = String(segundos ?? 0).padStart(2, '0');
    return `${mm}:${ss} min`;
  }

  volver() { this.router.navigate(['/sesiones']); }
}