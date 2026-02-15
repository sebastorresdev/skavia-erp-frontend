import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import {
  ImportarOrdenTrabajoResponse,
  OrdenTrabajoPendiente,
  DetalleOrdenTrabajo,
  CrearVisitaTecnicaRequest,
  CrearInteraccionRequest,
} from '../models/orden-trabajo-models';

@Injectable({
  providedIn: 'root',
})
export class OrdenTrabajoService {
  private readonly baseUrl = environment.baseUrl + '/ordenes-trabajo';

  constructor(private http: HttpClient) {}

  // ===============================
  // IMPORTAR ÓRDENES DE TRABAJO
  // ===============================
  importarOrdenesTrabajo(
    file: File
  ): Observable<ImportarOrdenTrabajoResponse[]> {
    const formData = new FormData();
    formData.append('formFile', file);

    return this.http.post<ImportarOrdenTrabajoResponse[]>(
      `${this.baseUrl}/importar`,
      formData
    );
  }

  // ===============================
  // ÓRDENES PENDIENTES
  // ===============================
  obtenerOrdenesTrabajoPendientes(
    codigoSucursal: string
  ): Observable<OrdenTrabajoPendiente[]> {
    return this.http.get<OrdenTrabajoPendiente[]>(
      `${this.baseUrl}/pendientes/${codigoSucursal}`
    );
  }

  // ===============================
  // DETALLE DE ORDEN
  // ===============================
  obtenerDetalleOrdenTrabajo(
    codigoOrden: string,
    codigoSucursal: string
  ): Observable<DetalleOrdenTrabajo> {
    return this.http.get<DetalleOrdenTrabajo>(
      `${this.baseUrl}/${codigoOrden}/detalle/${codigoSucursal}`
    );
  }

  // ===============================
  // CREAR VISITA TÉCNICA
  // ===============================
  crearVisitaTecnica(
    ordenTrabajoId: string,
    codigoSucursal: string,
    payload: CrearVisitaTecnicaRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${ordenTrabajoId}/visita-tecnica/${codigoSucursal}`,
      payload
    );
  }

  // ===============================
  // EDITAR VISITA TÉCNICA
  // ===============================
  editarVisitaTecnica(
    visitaTecnicaId: string,
    codigoSucursal: string,
    payload: CrearVisitaTecnicaRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/visita-tecnica/${visitaTecnicaId}/${codigoSucursal}`,
      payload
    );
  }

  // ===============================
  // CREAR INTERACCIÓN
  // ===============================
  crearInteraccion(
    ordenTrabajoId: string,
    codigoSucursal: string,
    payload: CrearInteraccionRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${ordenTrabajoId}/interaccion/${codigoSucursal}`,
      payload
    );
  }
}
