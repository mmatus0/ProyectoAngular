import { Component, inject, signal, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-modal.component.html'
})
export class UsuarioModalComponent implements OnInit, OnChanges {
  @Input() usuario: any = null;
  @Input() roles: any[]    = [];
  @Input() empresas: any[] = [];
  @Output() guardado  = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private fb             = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  loading   = signal(false);
  error     = signal<string | null>(null);
  tabActiva = signal<'generales' | 'personales' | 'membresia'>('generales');
  mostrarPassword = signal(false);

  esEditar = false;

  form = this.fb.group({
    nombre:        ['', Validators.required],
    usuario:       ['', Validators.required],
    email:         ['', [Validators.required, Validators.email]],
    password:      [''],
    rolusuario_id: ['', Validators.required],
    empresa_id:    ['', Validators.required],
    estado_id:     [1],
    eval_asignadas:[0],
    disc_asignados:[0],
    acreditado:    [0],
    rut:               [''],
    telefono:          [''],
    fecha_nacimiento:  [''],
    pais:              [''],
    ciudad:            [''],
    direccion:         [''],
    tiempo_compania:   [null],
    tiempo_cargo:      [null],
    linkedin:          [''],
    instagram:         [''],
    x_twitter:         [''],
    facebook:          [''],
    pagina_web:        [''],
    observacion:       [''],
    otra_informacion:  [''],
    membresia_id:      [''],
    fecha:             [''],
    dia_pago_mes:      [null],
    herr_contratadas:  [0],
    disc_contratados:  [0],
    test_contratados:  [0],
  });

  ngOnInit() {
    this.inicializarForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuario']) {
      this.inicializarForm();
    }
  }

  inicializarForm() {
    this.form.reset();
    this.tabActiva.set('generales');
    this.error.set(null);

    if (this.usuario) {
      this.esEditar = true;
      this.form.patchValue(this.usuario);
      this.form.get('password')?.clearValidators();
    } else {
      this.esEditar = false;
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  cambiarTab(tab: 'generales' | 'personales' | 'membresia') {
    this.tabActiva.set(tab);
  }

  togglePassword() {
    this.mostrarPassword.set(!this.mostrarPassword());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.tabActiva.set('generales');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const data = this.form.value;

    const op = this.esEditar
      ? this.usuarioService.update(this.usuario.id, data)
      : this.usuarioService.create(data);

    op.subscribe({
      next: () => {
        this.loading.set(false);
        this.guardado.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.mensaje ?? 'Error al guardar el usuario.');
      }
    });
  }
}
