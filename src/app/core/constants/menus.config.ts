import { SystemModule } from '../models/system-module';

export const MODULE_MENUS: SystemModule[] = [
  // =========================
  // ÓRDENES DE TRABAJO
  // =========================
  {
    id: 'work-orders',
    route: '/skavia/work-orders',
    name: 'Órdenes de Trabajo',
    description: 'Gestión y seguimiento de órdenes de trabajo',
    icon: 'pi-file-edit',
    iconColor: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20',
    requiredPermissions: ['Permissions.OrdenTrabajo'],
    items: [
      {
        label: 'Órdenes',
        items: [
          { label: 'Bandeja', routerLink: '/skavia/work-orders/inbox' },
          { label: 'Pendientes', routerLink: '/skavia/work-orders/pending' },
          { label: 'Finalizadas', routerLink: '/skavia/work-orders/finalized' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Por Técnico', routerLink: '/skavia/work-orders/reports/by-technician' },
          { label: 'Productividad', routerLink: '/skavia/work-orders/reports/productivity' },
          { label: 'Tiempos de Resolución', routerLink: '/skavia/work-orders/reports/resolution-times' },
        ],
      },
      {
        label: 'Configuración',
        items: [
          { label: 'Tipos de Órdenes', routerLink: '/skavia/work-orders/config/types' },
          { label: 'Prioridades', routerLink: '/skavia/work-orders/config/priorities' },
          { label: 'Importaciones', routerLink: '/skavia/work-orders/imports' },
        ],
      },
    ],
  },

  // =========================
  // INVENTARIO
  // =========================
  {
    id: 'inventory',
    route: '/skavia/inventory',
    name: 'Inventario',
    description: 'Gestión de stock, productos y almacenes',
    icon: 'pi-box',
    iconColor: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/20',
    requiredPermissions: ['Permissions.Inventario'],
    items: [
      {
        label: 'Catálogos',
        items: [
          { label: 'Productos', routerLink: '/skavia/inventory/products' },
          { label: 'Categorías', routerLink: '/skavia/inventory/categories' },
          { label: 'Almacenes', routerLink: '/skavia/inventory/warehouses' },
        ],
      },
      {
        label: 'Movimientos',
        items: [
          { label: 'Ingresos', routerLink: '/skavia/inventory/in' },
          { label: 'Salidas', routerLink: '/skavia/inventory/out' },
          { label: 'Transferencias', routerLink: '/skavia/inventory/transfers' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Stock Actual', routerLink: '/skavia/inventory/reports/stock' },
          { label: 'Kardex', routerLink: '/skavia/inventory/reports/kardex' },
        ],
      },
    ],
  },

  // =========================
  // VENTAS
  // =========================
  {
    id: 'sales',
    route: '/skavia/sales',
    name: 'Ventas',
    description: 'Gestión de ventas y facturación',
    icon: 'pi-shopping-cart',
    iconColor: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/20',
    requiredPermissions: ['Permissions.Ventas'],
    items: [
      {
        label: 'Operaciones',
        items: [
          { label: 'Cotizaciones', routerLink: '/skavia/sales/quotes' },
          { label: 'Pedidos', routerLink: '/skavia/sales/orders' },
          { label: 'Facturas', routerLink: '/skavia/sales/invoices' },
        ],
      },
      {
        label: 'Clientes',
        items: [
          { label: 'Listado', routerLink: '/skavia/sales/customers' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Ventas Mensuales', routerLink: '/skavia/sales/reports/monthly' },
          { label: 'Top Clientes', routerLink: '/skavia/sales/reports/top-customers' },
        ],
      },
    ],
  },

  // =========================
  // COMPRAS
  // =========================
  {
    id: 'purchases',
    route: '/skavia/purchases',
    name: 'Compras',
    description: 'Gestión de compras y proveedores',
    icon: 'pi-shopping-bag',
    iconColor: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/20',
    requiredPermissions: ['Permissions.Compras'],
    items: [
      {
        label: 'Operaciones',
        icon: 'pi pi-file',
        items: [
          { label: 'Órdenes de Compra', routerLink: '/skavia/purchases/orders' },
          { label: 'Recepciones', routerLink: '/skavia/purchases/receipts' },
        ],
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-truck',
        items: [
          { label: 'Listado', routerLink: '/skavia/purchases/providers' },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-line',
        items: [
          { label: 'Compras por Proveedor', routerLink: '/skavia/purchases/reports/by-provider' },
        ],
      },
    ],
  },

  // =========================
  // CONTABILIDAD
  // =========================
  {
    id: 'accounting',
    route: '/skavia/accounting',
    name: 'Contabilidad',
    description: 'Gestión contable y financiera',
    icon: 'pi-calculator',
    iconColor: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/20',
    requiredPermissions: ['Permissions.Contabilidad'],
    items: [
      {
        label: 'Contabilidad',
        icon: 'pi pi-book',
        items: [
          { label: 'Asientos', routerLink: '/skavia/accounting/entries' },
          { label: 'Plan Contable', routerLink: '/skavia/accounting/chart' },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Balance General', routerLink: '/skavia/accounting/reports/balance' },
          { label: 'Estado de Resultados', routerLink: '/skavia/accounting/reports/income' },
        ],
      },
    ],
  },

  // =========================
  // RRHH
  // =========================
  {
    id: 'hr',
    route: '/skavia/hr',
    name: 'Recursos Humanos',
    description: 'Gestión de personal y nómina',
    icon: 'pi-users',
    iconColor: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-800/20',
    requiredPermissions: ['Permissions.RecursosHumanos'],
    items: [
      {
        label: 'Empleados',
        icon: 'pi pi-id-card',
        items: [
          { label: 'Listado', routerLink: '/skavia/hr/employees' },
          { label: 'Asistencias', routerLink: '/skavia/hr/attendance' },
        ],
      },
      {
        label: 'Nómina',
        icon: 'pi pi-wallet',
        items: [
          { label: 'Planillas', routerLink: '/skavia/hr/payroll' },
        ],
      },
    ],
  },

  // =========================
  // CONFIGURACIÓN
  // =========================
  {
    id: 'settings',
    route: '/skavia/settings',
    name: 'Configuración',
    description: 'Configuración del sistema',
    icon: 'pi-cog',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-800/20',
    requiredRoles: ['Admin'],
    items: [
      { label: 'Usuarios', routerLink: '/skavia/users', icon: 'pi pi-users' },
      { label: 'Roles', routerLink: '/skavia/roles', icon: 'pi pi-shield' },
      { label: 'Compañías', routerLink: '/skavia/companies', icon: 'pi pi-building' },
      { label: 'Parámetros', routerLink: '/skavia/settings', icon: 'pi pi-sliders-h' },
    ],
  },

  // =========================
  // ACERCA DE
  // =========================
  {
    id: 'about',
    route: '/skavia/about',
    name: 'Acerca de',
    description: 'Información del sistema',
    icon: 'pi-info-circle',
    iconColor: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-800/20',
    items: [
      { label: 'Información', routerLink: '/skavia/about' },
    ],
  },
];
