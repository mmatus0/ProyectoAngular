import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    login:    ['', Validators.required],
    password: ['', Validators.required]
  });

  error    = signal<string | null>(null);
  loading  = signal(false);
  showPassword = false;

  login(): void {
    if (this.form.invalid) return;

    const { login, password } = this.form.value;
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(login!, password!).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.mensaje ?? 'Credenciales incorrectas');
      }
    });
  }
}