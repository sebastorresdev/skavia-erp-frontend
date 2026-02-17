import { Routes } from '@angular/router';

export const OrdenesTrabajoRoutes: Routes = [
  {
    path: 'pendientes',
    loadComponent: () =>
      import('./pages/ordenes-trabajo-pendientes/ordenes-trabajo-pendientes').then((m) => m.OrdenesTrabajoPendientesComponent),
  },
  {
    path: 'importaciones',
    loadComponent: () =>
      import('./pages/importar-ordenes-trabajo/importar-ordenes-trabajo').then((m) => m.ImportarOrdenesTrabajoComponent),
  }
];
