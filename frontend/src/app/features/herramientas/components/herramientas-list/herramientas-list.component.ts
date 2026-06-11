import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HighlightRowDirective } from '../../../../shared/directives/highlight-row.directive';
import { HerramientaService } from '../../../../core/services/herramienta.service';

interface IAsignacion {
  id: number;
  usuario_id: number;
  usuario: string;
  email: string;
  herramienta_id: number;
  herramienta: string;
  foto: string;
  fecha: string;
  estado_id: number;
  estado: string;
}

@Component({
  selector: 'app-herramientas-list',
  standalone: true,
  imports: [CommonModule, HighlightRowDirective],
  templateUrl: './herramientas-list.component.html'
})
export class HerramientasListComponent implements OnInit {

  private herramientaService = inject(HerramientaService);
  private router             = inject(Router);

  asignacionesActivas   = signal<IAsignacion[]>([]);
  asignacionesInactivas = signal<IAsignacion[]>([]);

  loading   = signal<boolean>(true);
  tabActiva = signal<number>(1);
  busqueda  = signal<string>('');
  toast     = signal<{ mensaje: string; tipo: string } | null>(null);

  modalDesactivar = signal<boolean>(false);
  modalActivar    = signal<boolean>(false);
  seleccionada    = signal<IAsignacion | null>(null);

  asignacionesFiltradas = computed(() => {
    const b    = this.busqueda().toLowerCase();
    const lista = this.tabActiva() === 1
      ? this.asignacionesActivas()
      : this.asignacionesInactivas();
    if (!b) return lista;
    return lista.filter(a =>
      a.usuario?.toLowerCase().includes(b) ||
      a.herramienta?.toLowerCase().includes(b) ||
      a.email?.toLowerCase().includes(b)
    );
  });

  ngOnInit() { this.cargarTodo(); }

  cargarTodo() {
    this.loading.set(true);
    let cargadas = 0;
    const check = () => { if (++cargadas === 2) this.loading.set(false); };

    this.herramientaService.getAsignaciones(1).subscribe({
      next: r => { this.asignacionesActivas.set(r.data); check(); },
      error: check
    });
    this.herramientaService.getAsignaciones(2).subscribe({
      next: r => { this.asignacionesInactivas.set(r.data); check(); },
      error: check
    });
  }

  cambiarTab(tab: number) {
    this.tabActiva.set(tab);
    this.busqueda.set('');
  }

  setBusqueda(v: string) { this.busqueda.set(v); }

  irAAsignar() { this.router.navigate(['/herramientas/asignar']); }

  abrirModalDesactivar(a: IAsignacion) {
    this.seleccionada.set(a);
    this.modalDesactivar.set(true);
  }

  abrirModalActivar(a: IAsignacion) {
    this.seleccionada.set(a);
    this.modalActivar.set(true);
  }

  cerrarModales() {
    this.modalDesactivar.set(false);
    this.modalActivar.set(false);
    this.seleccionada.set(null);
  }

  confirmarDesactivar() {
    this.herramientaService.desactivar(this.seleccionada()!.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.mostrarToast('Asignación desactivada correctamente.', 'warning');
      }
    });
  }

  confirmarActivar() {
    this.herramientaService.activar(this.seleccionada()!.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarTodo();
        this.mostrarToast('Asignación activada correctamente.', 'success');
      }
    });
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}