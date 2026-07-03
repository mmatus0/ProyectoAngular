import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';

@Component({
  selector: 'app-evaluacion-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluacion-resultados.component.html'
})
export class EvaluacionResultadosComponent implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private evaluacionService = inject(EvaluacionService);

  data        = signal<any>(null);
  resultados  = signal<any[]>([]);
  loading     = signal<boolean>(true);

  esLiderazgo     = computed(() => this.data()?.evaluacion_id === 1);
  esGlobal        = computed(() => [2, 5].includes(this.data()?.evaluacion_id));
  esDimensiones   = computed(() => [3, 4, 6, 7, 9].includes(this.data()?.evaluacion_id));
  esGestionTiempo = computed(() => this.data()?.evaluacion_id === 8);
  esDisc          = computed(() => this.data()?.evaluacion_id === 10);

  analisis = computed(() => this.getAnalisis());

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.evaluacionService.getResultados(id).subscribe({
      next: (resp) => {
        this.data.set(resp.data);
        this.resultados.set(resp.data.resultadosJson?.Resultados || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getCuadrantes() {
    return this.resultados().filter(r => ['ATBR', 'ATAR', 'BTAR', 'BTBR'].includes(r.dimension));
  }

  getNivelEfectividad() {
    return this.resultados().find(r => r.dimension === 'Nivel de Efectividad');
  }

  getBarWidth(porcentaje: number): number {
    const max = Math.max(...this.getCuadrantes().map(c => c.Porcentaje || 0));
    return max > 0 ? Math.round((porcentaje / max) * 100) : 0;
  }

  colorPorIndice(i: number): string {
    const colores = ['primary', 'success', 'warning', 'danger', 'info'];
    return colores[i % colores.length];
  }

  // ── DISC (ID 10) ──────────────────────────────────────────────────────────
  getPerfilDisc() {
    return this.resultados().filter(r => ['D', 'I', 'S', 'C'].includes(r.dimension));
  }

  getPerfilDominanteDisc() {
    return this.resultados().find(r => r.dimension === 'Perfil Dominante');
  }

  colorLetraDisc(letra: string): string {
    const mapa: Record<string, string> = { D: 'danger', I: 'warning', S: 'success', C: 'primary' };
    return mapa[letra] || 'secondary';
  }

  // La intensidad normalizada de disc_codigo va de 1 a 28 (escala real del sistema original)
  porcentajeIntensidadDisc(intensidad: number): number {
    return Math.max(0, Math.min(100, Math.round((intensidad / 28) * 100)));
  }

  volver() { this.router.navigate(['/mis-evaluaciones']); }

  // ── ANÁLISIS TEXTUAL ──────────────────────────────────────────────────────────

  getAnalisis(): { titulo: string; parrafos: string[]; recomendaciones: string[] } | null {
    const res = this.resultados();
    const ev  = this.data()?.evaluacion_id;
    if (!res.length || !ev) return null;

    // LIDERAZGO SITUACIONAL (ID 1)
    if (ev === 1) {
      const cuadrantes = this.getCuadrantes();
      const principal  = cuadrantes.reduce((a, b) => (a.Porcentaje > b.Porcentaje ? a : b), cuadrantes[0]);
      const efectividad = this.getNivelEfectividad();
      const estilos: Record<string, string> = {
        'ATBR': 'Instruir (Alta Tarea / Baja Relación)',
        'ATAR': 'Persuadir (Alta Tarea / Alta Relación)',
        'BTAR': 'Participar (Baja Tarea / Alta Relación)',
        'BTBR': 'Delegar (Baja Tarea / Baja Relación)'
      };
      const descripcionesAnalisis: Record<string, string[]> = {
        'ATBR': [
          'Tu perfil predominante es el estilo Instruir. Este estilo se caracteriza por un alto enfoque en la tarea y menor énfasis en la relación interpersonal.',
          'Eres efectivo/a cuando necesitas dar instrucciones claras, precisas y directas a colaboradores que están aprendiendo o que requieren una estructura definida para desempeñarse.',
          'Este estilo es clave en equipos con poca experiencia o en situaciones de alta urgencia donde la claridad de roles es prioritaria.'
        ],
        'ATAR': [
          'Tu perfil predominante es el estilo Persuadir. Combinas un alto enfoque en la tarea con una fuerte orientación hacia las relaciones humanas.',
          'Eres capaz de motivar a tu equipo explicando el "por qué" detrás de cada tarea, lo que genera compromiso y adhesión voluntaria.',
          'Este estilo es especialmente efectivo con personas que tienen potencial pero aún necesitan dirección y respaldo emocional.'
        ],
        'BTAR': [
          'Tu perfil predominante es el estilo Participar. Privilegias las relaciones interpersonales y fomentas la participación activa del equipo en la toma de decisiones.',
          'Eres un/a líder que escucha, colabora y confía en las capacidades de su equipo, lo que genera un ambiente de trabajo motivador y de alto compromiso.',
          'Este estilo es ideal con colaboradores competentes que necesitan confianza y reconocimiento para rendir al máximo.'
        ],
        'BTBR': [
          'Tu perfil predominante es el estilo Delegar. Confías plenamente en la autonomía de tu equipo y entregas responsabilidad sin microgestionar.',
          'Este estilo refleja una alta madurez de liderazgo: reconoces cuándo un colaborador está listo para operar con independencia.',
          'Es más efectivo con profesionales de alta experiencia y motivación que requieren espacio para innovar y tomar decisiones propias.'
        ]
      };
      const recsAnalisis: Record<string, string[]> = {
        'ATBR': [
          'Trabaja en desarrollar habilidades de escucha activa para complementar tu capacidad directiva.',
          'Practica dar retroalimentación positiva junto con las instrucciones para fortalecer el vínculo con tu equipo.',
          'Considera delegar progresivamente a medida que tus colaboradores ganen experiencia.'
        ],
        'ATAR': [
          'Asegúrate de no sobrecargar a tu equipo con demasiada dirección cuando ya han alcanzado un nivel de autonomía.',
          'Desarrolla la capacidad de soltar el control en situaciones donde el equipo ya demuestra competencia.',
          'Refuerza el reconocimiento de logros individuales para mantener la motivación.'
        ],
        'BTAR': [
          'En situaciones de baja experiencia del equipo, incorpora más estructura y dirección explícita.',
          'Equilibra la participación con decisiones claras cuando el tiempo o la urgencia lo requieran.',
          'Continúa fortaleciendo el clima de confianza, es tu mayor fortaleza como líder.'
        ],
        'BTBR': [
          'Mantén canales de comunicación abiertos aunque no supervises activamente.',
          'Asegúrate de que tu equipo cuente con los recursos necesarios para operar con autonomía.',
          'Intervén oportunamente cuando detectes señales de desmotivación o bloqueos en el equipo.'
        ]
      };
      const dim = principal?.dimension || 'BTBR';
      return {
        titulo: `Análisis: Estilo predominante — ${estilos[dim] || dim}`,
        parrafos: descripcionesAnalisis[dim] || [],
        recomendaciones: recsAnalisis[dim] || []
      };
    }

    // TEST DE ASERTIVIDAD (ID 2)
    if (ev === 2) {
      const puntaje = res[0]?.Puntaje || 0;
      const resultado = res[0]?.Resultado || '';
      const mapas: Record<string, { parrafos: string[]; recs: string[] }> = {
        'No Asertivo': {
          parrafos: [
            'Tu resultado indica un perfil de comunicación no asertivo. Esto puede manifestarse en dificultades para expresar tus opiniones o necesidades de manera directa, tendiendo a ceder ante los demás incluso cuando no estás de acuerdo.',
            'Las personas con este perfil suelen priorizar la armonía del grupo por sobre sus propias necesidades, lo que a largo plazo puede generar frustración, resentimiento o baja autoestima.',
            'El desarrollo de la asertividad es un proceso gradual que comienza por reconocer el valor de tus propias opiniones y aprender a expresarlas con respeto.'
          ],
          recs: [
            'Practica comunicar tus necesidades en situaciones de bajo riesgo antes de hacerlo en contextos de mayor tensión.',
            'Trabaja con técnicas de comunicación no violenta (CNV) para aprender a expresar lo que sientes sin agresividad.',
            'Considera trabajar con un coach o psicólogo para fortalecer tu autoconfianza comunicacional.'
          ]
        },
        'Asertivo': {
          parrafos: [
            'Tu resultado muestra un perfil asertivo, lo que significa que logras comunicar tus pensamientos, emociones y necesidades de manera directa, clara y respetuosa.',
            'La asertividad es una de las habilidades blandas más valoradas en entornos laborales y relacionales, ya que permite establecer límites sanos sin dañar las relaciones interpersonales.',
            'Mantienes un equilibrio saludable entre expresar lo que piensas y considerar el impacto de tus palabras en los demás.'
          ],
          recs: [
            'Continúa practicando la escucha activa como complemento a tu comunicación asertiva.',
            'Comparte tus habilidades comunicacionales con tu entorno, puedes ser un referente positivo para tu equipo.',
            'Trabaja en mantener la asertividad incluso en situaciones de alta presión o conflicto.'
          ]
        },
        'Agresivo': {
          parrafos: [
            'Tu resultado refleja un estilo de comunicación agresivo. Si bien logras expresar tus necesidades con claridad, en ocasiones puede ser a expensas de los sentimientos o derechos de los demás.',
            'Este estilo puede generar conflictos innecesarios, dificultar el trabajo colaborativo y deteriorar las relaciones interpersonales a largo plazo.',
            'La buena noticia es que la energía y la determinación que caracterizan este perfil son fortalezas que, bien canalizadas, pueden convertirse en liderazgo efectivo.'
          ],
          recs: [
            'Trabaja en hacer pausas antes de responder en situaciones de tensión.',
            'Practica la empatía: antes de hablar, pregúntate cómo impactarán tus palabras en la otra persona.',
            'Busca espacios de desarrollo en gestión emocional para canalizar tu energía de forma constructiva.'
          ]
        }
      };
      const key = Object.keys(mapas).find(k => resultado.toLowerCase().includes(k.toLowerCase())) || 'Asertivo';
      return {
        titulo: `Análisis: Perfil de Asertividad — ${resultado}`,
        parrafos: mapas[key]?.parrafos || [],
        recomendaciones: mapas[key]?.recs || []
      };
    }

    // ETAPAS DE DESARROLLO DEL EQUIPO (ID 3)
    if (ev === 3) {
      const principal = res.reduce((a: any, b: any) => (a.Puntaje > b.Puntaje ? a : b), res[0]);
      const etapa = principal?.Resultado || '';
      const mapas: Record<string, { parrafos: string[]; recs: string[] }> = {
        'Formación': {
          parrafos: [
            'Tu equipo se encuentra en la etapa de Formación, caracterizada por la incertidumbre de roles, alta dependencia del líder y relaciones todavía en construcción.',
            'Es normal que en esta etapa exista entusiasmo inicial mezclado con ansiedad. Las personas están aprendiendo a conocerse y a entender las expectativas del grupo.',
            'El liderazgo directivo y la claridad en los objetivos son fundamentales para avanzar hacia etapas de mayor madurez.'
          ],
          recs: [
            'Define claramente los roles y responsabilidades de cada integrante.',
            'Establece normas de funcionamiento del equipo de forma participativa.',
            'Dedica tiempo a actividades de integración para acelerar la confianza interpersonal.'
          ]
        },
        'Confrontación': {
          parrafos: [
            'Tu equipo está en la etapa de Confrontación, donde emergen los conflictos naturales del trabajo en equipo: diferencias de opinión, roces interpersonales y cuestionamiento de la autoridad.',
            'Aunque esta etapa puede ser incómoda, es señal de que el equipo está madurando. Los conflictos bien gestionados son catalizadores del crecimiento colectivo.',
            'El liderazgo en esta etapa debe ser firme pero empático, orientado a mediar y facilitar acuerdos.'
          ],
          recs: [
            'Aborda los conflictos de forma directa y constructiva, evita ignorarlos.',
            'Refuerza el propósito común del equipo para superar las diferencias individuales.',
            'Facilita espacios de retroalimentación abierta y honesta entre los integrantes.'
          ]
        },
        'Normalización': {
          parrafos: [
            'Tu equipo se encuentra en la etapa de Normalización. Han superado los conflictos iniciales y están construyendo una forma de trabajar colaborativa y cohesionada.',
            'Existe mayor confianza interpersonal, los roles están clarificados y el equipo comienza a operar con mayor fluidez y autonomía.',
            'Esta es una etapa clave para consolidar buenas prácticas y preparar al equipo para alcanzar alto rendimiento.'
          ],
          recs: [
            'Refuerza los logros colectivos para mantener la motivación alta.',
            'Introduce desafíos progresivamente más complejos para impulsar al equipo hacia el alto desempeño.',
            'Continúa fortaleciendo la comunicación abierta como pilar del trabajo en equipo.'
          ]
        },
        'Desempeño': {
          parrafos: [
            'Tu equipo opera en la etapa de Desempeño, el nivel más alto de madurez grupal. Existe alta confianza, autonomía, colaboración efectiva y orientación clara a los resultados.',
            'Los integrantes se apoyan mutuamente, toman iniciativas sin necesidad de supervisión constante y resuelven los conflictos de forma constructiva.',
            'Mantener a un equipo en esta etapa requiere atención continua al bienestar del equipo y renovación periódica de los desafíos.'
          ],
          recs: [
            'Celebra regularmente los logros del equipo para mantener la motivación.',
            'Introduce nuevos desafíos para evitar el estancamiento y la desmotivación por rutina.',
            'Cuida el equilibrio entre la autonomía del equipo y el acompañamiento del liderazgo.'
          ]
        }
      };
      const key = Object.keys(mapas).find(k => etapa.toLowerCase().includes(k.toLowerCase())) || 'Formación';
      return {
        titulo: `Análisis: Etapa predominante — ${etapa}`,
        parrafos: mapas[key]?.parrafos || [],
        recomendaciones: mapas[key]?.recs || []
      };
    }

    // TEST DE ESCUCHA ACTIVA (ID 4)
    if (ev === 4) {
      const total   = res.reduce((s: number, r: any) => s + (r.Puntaje || 0), 0);
      const niveles = [
        { min: 0,  max: 30, nivel: 'Bajo',  parrafos: [
          'Tu puntaje indica un nivel bajo de escucha activa. Esto puede estar afectando tus relaciones interpersonales y tu efectividad comunicacional sin que lo notes conscientemente.',
          'La escucha activa no es solo "no interrumpir", implica presencia plena, comprensión profunda del mensaje y respuesta empática.',
          'Desarrollar esta habilidad puede transformar significativamente la calidad de tus relaciones laborales y personales.'
        ], recs: [
          'Practica el contacto visual y elimina distracciones durante las conversaciones.',
          'Antes de responder, parafrasea lo que escuchaste para verificar que entendiste correctamente.',
          'Trabaja en controlar el impulso de formular tu respuesta mientras el otro todavía habla.'
        ]},
        { min: 31, max: 60, nivel: 'Medio', parrafos: [
          'Tu nivel de escucha activa es intermedio. Tienes una base sólida pero aún existen oportunidades importantes de mejora en tu capacidad de atención y comprensión.',
          'En ocasiones puedes estar presente físicamente pero distante emocionalmente, lo que limita la profundidad de tus conversaciones.',
          'Con práctica consciente, puedes alcanzar un nivel de escucha que potencie significativamente tu liderazgo y tus relaciones.'
        ], recs: [
          'Practica la presencia plena: cuando alguien habla contigo, pon el teléfono boca abajo.',
          'Haz preguntas abiertas para profundizar la comprensión antes de dar tu opinión.',
          'Trabaja en reconocer y gestionar tus propios sesgos que pueden bloquear la escucha genuina.'
        ]},
        { min: 61, max: 100, nivel: 'Alto', parrafos: [
          'Tu puntaje refleja un nivel alto de escucha activa, una de las habilidades más valiosas para el liderazgo, el trabajo en equipo y las relaciones interpersonales.',
          'Tienes la capacidad de prestar atención genuina, comprender el mensaje subyacente y responder de forma empática y constructiva.',
          'Esta habilidad te posiciona como un/a comunicador/a confiable y como un/a referente para quienes te rodean.'
        ], recs: [
          'Comparte y modela esta habilidad con tu equipo, es una capacidad que se puede enseñar.',
          'Continúa desarrollando la escucha en situaciones de alta tensión o conflicto, donde es más difícil de mantener.',
          'Explora técnicas avanzadas como la escucha sistémica o la escucha generativa para seguir creciendo.'
        ]}
      ];
      const nivel = niveles.find(n => total >= n.min && total <= n.max) || niveles[1];
      return {
        titulo: `Análisis: Nivel de Escucha Activa — ${nivel.nivel} (${total} pts)`,
        parrafos: nivel.parrafos,
        recomendaciones: nivel.recs
      };
    }

    // TEST DE FELICIDAD (ID 5)
    if (ev === 5) {
      const puntaje  = res[0]?.Puntaje || 0;
      const resultado = res[0]?.Resultado || '';
      const niveles = [
        { max: 25, parrafos: [
          'Tu resultado sugiere un nivel de bienestar subjetivo que podría estar por debajo de lo que desearías experimentar. Esto no define quién eres, sino que es un punto de partida para la reflexión.',
          'La felicidad es un estado dinámico que puede cultivarse con hábitos conscientes, apoyo social y propósito de vida.',
          'Es importante tomar este resultado como una invitación a explorar qué aspectos de tu vida podrían estar necesitando atención y cuidado.'
        ], recs: [
          'Comienza por identificar al menos una cosa positiva al final de cada día (diario de gratitud).',
          'Busca apoyo profesional si sientes que tu bienestar emocional está afectando significativamente tu calidad de vida.',
          'Reconecta con actividades que antes te generaban satisfacción o alegría.'
        ]},
        { max: 50, parrafos: [
          'Tu nivel de felicidad es moderado. Hay aspectos de tu vida que te generan satisfacción, pero también áreas que podrían estar impactando negativamente tu bienestar general.',
          'La felicidad moderada es el estado más común: implica altibajos, momentos de plenitud y períodos de mayor esfuerzo.',
          'Pequeños cambios en tus hábitos diarios, relaciones o forma de interpretar los eventos pueden tener un gran impacto en tu bienestar.'
        ], recs: [
          'Identifica las fuentes de estrés recurrente en tu vida y trabaja en estrategias concretas para gestionarlas.',
          'Invierte tiempo en relaciones que te nutran y te aporten energía positiva.',
          'Incorpora prácticas de mindfulness o ejercicio físico regular para elevar tu bienestar basal.'
        ]},
        { max: 100, parrafos: [
          'Tu resultado refleja un alto nivel de felicidad y bienestar subjetivo. Percibes tu vida de manera positiva y cuentas con recursos emocionales que te permiten afrontar los desafíos con resiliencia.',
          'Las personas con este perfil tienden a tener relaciones más satisfactorias, mayor productividad y mejor salud física y mental.',
          'Mantener este nivel de bienestar requiere atención consciente a los pilares que lo sostienen: relaciones, propósito, salud y crecimiento personal.'
        ], recs: [
          'Sigue cultivando las fuentes de significado y propósito que sustentan tu bienestar.',
          'Comparte tu energía positiva con quienes te rodean, el bienestar es contagioso.',
          'Mantente atento/a a señales de desgaste o estancamiento para actuar de forma preventiva.'
        ]}
      ];
      const nivel = niveles.find(n => puntaje <= n.max) || niveles[1];
      return {
        titulo: `Análisis: Índice de Felicidad — ${resultado}`,
        parrafos: nivel.parrafos,
        recomendaciones: nivel.recs
      };
    }

    // GESTIÓN DEL TIEMPO (ID 8)
    if (ev === 8) {
      const positivo = res[0]?.Puntaje || 0;
      const mapas = [
        { min: 70, parrafos: [
          'Tu gestión del tiempo es altamente efectiva. Demuestras hábitos sólidos de planificación, priorización y foco que te permiten alcanzar tus metas con eficiencia.',
          'Aprovechas bien tu energía y tiempo, diferenciando entre lo urgente y lo importante, y evitando caer en distractores.',
          'Este nivel de efectividad es una ventaja competitiva significativa tanto en el ámbito laboral como personal.'
        ], recs: [
          'Explora metodologías avanzadas como GTD (Getting Things Done) o Time Blocking para seguir optimizando.',
          'Comparte tus estrategias con tu equipo, puedes ser un modelo de productividad.',
          'Cuida el equilibrio entre productividad y descanso para evitar el burnout.'
        ]},
        { min: 40, parrafos: [
          'Tu gestión del tiempo es intermedia. Tienes consciencia de la importancia de organizar tu tiempo, pero existen hábitos o situaciones que todavía dificultan tu plena efectividad.',
          'Es posible que te encuentres frecuentemente con que el día termina sin haber completado todo lo que planeabas.',
          'Con algunos ajustes en tu planificación y la eliminación de distractores clave, puedes mejorar significativamente tu productividad.'
        ], recs: [
          'Comienza cada día con una lista de no más de 3 tareas prioritarias.',
          'Identifica tus principales "ladrones de tiempo" y trabaja en eliminarlos o reducirlos.',
          'Prueba la técnica Pomodoro para mantener el foco durante períodos cortos con descansos regulares.'
        ]},
        { min: 0, parrafos: [
          'Tu resultado sugiere que la gestión del tiempo es un área de mejora significativa. Es posible que sientas que el tiempo "se escapa" sin lograr lo que te propones.',
          'Los hábitos de procrastinación, la falta de planificación o la dificultad para decir "no" pueden estar influyendo en este resultado.',
          'La buena noticia es que la gestión del tiempo es una habilidad completamente aprendible con las herramientas y la práctica adecuadas.'
        ], recs: [
          'Comienza por registrar cómo usas tu tiempo durante una semana para identificar patrones.',
          'Aprende a diferenciar entre tareas urgentes e importantes usando la Matriz de Eisenhower.',
          'Establece rutinas fijas de inicio y cierre del día para crear estructura y hábito.'
        ]}
      ];
        const nivel = mapas.find(n => positivo >= n.min) || mapas[1];
      return {
        titulo: `Análisis: Gestión del Tiempo — ${positivo}% de hábitos efectivos`,
        parrafos: nivel.parrafos,
        recomendaciones: nivel.recs
      };
    }

    // TEST DISC (ID 10)
    if (ev === 10) {
      const dominante: any = this.getPerfilDominanteDisc();
      if (!dominante) return null;

      const nombresEstilo: Record<string, string> = {
        D: 'Dominancia', I: 'Influencia', S: 'Estabilidad', C: 'Cumplimiento'
      };
      const letra = (dominante.Resultado || '').split('—')[0].trim();
      const nombreEstilo = nombresEstilo[letra] || letra;

      const parrafos: string[] = [];
      if (dominante.ResultadoDescripcion) {
        parrafos.push(`Tu perfil predominante es ${letra} (${nombreEstilo}). Tu principal motivación es: ${dominante.ResultadoDescripcion}`);
      }
      if (dominante.Influye) {
        parrafos.push(`Sueles influir en otros a través de: ${dominante.Influye}`);
      }
      if (dominante.Teme) {
        parrafos.push(`Tiendes a evitar o temer: ${dominante.Teme}`);
      }

      const recomendaciones: string[] = [];
      if (dominante.Juzga) {
        recomendaciones.push(`Sueles juzgar a otros y a ti mismo/a según: ${dominante.Juzga}. Ten esto presente al evaluar a tu equipo.`);
      }
      if (dominante.BajoPresion) {
        recomendaciones.push(`Bajo presión, cuida esta tendencia: ${dominante.BajoPresion}`);
      }
      recomendaciones.push('Recuerda que no existen estilos DISC "buenos" o "malos" — cada uno representa una forma válida de actuar, y conocerlo es la base para relacionarte mejor con estilos distintos al tuyo.');

      return {
        titulo: `Análisis: Perfil predominante — ${letra} (${nombreEstilo})`,
        parrafos: parrafos.length ? parrafos : ['No se encontró una descripción detallada para este perfil.'],
        recomendaciones
      };
    }

    // TESTS POR DIMENSIONES genérico (IDs 3, 4, 6, 7, 9)
    if (this.esDimensiones()) {
      const total = res.reduce((s: number, r: any) => s + (r.Puntaje || 0), 0);
      const mejor = res.reduce((a: any, b: any) => (a.Puntaje > b.Puntaje ? a : b), res[0]);
      return {
        titulo: `Análisis: Resultados por dimensión`,
        parrafos: [
          `El análisis de tus resultados muestra una distribución de ${res.length} dimensiones evaluadas con un puntaje total de ${total} puntos.`,
          `Tu dimensión más destacada es "${mejor?.dimension || mejor?.Resultado}" con ${mejor?.Puntaje} puntos, lo que indica una fortaleza clara en esta área.`,
          `Las dimensiones con menor puntaje representan oportunidades concretas de desarrollo que, con atención y práctica, pueden convertirse en nuevas fortalezas.`
        ],
        recomendaciones: [
          `Profundiza en la dimensión "${mejor?.dimension || mejor?.Resultado}" y busca formas de aplicarla en tu contexto laboral y personal.`,
          `Trabaja con un plan de desarrollo específico para las dimensiones con menor puntaje.`,
          `Comparte estos resultados con tu coach para diseñar un plan de acción personalizado.`
        ]
      };
    }

    return null;
  }
}