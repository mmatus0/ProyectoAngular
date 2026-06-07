import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private http   = inject(HttpClient);
  private router = inject(Router);

  sesiones = signal<IMiSesion[]>([]);
  loading  = signal<boolean>(true);

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/mis-sesiones', this.headers()).subscribe({
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