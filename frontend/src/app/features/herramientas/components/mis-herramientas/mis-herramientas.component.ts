import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HerramientaService } from '../../../../core/services/herramienta.service';

interface IMiHerramienta {
  id: number;
  herramienta_id: number;
  herramienta: string;
  descripcion: string;
  foto: string;
  fecha: string;
}

@Component({
  selector: 'app-mis-herramientas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-herramientas.component.html'
})
export class MisHerramientasComponent implements OnInit {

  private herramientaService = inject(HerramientaService);
  private router = inject(Router);

  herramientas = signal<IMiHerramienta[]>([]);
  loading      = signal<boolean>(true);

  ngOnInit() {
    this.herramientaService.getMisHerramientas().subscribe({
      next: (resp) => {
        this.herramientas.set(resp.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  irADetalle(id: number) {
      this.router.navigate(['/herramientas', id, 'detalle']);
  }
}