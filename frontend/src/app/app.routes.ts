import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UsuariosListComponent } from './features/usuarios/usuarios-list/usuarios-list.component';
import { EvaluacionesListComponent } from './features/evaluaciones/evaluaciones-list/evaluaciones-list.component';
import { MisEvaluacionesComponent } from './features/mis-evaluaciones/mis-evaluaciones.component';
import { DiscListComponent } from './features/disc/disc-list/disc-list.component';
import { SesionesListComponent } from './features/sesiones/sesiones-list/sesiones-list.component';
import { HerramientasListComponent } from './features/herramientas/herramientas-list/herramientas-list.component';
import { BibliotecaComponent } from './features/biblioteca/biblioteca.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { FaqComponent } from './features/faq/faq.component';
import { InstitucionesComponent } from './features/instituciones/instituciones.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Rutas protegidas dentro del layout principal
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '',             redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',    component: DashboardComponent,        canActivate: [authGuard] },
      { path: 'usuarios',     component: UsuariosListComponent,      canActivate: [authGuard] },
      { path: 'evaluaciones', component: EvaluacionesListComponent,  canActivate: [authGuard] },
      { path: 'mis-evaluaciones', component: MisEvaluacionesComponent, canActivate: [authGuard] },
      { path: 'disc',         component: DiscListComponent,          canActivate: [authGuard] },
      { path: 'sesiones',     component: SesionesListComponent,      canActivate: [authGuard] },
      { path: 'herramientas', component: HerramientasListComponent,  canActivate: [authGuard] },
      { path: 'biblioteca',   component: BibliotecaComponent,        canActivate: [authGuard] },
      { path: 'perfil',       component: PerfilComponent,            canActivate: [authGuard] },
      { path: 'faq',          component: FaqComponent,               canActivate: [authGuard] },
      { path: 'instituciones',component: InstitucionesComponent,     canActivate: [authGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' }
];