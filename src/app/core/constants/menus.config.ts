import { SystemModule } from '../models/system-module';

export const MODULE_MENUS: SystemModule[] = [
  // =========================
  // ÓRDENES DE TRABAJO
  // =========================
  {
    id: 'work-orders',
    route: '/skavia/ordenes-trabajo',
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
          { label: 'Bandeja', routerLink: '/skavia/ordenes-trabajo/bandeja' },
          { label: 'Pendientes', routerLink: '/skavia/ordenes-trabajo/pendientes' },
          { label: 'Finalizadas', routerLink: '/skavia/ordenes-trabajo/finalizadas' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Por Técnico', routerLink: '/skavia/ordenes-trabajo/reportes/por-tecnico' },
          { label: 'Productividad', routerLink: '/skavia/ordenes-trabajo/reportes/productividad' },
          { label: 'Tiempos de Resolución', routerLink: '/skavia/ordenes-trabajo/reportes/tiempos-resolucion' },
        ],
      },
      {
        label: 'Configuración',
        items: [
          { label: 'Tipos de Órdenes', routerLink: '/skavia/ordenes-trabajo/config/tipos' },
          { label: 'Prioridades', routerLink: '/skavia/ordenes-trabajo/config/prioridades' },
          { label: 'Importaciones', routerLink: '/skavia/ordenes-trabajo/importaciones' },
        ],
      },
    ],
  },

  // =========================
  // INVENTARIO
  // =========================
  {
    id: 'inventory',
    route: '/skavia/inventario',
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
          { label: 'Productos', routerLink: '/skavia/inventario/productos' },
          { label: 'Categorías', routerLink: '/skavia/inventario/categorias' },
          { label: 'Almacenes', routerLink: '/skavia/inventario/almacenes' },
        ],
      },
      {
        label: 'Movimientos',
        items: [
          { label: 'Ingresos', routerLink: '/skavia/inventario/ingresos' },
          { label: 'Salidas', routerLink: '/skavia/inventario/salidas' },
          { label: 'Transferencias', routerLink: '/skavia/inventario/transferencias' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Stock Actual', routerLink: '/skavia/inventario/reportes/stock' },
          { label: 'Kardex', routerLink: '/skavia/inventario/reportes/kardex' },
        ],
      },
    ],
  },

  // =========================
  // VENTAS
  // =========================
  {
    id: 'sales',
    route: '/skavia/ventas',
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
          { label: 'Cotizaciones', routerLink: '/skavia/ventas/cotizaciones' },
          { label: 'Pedidos', routerLink: '/skavia/ventas/pedidos' },
          { label: 'Facturas', routerLink: '/skavia/ventas/facturas' },
        ],
      },
      {
        label: 'Clientes',
        items: [
          { label: 'Listado', routerLink: '/skavia/ventas/clientes' },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Ventas Mensuales', routerLink: '/skavia/ventas/reportes/mensuales' },
          { label: 'Top Clientes', routerLink: '/skavia/ventas/reportes/top-clientes' },
        ],
      },
    ],
  },

  // =========================
  // COMPRAS
  // =========================
  {
    id: 'purchases',
    route: '/skavia/compras',
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
          { label: 'Órdenes de Compra', routerLink: '/skavia/compras/ordenes' },
          { label: 'Recepciones', routerLink: '/skavia/compras/recepciones' },
        ],
      },
      {
        label: 'Proveedores',
        icon: 'pi pi-truck',
        items: [
          { label: 'Listado', routerLink: '/skavia/compras/proveedores' },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-line',
        items: [
          { label: 'Compras por Proveedor', routerLink: '/skavia/compras/reportes/por-proveedor' },
        ],
      },
    ],
  },

  // =========================
  // CONTABILIDAD
  // =========================
  {
    id: 'accounting',
    route: '/skavia/contabilidad',
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
          { label: 'Asientos', routerLink: '/skavia/contabilidad/asientos' },
          { label: 'Plan Contable', routerLink: '/skavia/contabilidad/plan-contable' },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Balance General', routerLink: '/skavia/contabilidad/reportes/balance' },
          { label: 'Estado de Resultados', routerLink: '/skavia/contabilidad/reportes/resultados' },
        ],
      },
    ],
  },

  // =========================
  // RRHH
  // =========================
  {
    id: 'hr',
    route: '/skavia/recursos-humanos',
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
          { label: 'Listado', routerLink: '/skavia/recursos-humanos/empleados' },
          { label: 'Asistencias', routerLink: '/skavia/recursos-humanos/asistencias' },
        ],
      },
      {
        label: 'Nómina',
        icon: 'pi pi-wallet',
        items: [
          { label: 'Planillas', routerLink: '/skavia/recursos-humanos/planillas' },
        ],
      },
    ],
  },

  // =========================
  // CONFIGURACIÓN
  // =========================
  {
    id: 'settings',
    route: '/skavia/configuracion',
    name: 'Configuración',
    description: 'Configuración del sistema',
    icon: 'pi-cog',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/40 dark:to-gray-800/20',
    requiredRoles: ['Admin'],
    items: [
      { label: 'Usuarios', routerLink: '/skavia/usuarios', icon: 'pi pi-users' },
      { label: 'Roles', routerLink: '/skavia/roles', icon: 'pi pi-shield' },
      { label: 'Empresas', routerLink: '/skavia/empresas', icon: 'pi pi-building' },
      { label: 'Parámetros', routerLink: '/skavia/configuracion/parametros', icon: 'pi pi-sliders-h' },
    ],
  },

  // =========================
  // ACERCA DE
  // =========================
  {
    id: 'about',
    route: '/skavia/acerca-de',
    name: 'Acerca de',
    description: 'Información del sistema',
    icon: 'pi-info-circle',
    iconColor: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/40 dark:to-cyan-800/20',
    items: [
      { label: 'Información', routerLink: '/skavia/acerca-de' },
    ],
  },
];
