import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  private http   = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/mis-evaluaciones';
  private asignacionId!: number;

  evaluacion   = signal<any>(null);
  preguntas    = signal<IPregunta[]>([]);
  alternativas = signal<IAlternativa[]>([]);
  respuestas   = signal<{ [preguntaId: number]: number }>({});
  loading      = signal<boolean>(true);
  guardando    = signal<boolean>(false);
  toast        = signal<{ mensaje: string; tipo: string } | null>(null);
  modalFinalizar = signal<boolean>(false);

  totalPreguntas  = computed(() => this.preguntas().length);
  respondidas     = computed(() => Object.keys(this.respuestas()).length);
  progreso        = computed(() =>
    this.totalPreguntas() > 0
      ? Math.round((this.respondidas() / this.totalPreguntas()) * 100)
      : 0
  );

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.asignacionId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<any>(`${this.apiUrl}/${this.asignacionId}/test`, this.headers()).subscribe({
      next: (resp) => {
        this.evaluacion.set(resp.evaluacion);
        this.preguntas.set(resp.preguntas);
        this.alternativas.set(resp.alternativas);
        this.respuestas.set(resp.respuestas || {});
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ggetAlternativasPregunta(preguntaId: number): IAlternativa[] {
    return this.alternativas().filter((a: any) => a.pregunta_id === preguntaId);
  }

  seleccionarRespuesta(preguntaId: number, alternativaId: number) {
    this.respuestas.update(r => ({ ...r, [preguntaId]: alternativaId }));
  }

  estaRespondida(preguntaId: number): boolean {
    return this.respuestas()[preguntaId] !== undefined;
  }

  getRespuesta(preguntaId: number): number | null {
    return this.respuestas()[preguntaId] ?? null;
  }

  guardarAvance() {
    this.guardando.set(true);
    const body = { respuestas: this.respuestas(), finalizar: false };
    this.http.post<any>(`${this.apiUrl}/${this.asignacionId}/guardar`, body, this.headers()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarToast('Avance guardado correctamente.', 'success');
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al guardar avance.', 'danger');
      }
    });
  }

  abrirModalFinalizar() { this.modalFinalizar.set(true); }
  cerrarModalFinalizar() { this.modalFinalizar.set(false); }

  confirmarFinalizar() {
    this.guardando.set(true);
    const body = { respuestas: this.respuestas(), finalizar: true };
    this.http.post<any>(`${this.apiUrl}/${this.asignacionId}/guardar`, body, this.headers()).subscribe({
      next: () => {
        this.cerrarModalFinalizar();
        this.guardando.set(false);
        this.mostrarToast('Evaluación finalizada correctamente.', 'success');
        setTimeout(() => this.router.navigate(['/mis-evaluaciones']), 1500);
      },
      error: () => {
        this.guardando.set(false);
        this.mostrarToast('Error al finalizar la evaluación.', 'danger');
      }
    });
  }

  volver() { this.router.navigate(['/mis-evaluaciones']); }

  mostrarToast(mensaje: string, tipo: string) {
    this.toast.set({ mensaje, tipo });
    setTimeout(() => this.toast.set(null), 3000);
  }
}