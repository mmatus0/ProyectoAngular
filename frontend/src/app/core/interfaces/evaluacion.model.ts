export interface Evaluacion {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  estado?: string;
  fecha_creacion?: string;
}

export interface EvaluacionUsuario {
  id: number;
  evaluacion_id: number;
  user_id: number;
  estado: 'pendiente' | 'en_proceso' | 'finalizado';
  fecha_asignacion?: string;
  fecha_finalizacion?: string;
}
