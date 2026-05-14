import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { FiltroPipe } from '../../../shared/pipes/filtro.pipe';
import { UsuarioModalComponent } from '../usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [RouterLink, FormsModule, FiltroPipe, UsuarioModalComponent],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.css'
})
export class UsuariosListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios        = signal<any[]>([]);
  loading         = signal(false);
  tabActiva       = signal<1 | 2>(1);
  busqueda        = signal('');
  modalCrear      = signal(false);
  modalEditar     = signal(false);
  modalEliminar   = signal(false);
  modalActivar    = signal(false);
  usuarioSeleccionado = signal<any>(null);
  toast           = signal<{ tipo: string; mensaje: string } | null>(null);

  roles     = signal<any[]>([]);
  empresas  = signal<any[]>([]);

  ngOnInit() {
    this.cargarFormData();
    this.cargarUsuarios();
  }

  cargarFormData() {
    this.usuarioService.getFormData().subscribe({
      next: res => {
        this.roles.set(res.roles);
        this.empresas.set(res.empresas);
      }
    });
  }

  cargarUsuarios() {
    this.loading.set(true);
    this.usuarioService.getAll(this.tabActiva()).subscribe({
      next: res => {
        this.usuarios.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  cambiarTab(tab: 1 | 2) {
    this.tabActiva.set(tab);
    this.busqueda.set('');
    this.cargarUsuarios();
  }

  setBusqueda(valor: string) {
    this.busqueda.set(valor);
  }

  abrirModalCrear() {
    this.modalCrear.set(true);
  }

  abrirModalEditar(usuario: any) {
    this.usuarioSeleccionado.set({ ...usuario });
    this.modalEditar.set(true);
  }

  abrirModalEliminar(usuario: any) {
    this.usuarioSeleccionado.set(usuario);
    this.modalEliminar.set(false);
    setTimeout(() => this.modalEliminar.set(true), 0);
  }

  abrirModalActivar(usuario: any) {
    this.usuarioSeleccionado.set(usuario);
    this.modalActivar.set(false);
    setTimeout(() => this.modalActivar.set(true), 0);
  }

  cerrarModales() {
    this.modalCrear.set(false);
    this.modalEditar.set(false);
    this.modalEliminar.set(false);
    this.modalActivar.set(false);
    this.usuarioSeleccionado.set(null);
  }

  onUsuarioCreado() {
    this.cerrarModales();
    this.cargarUsuarios();
    this.mostrarToast('success', 'Usuario creado correctamente.');
  }

  onUsuarioEditado() {
    this.cerrarModales();
    this.cargarUsuarios();
    this.mostrarToast('success', 'Usuario actualizado correctamente.');
  }

  confirmarEliminar() {
    const u = this.usuarioSeleccionado();
    if (!u) return;
    this.usuarioService.desactivar(u.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarUsuarios();
        this.mostrarToast('danger', 'Usuario desactivado correctamente.');
      }
    });
  }

  confirmarActivar() {
    const u = this.usuarioSeleccionado();
    if (!u) return;
    this.usuarioService.activar(u.id).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarUsuarios();
        this.mostrarToast('success', 'Usuario activado correctamente.');
      }
    });
  }

  mostrarToast(tipo: string, mensaje: string) {
    this.toast.set({ tipo, mensaje });
    setTimeout(() => this.toast.set(null), 3500);
  }

  getRolBadge(rolId: number): string {
    const map: Record<number, string> = { 1: 'primary', 2: 'success', 3: 'info' };
    return map[rolId] ?? 'secondary';
  }

  getRolNombre(rolId: number): string {
    const map: Record<number, string> = { 1: 'Admin', 2: 'Coach', 3: 'Cliente' };
    return map[rolId] ?? 'N/A';
  }
}
