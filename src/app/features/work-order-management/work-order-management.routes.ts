import { Routes } from '@angular/router';

export const workOrderManagementRoutes: Routes = [
  {
    path: 'pending',
    loadComponent: () =>
      import('./pages/pending-work-order/pending-work-order').then((m) => m.PendingWorkOrder),
  },
  {
    path: 'finalize',
    loadComponent: () =>
      import('./pages/finalize-work-order/finalize-work-order').then((m) => m.FinalizeWorkOrder),
  },
  {
    path: 'imports',
    loadComponent: () =>
      import('./pages/imported-work-orders/imported-work-orders').then((m) => m.ImportedWorkOrders),
  },
];
