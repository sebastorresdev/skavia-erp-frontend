// src/app/features/ordenes-trabajo/services/sucursal-state.service.ts

import { Injectable, signal, computed } from '@angular/core';

/**
 * Servicio compartido para manejar el estado de la sucursal seleccionada
 * en el módulo de Órdenes de Trabajo.
 *
 * Este servicio permite que el Toolbar y los componentes hijos
 * compartan el estado de la sucursal seleccionada de forma reactiva.
 */
@Injectable({
  providedIn: 'root'
})
export class SucursalStateService {

  // Signal privado para el código de sucursal
  private _selectedSucursalCodigo = signal<string>('');

  // Signal público de solo lectura
  selectedSucursalCodigo = this._selectedSucursalCodigo.asReadonly();

  /**
   * Establece la sucursal seleccionada
   * @param codigo - Código de la sucursal
   */
  setSucursal(codigo: string): void {
    this._selectedSucursalCodigo.set(codigo);
    console.log('🏢 Sucursal seleccionada:', codigo);
  }

  /**
   * Obtiene el código de la sucursal actual
   */
  getSucursalCodigo(): string {
    return this._selectedSucursalCodigo();
  }

  /**
   * Limpia la sucursal seleccionada
   */
  clearSucursal(): void {
    this._selectedSucursalCodigo.set('');
  }
}
