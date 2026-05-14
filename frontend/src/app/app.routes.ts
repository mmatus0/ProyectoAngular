import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./features/evaluaciones/evaluaciones-list/evaluaciones-list.component').then(m => m.EvaluacionesListComponent)
      },
      {
        path: 'mis-evaluaciones',
        loadComponent: () =>
          import('./features/mis-evaluaciones/mis-evaluaciones.component').then(m => m.MisEvaluacionesComponent)
      },
      {
        path: 'disc',
        loadComponent: () =>
          import('./features/disc/disc-list/disc-list.component').then(m => m.DiscListComponent)
      },
      {
        path: 'sesiones',
        loadComponent: () =>
          import('./features/sesiones/sesiones-list/sesiones-list.component').then(m => m.SesionesListComponent)
      },
      {
        path: 'herramientas',
        loadComponent: () =>
          import('./features/herramientas/herramientas-list/herramientas-list.component').then(m => m.HerramientasListComponent)
      },
      {
        path: 'biblioteca',
        loadComponent: () =>
          import('./features/biblioteca/biblioteca.component').then(m => m.BibliotecaComponent)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/faq/faq.component').then(m => m.FaqComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
