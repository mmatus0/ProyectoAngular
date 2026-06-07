import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HerramientaService } from '../../../../core/services/herramienta.service';

interface IHerramienta {
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
  selector: 'app-herramienta-asignar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herramienta-asignar.component.html'
})
export class HerramientaAsignarComponent implements OnInit {

  private herramientaService = inject(HerramientaService);
  private router             = inject(Router);

  usuarios          = signal<IUsuario[]>([]);
  disponibles       = signal<IHerramienta[]>([]);
  asignadas         = signal<IHerramienta[]>([]);
  todasHerramientas = signal<IHerramienta[]>([]);

  usuarioSeleccionado = signal<number | null>(null);
  loading             = signal<boolean>(false);
  loadingUsuario      = signal<boolean>(false);
  guardando           = signal<boolean>(false);
  toast               = signal<{ mensaje: string; tipo: string } | null>(null);
  mostrarListas       = signal<boolean>(false);

  ngOnInit() {
    this.herramientaService.getFormData().subscribe({
      next: (resp) => {
        this.usuarios.set(resp.usuarios);
        this.todasHerramientas.set(resp.herramientas);
        this.disponibles.set(resp.herramientas);
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

    this.herramientaService.getAsignadasPorUsuario(id).subscribe({
      next: (resp) => {
        const asignadasIds: number[] = resp.data;
        const todas = this.todasHerramientas();

        const asignadas   = todas.filter(h => asignadasIds.includes(h.id));
        const disponibles = todas.filter(h => !asignadasIds.includes(h.id));

        this.asignadas.set(asignadas);
        this.disponibles.set(disponibles);
        this.loadingUsuario.set(false);
        this.mostrarListas.set(true);
      },
      error: () => this.loadingUsuario.set(false)
    });
  }

  asignar(h: IHerramienta) {
    this.disponibles.update(lista => lista.filter(x => x.id !== h.id));
    this.asignadas.update(lista => [...lista, h]);
  }

  desasignar(h: IHerramienta) {
    this.asignadas.update(lista => lista.filter(x => x.id !== h.id));
    this.disponibles.update(lista => [...lista, h]);
  }

  asignarTodas() {
    this.asignadas.update(lista => [...lista, ...this.disponibles()]);
    this.disponibles.set([]);
  }

  desasignarTodas() {
    this.disponibles.update(lista => [...lista, ...this.asignadas()]);
    this.asignadas.set([]);
  }

  guardar() {
    if (!this.usuarioSeleccionado()) return;
    this.guardando.set(true);

    const data = {
      usuario_id:   this.usuarioSeleccionado()!,
      herramientas: this.asignadas().map(h => h.id)
    };

    this.herramientaService.asignar(data).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarToast('Asignaciones guardadas correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/herramientas']), 1500);
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar asignaciones.', 'danger');
      }
    });
  }

  volver() { this.router.navigate(['/herramientas']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}