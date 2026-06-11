import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';
import { HighlightRowDirective } from '../../../../shared/directives/highlight-row.directive';
import { Router } from '@angular/router';

interface IEvaluacion {
  id: number;
  usuario_id: number;
  usuario: string;
  email: string;
  evaluacion_id: number;
  evaluacion: string;
  foto: string;
  intentos: number;
  ver_resultados: number;
  fecha: string;
  inicio: string;
  finalizacion: string;
  estado_id: number;
  estado: string;
}

@Component({
  selector: 'app-evaluaciones-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HighlightRowDirective],
  templateUrl: './evaluaciones-list.component.html'
})
export class EvaluacionesListComponent implements OnInit {

  private evaluacionService = inject(EvaluacionService);
  private fb                = inject(FormBuilder);
  private router = inject(Router);

  evaluacionesActivas     = signal<IEvaluacion[]>([]);
  evaluacionesFinalizadas = signal<IEvaluacion[]>([]);
  evaluacionesInactivas   = signal<IEvaluacion[]>([]);
  usuarios                = signal<any[]>([]);
  evaluaciones            = signal<any[]>([]);

  loading   = signal<boolean>(true);
  tabActiva = signal<number>(1);
  busqueda  = signal<string>('');
  toast     = signal<{ mensaje: string; tipo: string } | null>(null);
  guardando = signal<boolean>(false);

  modalAsignar    = signal<boolean>(false);
  modalEditar     = signal<boolean>(false);
  modalDesactivar = signal<boolean>(false);
  modalActivar    = signal<boolean>(false);
  seleccionada    = signal<IEvaluacion | null>(null);

  formAsignar = this.fb.group({
    usuario_id:    ['', Validators.required],
    evaluacion_id: ['', Validators.required],
    intentos:      [1, [Validators.required, Validators.min(1)]],
    ver_resultados:[0]
  });

  formEditar = this.fb.group({
    intentos:      [1, [Validators.required, Validators.min(1)]],
    ver_resultados:[0]
  });

  evaluacionesFiltradas = computed(() => {
    const b = this.busqueda().toLowerCase();
    const lista = this.tabActiva() === 1 ? this.evaluacionesActivas()
                : this.tabActiva() === 4 ? this.evaluacionesFinalizadas()
                : this.evaluacionesInactivas();
    if (!b) return lista;
    return lista.filter(e =>
      e.usuario?.toLowerCase().includes(b) ||
      e.evaluacion?.toLowerCase().includes(b) ||
      e.email?.toLowerCase().includes(b)
    );
  });

  ngOnInit() {
    this.cargarTodo();
    this.evaluacionService.getFormData().subscribe({
      next: (resp) => {
        this.usuarios.set(resp.usuarios);
        this.evaluaciones.set(resp.evaluaciones);
      }
    });
  }

  cargarTodo() {
    this.loading.set(true);
    let cargadas = 0;
    const check = () => { if (++cargadas === 3) this.loading.set(false); };

    this.evaluacionService.getEvaluaciones(1).subscribe({ next: r => { this.evaluacionesActivas.set(r.data); check(); }, error: check });
    this.evaluacionService.getEvaluaciones(4).subscribe({ next: r => { this.evaluacionesFinalizadas.set(r.data); check(); }, error: check });
    this.evaluacionService.getEvaluaciones(2).subscribe({ next: r => { this.evaluacionesInactivas.set(r.data); check(); }, error: check });
  }

  cambiarTab(tab: number) { this.tabActiva.set(tab); this.busqueda.set(''); }
  setBusqueda(v: string) { this.busqueda.set(v); }

  abrirModalAsignar() { this.formAsignar.reset({ intentos: 1, ver_resultados: 0 }); this.modalAsignar.set(true); }

  abrirModalEditar(e: IEvaluacion) {
    this.seleccionada.set(e);
    this.formEditar.patchValue({ intentos: e.intentos, ver_resultados: e.ver_resultados });
    this.modalEditar.set(true);
  }

  abrirModalDesactivar(e: IEvaluacion) { this.seleccionada.set(e); this.modalDesactivar.set(true); }
  abrirModalActivar(e: IEvaluacion)    { this.seleccionada.set(e); this.modalActivar.set(true); }

  cerrarModales() {
    this.modalAsignar.set(false);
    this.modalEditar.set(false);
    this.modalDesactivar.set(false);
    this.modalActivar.set(false);
    this.seleccionada.set(null);
  }

  guardarAsignar() {
    if (this.formAsignar.invalid) return;
    this.guardando.set(true);
    this.evaluacionService.asignar(this.formAsignar.value).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.guardando.set(false); this.mostrarToast('Evaluación asignada correctamente.', 'success'); },
      error: (err) => { this.guardando.set(false); this.mostrarToast(err.error?.mensaje || 'Error al asignar.', 'danger'); }
    });
  }

  guardarEditar() {
    if (this.formEditar.invalid) return;
    this.guardando.set(true);
    this.evaluacionService.actualizar(this.seleccionada()!.id, this.formEditar.value).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.guardando.set(false); this.mostrarToast('Evaluación actualizada correctamente.', 'success'); },
      error: () => { this.guardando.set(false); this.mostrarToast('Error al actualizar.', 'danger'); }
    });
  }

  confirmarDesactivar() {
    this.evaluacionService.desactivar(this.seleccionada()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.mostrarToast('Evaluación desactivada.', 'warning'); }
    });
  }

  confirmarActivar() {
    this.evaluacionService.activar(this.seleccionada()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.mostrarToast('Evaluación activada.', 'success'); }
    });
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3500);
  }

  irAAsignar() {
    this.router.navigate(['/evaluaciones/asignar']);
  }
}