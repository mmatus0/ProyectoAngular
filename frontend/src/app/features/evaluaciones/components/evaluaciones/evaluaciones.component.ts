import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { EvaluacionesListComponent } from '../evaluaciones-list/evaluaciones-list.component';
import { MisEvaluacionesComponent } from '../../../mis-evaluaciones/components/mis-evaluaciones/mis-evaluaciones.component';

@Component({
  selector: 'app-evaluaciones',
  standalone: true,
  imports: [CommonModule, EvaluacionesListComponent, MisEvaluacionesComponent],
  template: `
    @if (auth.esCliente()) {
      <app-mis-evaluaciones />
    } @else {
      <app-evaluaciones-list />
    }
  `
})
export class EvaluacionesComponent {
  auth = inject(AuthService);
}