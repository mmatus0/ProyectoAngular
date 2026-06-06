import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SesionService } from '../../../../core/services/sesion.service';

interface ISesion {
  id: number;
  nombre_sesion: string;
  fecha_sesion: string;
  lugar: string;
  duracion: number;
  segundos: number;
  estado_id: number;
  estado: string;
  cliente: string;
  usuario_id: number;
}

@Component({
  selector: 'app-sesiones-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sesiones-list.component.html'
})
export class SesionesListComponent implements OnInit {

  private sesionService = inject(SesionService);
  private fb            = inject(FormBuilder);

  sesionesActivas     = signal<ISesion[]>([]);
  sesionesFinalizadas = signal<ISesion[]>([]);
  sesionesInactivas   = signal<ISesion[]>([]);
  usuarios            = signal<any[]>([]);

  loading       = signal<boolean>(true);
  tabActiva     = signal<number>(1);
  busqueda      = signal<string>('');
  toast         = signal<{ mensaje: string; tipo: string } | null>(null);

  modalCrear    = signal<boolean>(false);
  modalEditar   = signal<boolean>(false);
  modalEliminar = signal<boolean>(false);
  modalActivar  = signal<boolean>(false);
  modalFinalizar = signal<boolean>(false);
  sesionSeleccionada = signal<ISesion | null>(null);
  guardando     = signal<boolean>(false);

  form = this.fb.group({
    nombre_sesion: ['', Validators.required],
    fecha_sesion:  [''],
    lugar:         [''],
    usuario_id:    ['', Validators.required]
  });

  sesionesFiltradas = computed(() => {
    const b = this.busqueda().toLowerCase();
    const lista = this.tabActiva() === 1 ? this.sesionesActivas()
                : this.tabActiva() === 4 ? this.sesionesFinalizadas()
                : this.sesionesInactivas();
    if (!b) return lista;
    return lista.filter(s =>
      s.nombre_sesion?.toLowerCase().includes(b) ||
      s.cliente?.toLowerCase().includes(b) ||
      s.lugar?.toLowerCase().includes(b)
    );
  });

  ngOnInit() {
    this.cargarTodo();
    this.sesionService.getFormData().subscribe({
      next: (resp) => this.usuarios.set(resp.usuarios)
    });
  }

  cargarTodo() {
    this.loading.set(true);
    let cargadas = 0;
    const check = () => { if (++cargadas === 3) this.loading.set(false); };

    this.sesionService.getSesiones(1).subscribe({ next: r => { this.sesionesActivas.set(r.data); check(); }, error: check });
    this.sesionService.getSesiones(4).subscribe({ next: r => { this.sesionesFinalizadas.set(r.data); check(); }, error: check });
    this.sesionService.getSesiones(2).subscribe({ next: r => { this.sesionesInactivas.set(r.data); check(); }, error: check });
  }

  cambiarTab(tab: number) {
    this.tabActiva.set(tab);
    this.busqueda.set('');
  }

  setBusqueda(v: string) { this.busqueda.set(v); }

  formatDuracion(duracion: number, segundos: number): string {
    const mm = String(duracion ?? 0).padStart(2, '0');
    const ss = String(segundos ?? 0).padStart(2, '0');
    return `${mm}:${ss} min`;
  }

  abrirModalCrear() {
    this.form.reset();
    this.sesionSeleccionada.set(null);
    this.modalCrear.set(true);
  }

  abrirModalEditar(s: ISesion) {
    this.sesionSeleccionada.set(s);
    this.form.patchValue({
      nombre_sesion: s.nombre_sesion,
      fecha_sesion:  s.fecha_sesion,
      lugar:         s.lugar,
      usuario_id:    s.usuario_id?.toString()
    });
    this.modalEditar.set(true);
  }

  abrirModalEliminar(s: ISesion) {
    this.sesionSeleccionada.set(s);
    this.modalEliminar.set(true);
  }

  abrirModalActivar(s: ISesion) {
    this.sesionSeleccionada.set(s);
    this.modalActivar.set(true);
  }

  abrirModalFinalizar(s: ISesion) {
    this.sesionSeleccionada.set(s);
    this.modalFinalizar.set(true);
  }

  cerrarModales() {
    this.modalCrear.set(false);
    this.modalEditar.set(false);
    this.modalEliminar.set(false);
    this.modalActivar.set(false);
    this.modalFinalizar.set(false);
    this.sesionSeleccionada.set(null);
  }

  guardarCrear() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.sesionService.crear(this.form.value).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.guardando.set(false);
        this.mostrarToast('Sesión creada correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al crear la sesión.', 'danger');
      }
    });
  }

  guardarEditar() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.sesionService.actualizar(this.sesionSeleccionada()!.id, this.form.value).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.guardando.set(false);
        this.mostrarToast('Sesión actualizada correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al actualizar la sesión.', 'danger');
      }
    });
  }

  confirmarEliminar() {
    this.sesionService.desactivar(this.sesionSeleccionada()!.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.mostrarToast('Sesión desactivada correctamente.', 'warning');
      }
    });
  }

  confirmarActivar() {
    this.sesionService.activar(this.sesionSeleccionada()!.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.mostrarToast('Sesión activada correctamente.', 'success');
      }
    });
  }

  confirmarFinalizar() {
    this.sesionService.finalizar(this.sesionSeleccionada()!.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.mostrarToast('Sesión finalizada correctamente.', 'success');
      }
    });
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}