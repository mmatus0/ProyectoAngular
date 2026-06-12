import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';



interface IAtributo {
  id: number;
  atributo: string;
  entidad_id: number;
  editando?: boolean;
  textoEdicion?: string;
}

interface IEntidad {
  id: number;
  entidad: string;
  tipo_entidad: string;
  sub_entidad: string;
  codigo_metodo: string;
}

@Component({
  selector: 'app-herramienta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herramienta-detalle.component.html'
})
export class HerramientaDetalleComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private http   = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/mis-herramientas`;

  herramienta  = signal<any>(null);
  entidades    = signal<IEntidad[]>([]);
  atributos    = signal<{ [key: number]: IAtributo[] }>({});
  loading      = signal<boolean>(true);
  toast        = signal<{ mensaje: string; tipo: string } | null>(null);

  // Textos de entrada por cuadrante
  inputTextos  = signal<{ [key: number]: string }>({});

  private asignacionId!: number;

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.asignacionId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any>(`${this.apiUrl}/${this.asignacionId}/cuadrantes`, this.headers()).subscribe({
      next: (resp) => {
        this.herramienta.set(resp.herramienta);
        this.entidades.set(resp.entidades);
        this.atributos.set(resp.atributos || {});

        // Inicializar inputs vacíos
        const inputs: { [key: number]: string } = {};
        resp.entidades.forEach((e: IEntidad) => inputs[e.id] = '');
        this.inputTextos.set(inputs);

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getAtributos(entidadId: number): IAtributo[] {
    return this.atributos()[entidadId] || [];
  }

  getInput(entidadId: number): string {
    return this.inputTextos()[entidadId] || '';
  }

  setInput(entidadId: number, valor: string) {
    this.inputTextos.update(inputs => ({ ...inputs, [entidadId]: valor }));
  }

  agregarAtributo(entidadId: number) {
    const texto = this.getInput(entidadId).trim();
    if (!texto) {
      this.mostrarToast('Debes escribir un dato para poder enviarlo.', 'warning');
      return;
    }

    const body = { entidad_id: entidadId, atributo: texto };
    this.http.post<any>(`${this.apiUrl}/${this.asignacionId}/atributo`, body, this.headers()).subscribe({
      next: (resp) => {
        const nuevo: IAtributo = { id: resp.id, atributo: texto, entidad_id: entidadId };
        this.atributos.update(acts => ({
          ...acts,
          [entidadId]: [...(acts[entidadId] || []), nuevo]
        }));
        this.setInput(entidadId, '');
      },
      error: () => this.mostrarToast('Error al agregar atributo.', 'danger')
    });
  }

  iniciarEdicion(entidadId: number, atributo: IAtributo) {
    this.atributos.update(acts => ({
      ...acts,
      [entidadId]: acts[entidadId].map(a =>
        a.id === atributo.id
          ? { ...a, editando: true, textoEdicion: a.atributo }
          : { ...a, editando: false }
      )
    }));
  }

  cancelarEdicion(entidadId: number, atributoId: number) {
    this.atributos.update(acts => ({
      ...acts,
      [entidadId]: acts[entidadId].map(a =>
        a.id === atributoId ? { ...a, editando: false } : a
      )
    }));
  }

  setTextoEdicion(entidadId: number, atributoId: number, valor: string) {
    this.atributos.update(acts => ({
      ...acts,
      [entidadId]: acts[entidadId].map(a =>
        a.id === atributoId ? { ...a, textoEdicion: valor } : a
      )
    }));
  }

  guardarEdicion(entidadId: number, atributo: IAtributo) {
    const texto = atributo.textoEdicion?.trim();
    if (!texto) return;

    this.http.put<any>(`${this.apiUrl}/atributo/${atributo.id}`, { atributo: texto }, this.headers()).subscribe({
      next: () => {
        this.atributos.update(acts => ({
          ...acts,
          [entidadId]: acts[entidadId].map(a =>
            a.id === atributo.id ? { ...a, atributo: texto, editando: false } : a
          )
        }));
      },
      error: () => this.mostrarToast('Error al actualizar atributo.', 'danger')
    });
  }

  eliminarAtributo(entidadId: number, atributoId: number) {
    if (!confirm('¿Quitar este elemento?')) return;

    this.http.delete<any>(`${this.apiUrl}/atributo/${atributoId}`, this.headers()).subscribe({
      next: () => {
        this.atributos.update(acts => ({
          ...acts,
          [entidadId]: acts[entidadId].filter(a => a.id !== atributoId)
        }));
      },
      error: () => this.mostrarToast('Error al eliminar atributo.', 'danger')
    });
  }

  colorPorTipo(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'motor':  return 'success';
      case 'freno':  return 'danger';
      case 'ancla':  return 'warning';
      default:       return 'primary';
    }
  }

  volver() { this.router.navigate(['/herramientas']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}