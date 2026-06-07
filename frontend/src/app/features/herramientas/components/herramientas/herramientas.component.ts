import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { HerramientasListComponent } from '../herramientas-list/herramientas-list.component';
import { MisHerramientasComponent } from '../mis-herramientas/mis-herramientas.component';

@Component({
  selector: 'app-herramientas',
  standalone: true,
  imports: [CommonModule, HerramientasListComponent, MisHerramientasComponent],
  template: `
    @if (auth.esCliente()) {
      <app-mis-herramientas />
    } @else {
      <app-herramientas-list />
    }
  `
})
export class HerramientasComponent {
  auth = inject(AuthService);
}