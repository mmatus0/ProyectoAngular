import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';

interface IPregunta {
  id: number;
  enunciado: string;
  numero: number;
  dimension_id: number;
}

interface IAlternativa {
  id: number;
  alternativa: string;
  score: number;
  letra: string;
  cuadrante: string;
  grupo: string;
  pregunta_id: number;
}

@Component({
  selector: 'app-evaluacion-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluacion-test.component.html'
})
export class EvaluacionTestComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private evaluacionService = inject(EvaluacionService);

  private asignacionId!: number;

  evaluacion   = signal<any>(null);
  preguntas    = signal<IPregunta[]>([]);
  alternativas = signal<IAlternativa[]>([]);

  // Respuestas normales: { preguntaId: alternativaId }
  respuestas   = signal<{ [preguntaId: number]: number }>({});

  // Respuestas DISC: { preguntaId: { mas: altId, menos: altId } }
  respuestasDisc = signal<{ [preguntaId: number]: { mas: number | null; menos: number | null } }>({});

  loading        = signal<boolean>(true);
  guardando      = signal<boolean>(false);
  toast          = signal<{ mensaje: string; tipo: string } | null>(null);
  modalFinalizar = signal<boolean>(false);

  esDisc = computed(() => this.evaluacion()?.evaluacion_id === 10);

  totalPreguntas = computed(() => this.preguntas().length);

  respondidas = computed(() => {
    if (this.esDisc()) {
      return Object.values(this.respuestasDisc()).filter(r => r.mas && r.menos).length;
    }
    return Object.keys(this.respuestas()).length;
  });

  progreso = computed(() =>
    this.totalPreguntas() > 0
      ? Math.round((this.respondidas() / this.totalPreguntas()) * 100)
      : 0
  );

  ngOnInit() {
    this.asignacionId = Number(this.route.snapshot.paramMap.get('id'));
    this.evaluacionService.getTest(this.asignacionId).subscribe({
      next: (resp) => {
        this.evaluacion.set(resp.evaluacion);
        this.preguntas.set(resp.preguntas);
        this.alternativas.set(resp.alternativas);

        if (resp.evaluacion?.evaluacion_id === 10) {
          this.respuestasDisc.set(resp.respuestas || {});
        } else {
          this.respuestas.set(resp.respuestas || {});
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getAlternativasPregunta(preguntaId: number): IAlternativa[] {
    const filtradas = this.alternativas().filter((a: any) => a.pregunta_id === preguntaId);
    return filtradas.length === 0 ? this.alternativas() : filtradas;
  }

  seleccionarRespuesta(preguntaId: number, altId: number) {
    this.respuestas.update(r => ({ ...r, [preguntaId]: altId }));
  }

  // ── DISC: selección Más / Menos ──────────────────────────────────────────
  seleccionarMas(preguntaId: number, altId: number) {
    this.respuestasDisc.update(r => {
      const actual = r[preguntaId] || { mas: null, menos: null };
      const menos = actual.menos === altId ? null : actual.menos;
      return { ...r, [preguntaId]: { mas: altId, menos } };
    });
  }

  seleccionarMenos(preguntaId: number, altId: number) {
    this.respuestasDisc.update(r => {
      const actual = r[preguntaId] || { mas: null, menos: null };
      const mas = actual.mas === altId ? null : actual.mas;
      return { ...r, [preguntaId]: { mas, menos: altId } };
    });
  }

  getMas(preguntaId: number): number | null {
    return this.respuestasDisc()[preguntaId]?.mas ?? null;
  }

  getMenos(preguntaId: number): number | null {
    return this.respuestasDisc()[preguntaId]?.menos ?? null;
  }

  mismoSeleccionado(preguntaId: number): boolean {
    const r = this.respuestasDisc()[preguntaId];
    return !!(r?.mas && r?.menos && r.mas === r.menos);
  }

  // ── Guardar ───────────────────────────────────────────────────────────────
  guardarAvance() {
    this.guardando.set(true);
    const body = this.esDisc()
      ? { respuestas: this.respuestasDisc(), finalizar: false }
      : { respuestas: this.respuestas(), finalizar: false };

    this.evaluacionService.guardarTest(this.asignacionId, body).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarToast('Avance guardado correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar.', 'danger');
      }
    });
  }

  confirmarFinalizar() {
    this.guardando.set(true);
    const body = this.esDisc()
      ? { respuestas: this.respuestasDisc(), finalizar: true }
      : { respuestas: this.respuestas(), finalizar: true };

    this.evaluacionService.guardarTest(this.asignacionId, body).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModalFinalizar();
        this.router.navigate(['/mis-evaluaciones', this.asignacionId, 'resultados']);
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al finalizar.', 'danger');
      }
    });
  }

  abrirModalFinalizar()  { this.modalFinalizar.set(true); }
  cerrarModalFinalizar() { this.modalFinalizar.set(false); }
  volver() { this.router.navigate(['/mis-evaluaciones']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3500);
  }
}