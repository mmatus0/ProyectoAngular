import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/components/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { UsuariosListComponent } from './features/usuarios/components/usuarios-list/usuarios-list.component';
import { BibliotecaComponent } from './features/biblioteca/components/biblioteca/biblioteca.component';
import { PerfilComponent } from './features/perfil/components/perfil/perfil.component';
import { FaqComponent } from './features/faq/components/faq/faq.component';
import { InstitucionesComponent } from './features/instituciones/components/instituciones/instituciones.component';
import { authGuard } from './core/guards/auth.guard';

// Sesiones
import { SesionesComponent } from './features/sesiones/components/sesiones/sesiones.component';
import { SesionDetalleComponent } from './features/sesiones/components/sesion-detalle/sesion-detalle.component';
import { SesionVistaComponent } from './features/sesiones/components/sesion-vista/sesion-vista.component';

// Herramientas
import { HerramientasComponent } from './features/herramientas/components/herramientas/herramientas.component';
import { HerramientaAsignarComponent } from './features/herramientas/components/herramienta-asignar/herramienta-asignar.component';
import { HerramientaDetalleComponent } from './features/herramientas/components/herramienta-detalle/herramienta-detalle.component';

// Evaluaciones
import { EvaluacionesComponent } from './features/evaluaciones/components/evaluaciones/evaluaciones.component';
import { EvaluacionAsignarComponent } from './features/evaluaciones/components/evaluacion-asignar/evaluacion-asignar.component';
import { MisEvaluacionesComponent } from './features/mis-evaluaciones/components/mis-evaluaciones/mis-evaluaciones.component';
import { EvaluacionTestComponent } from './features/mis-evaluaciones/components/evaluacion-test/evaluacion-test.component';
import { EvaluacionResultadosComponent } from './features/mis-evaluaciones/components/evaluacion-resultados/evaluacion-resultados.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '',                             redirectTo: 'dashboard',             pathMatch: 'full' },
      { path: 'dashboard',                    component: DashboardComponent,        canActivate: [authGuard] },
      { path: 'usuarios',                     component: UsuariosListComponent,     canActivate: [authGuard] },
      { path: 'biblioteca',                   component: BibliotecaComponent,       canActivate: [authGuard] },
      { path: 'perfil',                       component: PerfilComponent,           canActivate: [authGuard] },
      { path: 'faq',                          component: FaqComponent,              canActivate: [authGuard] },
      { path: 'instituciones',                component: InstitucionesComponent,    canActivate: [authGuard] },

      // Sesiones
      { path: 'sesiones',                     component: SesionesComponent,         canActivate: [authGuard] },
      { path: 'sesiones/:id/detalle',         component: SesionDetalleComponent,    canActivate: [authGuard] },
      { path: 'sesiones/:id/vista',           component: SesionVistaComponent,      canActivate: [authGuard] },

      // Herramientas
      { path: 'herramientas',                 component: HerramientasComponent,     canActivate: [authGuard] },
      { path: 'herramientas/asignar',         component: HerramientaAsignarComponent, canActivate: [authGuard] },
      { path: 'herramientas/:id/detalle',     component: HerramientaDetalleComponent, canActivate: [authGuard] },

      // Evaluaciones
      { path: 'evaluaciones',                 component: EvaluacionesComponent,     canActivate: [authGuard] },
      { path: 'evaluaciones/asignar',         component: EvaluacionAsignarComponent, canActivate: [authGuard] },
      { path: 'mis-evaluaciones',             component: MisEvaluacionesComponent,  canActivate: [authGuard] },
      { path: 'mis-evaluaciones/:id/test',    component: EvaluacionTestComponent,   canActivate: [authGuard] },
      { path: 'mis-evaluaciones/:id/resultados', component: EvaluacionResultadosComponent, canActivate: [authGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' }
];