import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionService } from '../../../../core/services/sesion.service';

@Component({
  selector: 'app-sesion-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sesion-detalle.component.html'
})
export class SesionDetalleComponent implements OnInit, OnDestroy {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  private sesionService = inject(SesionService);

  private intervalId: any = null;

  sesion        = signal<any>(null);
  tipos         = signal<any[]>([]);
  actividades   = signal<{ [key: number]: string }>({});
  loading       = signal<boolean>(true);
  guardando     = signal<boolean>(false);
  toast         = signal<{ mensaje: string; tipo: string } | null>(null);
  modalFinalizar = signal<boolean>(false);
  tabActiva     = signal<number>(0);

  // Cronómetro
  totalSegundos = signal<number>(0);
  corriendo     = signal<boolean>(false);
  bloqueado     = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sesionService.getDetalle(Number(id)).subscribe({
      next: (resp) => {
        this.sesion.set(resp.sesion);
        this.tipos.set(resp.tipos);
        this.actividades.set(resp.actividades || {});
        if (resp.tipos.length > 0) this.tabActiva.set(resp.tipos[0].id);

        // Si ya tiene tiempo registrado, bloquear cronómetro
        const minutos  = resp.sesion.duracion  || 0;
        const segundos = resp.sesion.segundos   || 0;
        const total    = minutos * 60 + segundos;
        if (total > 0) {
          this.totalSegundos.set(total);
          this.bloqueado.set(true);
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ngOnDestroy() {
    this.detenerCronometro();
  }

  // ── Cronómetro ────────────────────────────────────────────────────────────
  toggleCronometro() {
    if (this.bloqueado()) return;
    this.corriendo() ? this.detenerCronometro() : this.iniciarCronometro();
  }

  iniciarCronometro() {
    if (this.intervalId) return;
    this.corriendo.set(true);
    this.intervalId = setInterval(() => {
      this.totalSegundos.update(s => s + 1);
    }, 1000);
  }

  detenerCronometro() {
    this.corriendo.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  formatTiempo(total: number): string {
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // ── Tabs catastro ─────────────────────────────────────────────────────────
  setTab(id: number) { this.tabActiva.set(id); }

  getActividad(tipoId: number): string {
    return this.actividades()[tipoId] || '';
  }

  setActividad(tipoId: number, valor: string) {
    this.actividades.update(acts => ({ ...acts, [tipoId]: valor }));
  }

  formatLabel(tipo: string): string {
    return tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // ── Guardar cambios ───────────────────────────────────────────────────────
  guardarCambios() {
    this.guardando.set(true);
    const total    = this.totalSegundos();
    const duracion = Math.floor(total / 60);
    const segundos = total % 60;

    const body = {
      actividades: this.actividades(),
      duracion,
      segundos
    };

    const id = this.sesion().id;
    this.sesionService.actualizarDetalle(id, body).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarToast('Cambios guardados correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar cambios.', 'danger');
      }
    });
  }

  // ── Finalizar sesión ──────────────────────────────────────────────────────
  abrirModalFinalizar() { this.modalFinalizar.set(true); }
  cerrarModalFinalizar() { this.modalFinalizar.set(false); }

  confirmarFinalizar() {
    this.detenerCronometro();
    const total    = this.totalSegundos();
    const duracion = Math.floor(total / 60);
    const segundos = total % 60;

    const body = {
      actividades: this.actividades(),
      duracion,
      segundos
    };

    const id = this.sesion().id;
    this.sesionService.finalizarDetalle(id, body).subscribe({
      next: () => {
        this.cerrarModalFinalizar();
        this.mostrarToast('Sesión finalizada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/sesiones']), 1500);
      },
      error: () => {
        this.mostrarToast('Error al finalizar la sesión.', 'danger');
      }
    });
  }

  volver() { this.router.navigate(['/sesiones']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}