export interface Sesion {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha?: string;
  estado?: string;
  coach_id?: number;
  cliente_id?: number;
}
