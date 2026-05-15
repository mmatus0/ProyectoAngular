import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  error        = signal<string | null>(null);
  loading      = signal(false);
  showPassword = false;

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['',  Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    // AuthService.login() espera (login, password) — se pasa el email como "login"
    this.authService.login(email!, password!).subscribe({
      next:  () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error.set('Credenciales incorrectas. Intenta nuevamente.');
        this.loading.set(false);
      }
    });
  }
}
