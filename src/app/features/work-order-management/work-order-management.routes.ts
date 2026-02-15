import { Routes } from '@angular/router';

export const workOrderManagementRoutes: Routes = [
  {
    path: 'bandeja',
    loadComponent: () =>
      import('./pages/pending-work-order/pending-work-order').then((m) => m.PendingWorkOrder),
  },
  {
    path: 'pendientes',
    loadComponent: () =>
      import('./pages/pending-work-order/pending-work-order').then((m) => m.PendingWorkOrder),
  },
  {
    path: 'finalizadas',
    loadComponent: () =>
      import('./pages/finalize-work-order/finalize-work-order').then((m) => m.FinalizeWorkOrder),
  },
  {
    path: 'importaciones',
    loadComponent: () =>
      import('./pages/imported-work-orders/imported-work-orders').then((m) => m.ImportedWorkOrders),
  },
];
