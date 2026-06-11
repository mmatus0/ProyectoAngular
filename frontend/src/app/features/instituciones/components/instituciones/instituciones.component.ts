import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InstitucionService } from '../../../../core/services/institucion.service';

interface IInstitucion {
  id: number;
  empresa: string;
  razonsocial: string;
  numero_identificacion_fiscal: string;
  direccion: string;
  telefonos: string;
  pagina_web: string;
  estado_id: number;
  estado: string;
}

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instituciones.component.html'
})
export class InstitucionesComponent implements OnInit {

  private institucionService = inject(InstitucionService);
  private fb                 = inject(FormBuilder);

  activas   = signal<IInstitucion[]>([]);
  inactivas = signal<IInstitucion[]>([]);

  loading   = signal<boolean>(true);
  tabActiva = signal<number>(1);
  busqueda  = signal<string>('');
  guardando = signal<boolean>(false);
  toast     = signal<{ mensaje: string; tipo: string } | null>(null);

  modalCrear      = signal<boolean>(false);
  modalEditar     = signal<boolean>(false);
  modalDesactivar = signal<boolean>(false);
  modalActivar    = signal<boolean>(false);
  seleccionada    = signal<IInstitucion | null>(null);

  modalCarga    = signal<boolean>(false);
  archivoCarga  = signal<File | null>(null);
  cargando      = signal<boolean>(false);
  resultadoCarga = signal<{ created: number; updated: number; skipped: number } | null>(null);

  institucionesFiltradas = computed(() => {
    const b     = this.busqueda().toLowerCase();
    const lista = this.tabActiva() === 1 ? this.activas() : this.inactivas();
    if (!b) return lista;
    return lista.filter(i =>
      i.empresa?.toLowerCase().includes(b) ||
      i.razonsocial?.toLowerCase().includes(b) ||
      i.numero_identificacion_fiscal?.toLowerCase().includes(b) ||
      i.telefonos?.toLowerCase().includes(b)
    );
  });

  form = this.fb.group({
    empresa:                      ['', [Validators.required, Validators.minLength(3)]],
    razonsocial:                  [''],
    numero_identificacion_fiscal: [''],
    direccion:                    [''],
    telefonos:                    [''],
    pagina_web:                   ['']
  });

  ngOnInit() { this.cargarTodo(); }

  cargarTodo() {
    this.loading.set(true);
    let cargadas = 0;
    const check = () => { if (++cargadas === 2) this.loading.set(false); };

    this.institucionService.getAll(1).subscribe({
      next: r => { this.activas.set(r.data);   check(); },
      error: check
    });
    this.institucionService.getAll(2).subscribe({
      next: r => { this.inactivas.set(r.data); check(); },
      error: check
    });
  }

  cambiarTab(tab: number) { this.tabActiva.set(tab); this.busqueda.set(''); }
  setBusqueda(v: string)  { this.busqueda.set(v); }

  abrirModalCrear() {
    this.form.reset();
    this.modalCrear.set(true);
  }

  abrirModalEditar(i: IInstitucion) {
    this.seleccionada.set(i);
    this.form.patchValue(i);
    this.modalEditar.set(true);
  }

  abrirModalDesactivar(i: IInstitucion) { this.seleccionada.set(i); this.modalDesactivar.set(true); }
  abrirModalActivar(i: IInstitucion)    { this.seleccionada.set(i); this.modalActivar.set(true); }

  cerrarModales() {
    this.modalCrear.set(false);
    this.modalEditar.set(false);
    this.modalDesactivar.set(false);
    this.modalActivar.set(false);
    this.seleccionada.set(null);
  }

  guardarCrear() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    this.institucionService.create(this.form.value).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.guardando.set(false); this.mostrarToast('Institución creada correctamente.', 'success'); },
      error: () => { this.guardando.set(false); this.mostrarToast('Error al crear la institución.', 'danger'); }
    });
  }

  guardarEditar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    this.institucionService.update(this.seleccionada()!.id, this.form.value).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.guardando.set(false); this.mostrarToast('Institución actualizada correctamente.', 'success'); },
      error: () => { this.guardando.set(false); this.mostrarToast('Error al actualizar.', 'danger'); }
    });
  }

  confirmarDesactivar() {
    this.institucionService.desactivar(this.seleccionada()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.mostrarToast('Institución desactivada.', 'warning'); }
    });
  }

  confirmarActivar() {
    this.institucionService.activar(this.seleccionada()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarTodo(); this.mostrarToast('Institución activada.', 'success'); }
    });
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3500);
  }

  abrirModalCarga() {
  this.archivoCarga.set(null);
  this.resultadoCarga.set(null);
  this.modalCarga.set(true);
}

onArchivoSeleccionado(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) this.archivoCarga.set(input.files[0]);
}

iniciarCarga() {
  if (!this.archivoCarga()) return;
  this.cargando.set(true);
  this.institucionService.cargaMasiva(this.archivoCarga()!).subscribe({
    next: (r) => {
      this.cargando.set(false);
      this.resultadoCarga.set({ created: r.created, updated: r.updated, skipped: r.skipped });
      this.cargarTodo();
    },
    error: () => {
      this.cargando.set(false);
      this.mostrarToast('Error al procesar el archivo.', 'danger');
    }
  });
}

descargarPlantilla() {
  this.institucionService.descargarPlantilla();
}
}