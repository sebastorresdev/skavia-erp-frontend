import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta de login (pública)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },

  {
    path: 'skavia',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((r) => r.settingsRoutes),
      },
      {
        path: 'ordenes-trabajo',
        loadChildren: () =>
          import('./features/work-order-management/work-order-management.routes').then(
            (r) => r.workOrderManagementRoutes,
          ),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features/inventory/inventory').then((m) => m.Inventory),
      },
    ],
  },

  // Redirección por defecto al dashboard
  {
    path: '',
    redirectTo: '/skavia',
    pathMatch: 'full',
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: '/skavia',
  },
];
