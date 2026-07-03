import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';

interface IMiSesion {
  id: number;
  nombre_sesion: string;
  fecha_sesion: string;
  lugar: string;
  duracion: number;
  segundos: number;
  estado_id: number;
  estado: string;
}

@Component({
  selector: 'app-mis-sesiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-sesiones.component.html'
})
export class MisSesionesComponent implements OnInit {

  private router = inject(Router);
  private sesionService = inject(SesionService);

  sesiones = signal<IMiSesion[]>([]);
  loading  = signal<boolean>(true);

  ngOnInit() {
    this.sesionService.getMisSesiones().subscribe({
      next: (resp) => {
        this.sesiones.set(resp.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  verSesion(id: number) {
    this.router.navigate(['/sesiones', id, 'vista']);
  }
}