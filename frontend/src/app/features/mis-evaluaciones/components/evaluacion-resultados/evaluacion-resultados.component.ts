import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-evaluacion-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluacion-resultados.component.html'
})
export class EvaluacionResultadosComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private http   = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/mis-evaluaciones';

  data        = signal<any>(null);
  resultados  = signal<any[]>([]);
  loading     = signal<boolean>(true);

  // Para liderazgo situacional (ID 1)
  esLiderazgo = computed(() => this.data()?.evaluacion_id === 1);

  // Para tests globales (IDs 2, 5)
  esGlobal = computed(() => [2, 5].includes(this.data()?.evaluacion_id));

  // Para tests por dimensiones (IDs 3, 4, 6, 7, 9)
  esDimensiones = computed(() => [3, 4, 6, 7, 9].includes(this.data()?.evaluacion_id));

  esGestionTiempo = computed(() => this.data()?.evaluacion_id === 8);

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`${this.apiUrl}/${id}/resultados`, this.headers()).subscribe({
      next: (resp) => {
        this.data.set(resp.data);
        this.resultados.set(resp.data.resultadosJson?.Resultados || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Para liderazgo: obtener los 4 cuadrantes
  getCuadrantes() {
    return this.resultados().filter(r =>
      ['ATBR', 'ATAR', 'BTAR', 'BTBR'].includes(r.dimension)
    );
  }

  // Para liderazgo: obtener nivel de efectividad
  getNivelEfectividad() {
    return this.resultados().find(r => r.dimension === 'Nivel de Efectividad');
  }

  // Para liderazgo: calcular ancho de barra
  getBarWidth(porcentaje: number): number {
    const max = Math.max(...this.getCuadrantes().map(c => c.Porcentaje || 0));
    return max > 0 ? Math.round((porcentaje / max) * 100) : 0;
  }

  // Color según índice
  colorPorIndice(i: number): string {
    const colores = ['primary', 'success', 'warning', 'danger', 'info'];
    return colores[i % colores.length];
  }

  volver() { this.router.navigate(['/mis-evaluaciones']); }
}