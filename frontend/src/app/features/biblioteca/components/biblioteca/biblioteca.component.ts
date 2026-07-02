import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BibliotecaService } from '../../../../core/services/biblioteca.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TrustUrlPipe } from '../../../../core/pipes/trust-url.pipe';

interface IBiblioteca {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  ruta_archivo: string;
  url: string;
  estado_id: number;
  estado: string;
  categoria: string;
  categoria_id: number;
  usuario: string;
}

interface ICategoria {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TrustUrlPipe],
  templateUrl: './biblioteca.component.html'
})
export class BibliotecaComponent implements OnInit {

  private bibliotecaService = inject(BibliotecaService);
  private authService       = inject(AuthService);
  private fb                = inject(FormBuilder);

  // Determinar vista según rol
  esCliente = computed(() => this.authService.usuario()?.rol_id === 3);

  // Tab principal: 'digital' | 'audiovisual' | 'mi-biblioteca'
  tabActiva    = signal<string>('digital');
  subTabActiva = signal<number>(1); // 1=activos 2=inactivos

  activos   = signal<IBiblioteca[]>([]);
  inactivos = signal<IBiblioteca[]>([]);
  miBiblioteca = signal<IBiblioteca[]>([]);
  categorias   = signal<ICategoria[]>([]);

  loading  = signal<boolean>(true);
  guardando = signal<boolean>(false);
  busqueda = signal<string>('');
  toast    = signal<{ mensaje: string; tipo: string } | null>(null);

  modalCrear      = signal<boolean>(false);
  modalEditar     = signal<boolean>(false);
  modalDesactivar = signal<boolean>(false);
  modalActivar    = signal<boolean>(false);
  modalVerPDF     = signal<boolean>(false);
  seleccionado    = signal<IBiblioteca | null>(null);
  pdfUrl          = signal<string>('');
  archivoSeleccionado = signal<File | null>(null);

  listaFiltrada = computed(() => {
    const b     = this.busqueda().toLowerCase();
    const lista = this.subTabActiva() === 1 ? this.activos() : this.inactivos();
    if (!b) return lista;
    return lista.filter(i =>
      i.titulo?.toLowerCase().includes(b) ||
      i.categoria?.toLowerCase().includes(b) ||
      i.usuario?.toLowerCase().includes(b)
    );
  });

  miBibliotecaFiltrada = computed(() => {
    const b = this.busqueda().toLowerCase();
    if (!b) return this.miBiblioteca();
    return this.miBiblioteca().filter(i =>
      i.titulo?.toLowerCase().includes(b) ||
      i.categoria?.toLowerCase().includes(b)
    );
  });

  formDigital = this.fb.group({
    titulo:       ['', [Validators.required, Validators.minLength(3)]],
    descripcion:  [''],
    categoria_id: ['', Validators.required]
  });

  formAudiovisual = this.fb.group({
    titulo:       ['', [Validators.required, Validators.minLength(3)]],
    descripcion:  [''],
    url:          ['', [Validators.required, Validators.pattern('https?://.+')]],
    categoria_id: ['', Validators.required]
  });

  ngOnInit() {
    this.bibliotecaService.getCategorias().subscribe({
      next: r => this.categorias.set(r.data)
    });
    if (this.esCliente()) {
      this.cargarMiBiblioteca();
    } else {
      this.cargarLista();
    }
  }

  cambiarTab(tab: string) {
    this.tabActiva.set(tab);
    this.busqueda.set('');
    this.subTabActiva.set(1);
    if (tab === 'mi-biblioteca') {
      this.cargarMiBiblioteca();
    } else {
      this.cargarLista();
    }
  }

  cambiarSubTab(sub: number) {
    this.subTabActiva.set(sub);
    this.busqueda.set('');
    this.cargarLista();
  }

  cargarLista() {
    this.loading.set(true);
    const tipo = this.tabActiva() as 'digital' | 'audiovisual';
    let cargadas = 0;
    const check = () => { if (++cargadas === 2) this.loading.set(false); };

    this.bibliotecaService.getByTipo(tipo, 1).subscribe({
      next: r => { this.activos.set(r.data); check(); }, error: check
    });
    this.bibliotecaService.getByTipo(tipo, 2).subscribe({
      next: r => { this.inactivos.set(r.data); check(); }, error: check
    });
  }

  cargarMiBiblioteca() {
    this.loading.set(true);
    this.bibliotecaService.getMiBiblioteca().subscribe({
      next: r => { this.miBiblioteca.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  setBusqueda(v: string) { this.busqueda.set(v); }

  // ── Modales CRUD ─────────────────────────────────────────────────────────────
  abrirModalCrear() {
    this.formDigital.reset();
    this.formAudiovisual.reset();
    this.archivoSeleccionado.set(null);
    this.modalCrear.set(true);
  }

  abrirModalEditar(item: IBiblioteca) {
    this.seleccionado.set(item);
    if (this.tabActiva() === 'digital') {
      this.formDigital.patchValue({ titulo: item.titulo, descripcion: item.descripcion, categoria_id: item.categoria_id as any });
    } else {
      this.formAudiovisual.patchValue({ titulo: item.titulo, descripcion: item.descripcion, url: item.url, categoria_id: item.categoria_id as any });
    }
    this.archivoSeleccionado.set(null);
    this.modalEditar.set(true);
  }

  abrirModalDesactivar(item: IBiblioteca) { this.seleccionado.set(item); this.modalDesactivar.set(true); }
  abrirModalActivar(item: IBiblioteca)    { this.seleccionado.set(item); this.modalActivar.set(true); }

  cerrarModales() {
    this.modalCrear.set(false);
    this.modalEditar.set(false);
    this.modalDesactivar.set(false);
    this.modalActivar.set(false);
    this.modalVerPDF.set(false);
    this.seleccionado.set(null);
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.archivoSeleccionado.set(input.files[0]);
  }

  guardarCrear() {
    if (this.tabActiva() === 'digital') {
      if (this.formDigital.invalid || !this.archivoSeleccionado()) {
        this.formDigital.markAllAsTouched();
        if (!this.archivoSeleccionado()) this.mostrarToast('Debes seleccionar un archivo PDF.', 'danger');
        return;
      }
      this.guardando.set(true);
      const fd = new FormData();
      fd.append('titulo',       this.formDigital.value.titulo!);
      fd.append('descripcion',  this.formDigital.value.descripcion || '');
      fd.append('categoria_id', this.formDigital.value.categoria_id!);
      fd.append('archivo',      this.archivoSeleccionado()!);
      this.bibliotecaService.crearDigital(fd).subscribe({
        next: () => { this.cerrarModales(); this.cargarLista(); this.guardando.set(false); this.mostrarToast('Documento agregado correctamente.', 'success'); },
        error: () => { this.guardando.set(false); this.mostrarToast('Error al guardar el documento.', 'danger'); }
      });
    } else {
      if (this.formAudiovisual.invalid) { this.formAudiovisual.markAllAsTouched(); return; }
      this.guardando.set(true);
      this.bibliotecaService.crearAudiovisual(this.formAudiovisual.value).subscribe({
        next: () => { this.cerrarModales(); this.cargarLista(); this.guardando.set(false); this.mostrarToast('Video agregado correctamente.', 'success'); },
        error: () => { this.guardando.set(false); this.mostrarToast('Error al guardar el video.', 'danger'); }
      });
    }
  }

  guardarEditar() {
    const id = this.seleccionado()!.id;
    if (this.tabActiva() === 'digital') {
      if (this.formDigital.invalid) { this.formDigital.markAllAsTouched(); return; }
      this.guardando.set(true);
      const fd = new FormData();
      fd.append('titulo',       this.formDigital.value.titulo!);
      fd.append('descripcion',  this.formDigital.value.descripcion || '');
      fd.append('categoria_id', this.formDigital.value.categoria_id!);
      if (this.archivoSeleccionado()) fd.append('archivo', this.archivoSeleccionado()!);
      this.bibliotecaService.editarDigital(id, fd).subscribe({
        next: () => { this.cerrarModales(); this.cargarLista(); this.guardando.set(false); this.mostrarToast('Documento actualizado correctamente.', 'success'); },
        error: () => { this.guardando.set(false); this.mostrarToast('Error al actualizar.', 'danger'); }
      });
    } else {
      if (this.formAudiovisual.invalid) { this.formAudiovisual.markAllAsTouched(); return; }
      this.guardando.set(true);
      this.bibliotecaService.editarAudiovisual(id, this.formAudiovisual.value).subscribe({
        next: () => { this.cerrarModales(); this.cargarLista(); this.guardando.set(false); this.mostrarToast('Video actualizado correctamente.', 'success'); },
        error: () => { this.guardando.set(false); this.mostrarToast('Error al actualizar.', 'danger'); }
      });
    }
  }

  confirmarDesactivar() {
    this.bibliotecaService.desactivar(this.seleccionado()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarLista(); this.mostrarToast('Registro desactivado.', 'warning'); }
    });
  }

  confirmarActivar() {
    this.bibliotecaService.activar(this.seleccionado()!.id).subscribe({
      next: () => { this.cerrarModales(); this.cargarLista(); this.mostrarToast('Registro activado.', 'success'); }
    });
  }

  verPDF(item: IBiblioteca) {
    this.pdfUrl.set(this.bibliotecaService.getUrlArchivo(item.ruta_archivo));
    this.modalVerPDF.set(true);
  }

  getYoutubeEmbed(url: string): string {
    try {
      const u = new URL(url);
      let id = u.searchParams.get('v');
      if (!id && u.hostname === 'youtu.be') id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : url;
    } catch { return url; }
  }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3500);
  }
}