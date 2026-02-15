import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { SucursalStateService } from '../../services/sucursal-state.service';
import { OrdenTrabajoPendiente } from '../../models/orden-trabajo-models';

@Component({
  selector: 'app-ordenes-trabajo-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './ordenes-trabajo-pendientes.html',
  styles: [`
    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        font-weight: 600;
      }

      .p-iconfield input {
        padding-left: 2.5rem;
      }
    }
  `]
})
export class OrdenesTrabajoPendientesComponent implements OnInit {
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private sucursalState = inject(SucursalStateService);
  private messageService = inject(MessageService);

  ordenes: OrdenTrabajoPendiente[] = [];
  loading: boolean = false;

  constructor() {
    // Reaccionar a cambios en la sucursal seleccionada
    effect(() => {
      const codigoSucursal = this.sucursalState.selectedSucursalCodigo();
      if (codigoSucursal) {
        this.cargarOrdenes();
      }
    });
  }

  ngOnInit() {
    // Cargar órdenes si ya hay una sucursal seleccionada
    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (codigoSucursal) {
      this.cargarOrdenes();
    } else {
      this.loading = false;
    }
  }

  cargarOrdenes() {
    const codigoSucursal = this.sucursalState.getSucursalCodigo();

    if (!codigoSucursal) {
      console.warn('⚠️ No se puede cargar órdenes sin código de sucursal');
      this.ordenes = [];
      this.loading = false;
      return;
    }

    this.loading = true;

    this.ordenTrabajoService.obtenerOrdenesTrabajoPendientes(codigoSucursal)
      .subscribe({
        next: (data) => {
          this.ordenes = data;
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Se cargaron ${data.length} órdenes pendientes`,
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error al cargar órdenes:', error);
          this.ordenes = [];
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las órdenes de trabajo',
            life: 5000
          });
        }
      });
  }

  getSeverity(fechaVencimiento: string | null): 'success' | 'info' | 'warn' | 'danger' {
    if (!fechaVencimiento) return 'info';

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferenciaDias = Math.floor((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) return 'danger';
    if (diferenciaDias <= 2) return 'warn';
    return 'success';
  }

  getEstadoVencimiento(fechaVencimiento: string | null): string {
    if (!fechaVencimiento) return 'Sin fecha';

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferenciaDias = Math.floor((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) return 'Vencido';
    if (diferenciaDias === 0) return 'Hoy';
    if (diferenciaDias <= 2) return 'Próximo';
    return 'A tiempo';
  }

  exportarExcel() {
    // Implementar exportación a Excel
    console.log('Exportar a Excel');
  }

  verDetalle(orden: OrdenTrabajoPendiente) {
    console.log('Ver detalle de orden:', orden);
  }

  getOrdenesATiempo(): number {
    return this.ordenes.filter(o => this.getSeverity(o.fechaVencimiento) === 'success').length;
  }

  getOrdenesProximas(): number {
    return this.ordenes.filter(o => this.getSeverity(o.fechaVencimiento) === 'warn').length;
  }

  getOrdenesVencidas(): number {
    return this.ordenes.filter(o => this.getSeverity(o.fechaVencimiento) === 'danger').length;
  }
}
