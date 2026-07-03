import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PerfilService } from '../../../../core/services/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  private fb   = inject(FormBuilder);
  private perfilService = inject(PerfilService);

  perfil   = signal<any>(null);
  loading  = signal<boolean>(true);
  guardando = signal<boolean>(false);
  toast    = signal<{ mensaje: string; tipo: string } | null>(null);
  modoEdicion = signal<boolean>(false);

  form = this.fb.group({
    telefono:        [''],
    fecha_nacimiento:[''],
    pais:            [''],
    ciudad:          [''],
    direccion:       [''],
    tiempo_compania: [''],
    tiempo_cargo:    [''],
    linkedin:        [''],
    instagram:       [''],
    x_twitter:       [''],
    facebook:        [''],
    pagina_web:      [''],
    observacion:     ['']
  });

  ngOnInit() {
    this.perfilService.getPerfil().subscribe({
      next: (resp) => {
        this.perfil.set(resp.data);
        this.form.patchValue(resp.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  activarEdicion() {
    this.modoEdicion.set(true);
  }

  cancelarEdicion() {
    this.form.patchValue(this.perfil()!);
    this.modoEdicion.set(false);
  }

  guardar() {
    this.guardando.set(true);
    this.perfilService.actualizar(this.form.value).subscribe({
      next: () => {
        this.perfil.set({ ...this.perfil(), ...this.form.value });
        this.modoEdicion.set(false);
        this.guardando.set(false);
        this.mostrarToast('Perfil actualizado correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar el perfil.', 'danger');
      }
    });
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}