import { Injectable, signal, inject, effect} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public isAuthenticated = signal<boolean>(false);
  public usuario = signal<any>(null);
  public token = signal<string | null>(null);

  private http   = inject(HttpClient);
  private router = inject(Router);

  private urlLogin = `${environment.apiUrl}/login`;

  constructor() {
  this.token.set(localStorage.getItem('token'));
  this.isAuthenticated.set(!!this.token());

  const storedUser = localStorage.getItem('usuario');
  if (storedUser) {
    this.usuario.set(JSON.parse(storedUser));
  }

  effect(() => {
    const u = this.usuario();
    if (u) {
      console.log('[AuthService] Usuario activo:', u.nombre, '| Rol:', u.rol);
    } else {
      console.log('[AuthService] Sesión cerrada.');
    }
  });
}

  login(login: string, password: string) {
    const userLogin = { login, password };
    return this.http.post(this.urlLogin, userLogin).pipe(
      map((resp: any) => {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));
        this.token.set(resp.token);
        this.isAuthenticated.set(true);
        this.usuario.set(resp.usuario);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  // Punto único y centralizado para construir las cabeceras HTTP autenticadas.
  // Reemplaza los getAuthHeaders() privados que existían duplicados en cada servicio.
  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.token()}` });
  }

  getRol(): string {
  const usuario = this.usuario();
  return usuario?.rol?.toLowerCase() || '';
}

esAdmin(): boolean {
  const rol = this.getRol();
  return rol === 'administrador' || rol === 'admin';
}

esCoach(): boolean {
  return this.getRol() === 'coach';
}

esCliente(): boolean {
  return this.getRol() === 'cliente';
}
}