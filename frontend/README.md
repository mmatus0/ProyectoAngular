# EvalCoach — Frontend Angular

Plataforma web de gestión de evaluaciones y contenidos digitales.

## Requisitos previos

- Node.js v18+
- npm v9+
- Angular CLI v17+

```bash
npm install -g @angular/cli
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del backend
# Edita: src/environments/environment.ts
# Cambia apiUrl al puerto donde corre tu Laravel
```

## Configuración del entorno

`src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // ajusta el puerto si es necesario
};
```

## Ejecutar en desarrollo

```bash
ng serve -o
# Abre http://localhost:4200
```

## Estructura del proyecto

```
src/app/
├── core/               # Lógica transversal (modelos, servicios, guards, interceptors)
├── shared/             # Componentes y pipes reutilizables (sidebar, topbar, filtro.pipe)
├── layout/             # Shell principal (sidebar + topbar + router-outlet)
├── features/           # Un módulo por funcionalidad
│   ├── auth/login      # Login con Reactive Forms + JWT
│   ├── dashboard/
│   ├── usuarios/
│   ├── evaluaciones/
│   ├── mis-evaluaciones/
│   ├── disc/
│   ├── sesiones/
│   ├── herramientas/
│   ├── biblioteca/
│   ├── perfil/
│   └── faq/
└── app.routes.ts       # Rutas con lazy loading
```

## Dependencias principales

| Paquete | Uso |
|---|---|
| `@angular/core` v17 | Framework principal |
| `bootstrap` v5.3 | Estilos y componentes UI |
| `bootstrap-icons` v1.11 | Íconos del sidebar y UI |
| `jwt-decode` v4 | Decodificar el token JWT |

## Notas para el desarrollo

- El interceptor `token.interceptor.ts` agrega automáticamente el header `Authorization: Bearer <token>` a todos los requests HTTP.
- El guard `auth.guard.ts` redirige a `/login` si no hay token en localStorage.
- Todos los componentes son **standalone** (sin NgModules).
- El estado se maneja con **Signals** de Angular 17.
- Cada feature sigue el patrón: `list.component` + `modal.component` + `service` + `model`.
