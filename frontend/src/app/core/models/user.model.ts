export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
  rol_id?: number;
  usuario?: string;
  avatar?: string;
  token?: string;
}