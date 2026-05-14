import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  authService = inject(AuthService);
  user = this.authService.currentUser;

  esAdmin(): boolean {
    return this.user()?.rol_id === 1;
  }

  esCoach(): boolean {
    return this.user()?.rol_id === 2;
  }

  esCliente(): boolean {
    return this.user()?.rol_id === 3;
  }

  esAdminOCoach(): boolean {
    return this.esAdmin() || this.esCoach();
  }
}