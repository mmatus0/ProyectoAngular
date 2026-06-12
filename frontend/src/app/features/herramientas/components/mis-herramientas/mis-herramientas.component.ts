import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

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

  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/mis-herramientas`;
  private router = inject(Router);


  herramientas = signal<IMiHerramienta[]>([]);
  loading      = signal<boolean>(true);

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.http.get<any>(this.url, this.headers()).subscribe({
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