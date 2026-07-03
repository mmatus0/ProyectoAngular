export interface Biblioteca {
  id: number;
  titulo: string;
  descripcion?: string;
  tipo: 'digital' | 'audiovisual';
  url?: string;
  archivo?: string;
  estado?: string;
}
