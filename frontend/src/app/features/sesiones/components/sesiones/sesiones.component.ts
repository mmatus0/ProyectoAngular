import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { SesionesListComponent } from '../sesiones-list/sesiones-list.component';
import { MisSesionesComponent } from '../mis-sesiones/mis-sesiones.component';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, SesionesListComponent, MisSesionesComponent],
  template: `
    @if (auth.esCliente()) {
      <app-mis-sesiones />
    } @else {
      <app-sesiones-list />
    }
  `
})
export class SesionesComponent {
  auth = inject(AuthService);
}