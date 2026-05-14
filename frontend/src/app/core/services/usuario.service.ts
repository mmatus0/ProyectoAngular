import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<User>) {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: number, data: Partial<User>) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
