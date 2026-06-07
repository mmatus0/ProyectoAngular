import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface IEvaluacion {
  id: number;
  nombre: string;
  foto: string;
}

interface IUsuario {
  id: number;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-evaluacion-asignar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluacion-asignar.component.html'
})
export class EvaluacionAsignarComponent implements OnInit {

  private http   = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000/api/evaluaciones';

  usuarios           = signal<IUsuario[]>([]);
  disponibles        = signal<IEvaluacion[]>([]);
  asignadas          = signal<IEvaluacion[]>([]);
  todasEvaluaciones  = signal<IEvaluacion[]>([]);

  usuarioSeleccionado = signal<number | null>(null);
  loadingUsuario      = signal<boolean>(false);
  guardando           = signal<boolean>(false);
  mostrarListas       = signal<boolean>(false);
  toast               = signal<{ mensaje: string; tipo: string } | null>(null);

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/form-data`, this.headers()).subscribe({
      next: (resp) => {
        this.usuarios.set(resp.usuarios);
        this.todasEvaluaciones.set(resp.evaluaciones);
        this.disponibles.set(resp.evaluaciones);
      }
    });
  }

  onUsuarioChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    if (!id) {
      this.mostrarListas.set(false);
      this.usuarioSeleccionado.set(null);
      return;
    }

    this.usuarioSeleccionado.set(id);
    this.loadingUsuario.set(true);
    this.mostrarListas.set(false);

    this.http.get<any>(`${this.apiUrl}/asignadas/${id}`, this.headers()).subscribe({
      next: (resp) => {
        const asignadasIds: number[] = resp.data;
        const todas = this.todasEvaluaciones();

        this.asignadas.set(todas.filter(e => asignadasIds.includes(e.id)));
        this.disponibles.set(todas.filter(e => !asignadasIds.includes(e.id)));
        this.loadingUsuario.set(false);
        this.mostrarListas.set(true);
      },
      error: () => this.loadingUsuario.set(false)
    });
  }

  asignar(e: IEvaluacion) {
    this.disponibles.update(l => l.filter(x => x.id !== e.id));
    this.asignadas.update(l => [...l, e]);
  }

  desasignar(e: IEvaluacion) {
    this.asignadas.update(l => l.filter(x => x.id !== e.id));
    this.disponibles.update(l => [...l, e]);
  }

  asignarTodas() {
    this.asignadas.update(l => [...l, ...this.disponibles()]);
    this.disponibles.set([]);
  }

  desasignarTodas() {
    this.disponibles.update(l => [...l, ...this.asignadas()]);
    this.asignadas.set([]);
  }

  guardar() {
    if (!this.usuarioSeleccionado()) return;
    this.guardando.set(true);

    const body = {
      usuario_id:   this.usuarioSeleccionado()!,
      evaluaciones: this.asignadas().map(e => e.id),
      intentos:     1,
      ver_resultados: 0
    };

    this.http.post<any>(`${this.apiUrl}/asignar-lote`, body, this.headers()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarToast('Asignaciones guardadas correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/evaluaciones']), 1500);
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar asignaciones.', 'danger');
      }
    });
  }

  volver() { this.router.navigate(['/evaluaciones']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}