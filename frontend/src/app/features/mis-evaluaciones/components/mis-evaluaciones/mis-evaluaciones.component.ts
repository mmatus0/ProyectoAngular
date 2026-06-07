import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';

interface IMiEvaluacion {
  id: number;
  evaluacion_id: number;
  nombre: string;
  descripcion: string;
  foto: string;
  instrucciones: string;
  intentos: number;
  ver_resultados: number;
  estado_id: number;
  fecha: string;
  inicio: string;
  finalizacion: string;
}

@Component({
  selector: 'app-mis-evaluaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-evaluaciones.component.html'
})
export class MisEvaluacionesComponent implements OnInit {

  private evaluacionService = inject(EvaluacionService);
  private router            = inject(Router);

  evaluaciones = signal<IMiEvaluacion[]>([]);
  loading      = signal<boolean>(true);

  ngOnInit() {
    this.evaluacionService.getMisEvaluaciones().subscribe({
      next: (resp) => {
        this.evaluaciones.set(resp.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  comenzarTest(id: number) {
    this.router.navigate(['/mis-evaluaciones', id, 'test']);
  }

  verResultados(id: number) {
    this.router.navigate(['/mis-evaluaciones', id, 'resultados']);
  }

  getBadge(estadoId: number): { texto: string; clase: string } {
    switch (estadoId) {
      case 4:  return { texto: 'Finalizado',  clase: 'bg-success-subtle text-success' };
      case 3:  return { texto: 'En Proceso',  clase: 'bg-warning-subtle text-warning' };
      default: return { texto: 'Pendiente',   clase: 'bg-warning-subtle text-warning' };
    }
  }
}
