export interface ImportarOrdenTrabajoResponse {
  totalTareasImportadas: number;
  totalTareasRepetidas: number;
  totalOmitidos: number;
  tareasOmitidas: TareaOmitida[];
}

export interface TareaOmitida {
  numeroTarea: string;
  motivo: string;
}

// ===============================
// ÓRDENES PENDIENTES
// ===============================
export interface OrdenTrabajoPendiente {
  tareaId: string;
  numeroOrden: string;
  codigoCliente: string;
  nombreCompleto: string;
  provincia: string;
  distrito: string;
  agendamientoLinea: string;
  numeroTarea: string;
  descripcionTarea: string;
  fechaVencimiento: string | null;
}

// ===============================
// DETALLE ORDEN DE TRABAJO
// ===============================
export interface DetalleOrdenTrabajo {
  ordenId: string;
  numeroOrden: string;
  codigoCliente: string;
  nombreCompleto: string;
  direccion: string;
  observacionDireccion: string | null;
  telefono: string;
  departamento: string;
  provincia: string;
  distrito: string;
  codigoPostal: string;
  agendamientoLinea: string;
  tipoCliente: string;
  estadoOrdenTrabajo: string;
  prioridad: string;
  recursos: string | null;
  coordX: string;
  coordY: string;
  sucursalNombre: string;
  tareas: TareaDetalle[];
  visitasTecnicas: VisitaTecnica[];
  interacciones: Interaccion[];
}

export interface TareaDetalle {
  tareaId: string;
  numeroTarea: string;
  tipoServicio: string;
  descripcion: string | null;
  fechaCreacion: string;
  estadoTarea: string;
  atendidoPor: string | null;
  fechaAtencion: string | null;
}

export interface VisitaTecnica {
  visitaTecnicaId: string;
  fechaCreacion: string;
  tecnicoAsignado: string;
  detalles: string | null;
  fechaVisita: string;
  estadoVisita: string;
}

export interface Interaccion {
  estado: string;
  descripcion: string;
  usuario: string;
  fechaRegistro: string;
}

// ===============================
// REQUESTS
// ===============================
export interface CrearVisitaTecnicaRequest {
  fechaVisita: string;
  tecnicoAsignado: string;
}

export interface CrearInteraccionRequest {
  estadoContacto: string;
  descripcion: string;
}
