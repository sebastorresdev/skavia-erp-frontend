import { Component, OnInit, inject, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { SucursalStateService } from '../../services/sucursal-state.service';
import { OrdenTrabajoPendiente } from '../../models/orden-trabajo-models';

@Component({
  selector: 'app-ordenes-trabajo-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    SelectModule,
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
      /* Fila de filtros compacta */
      .p-datatable .p-datatable-thead > tr:nth-child(2) > th {
        padding: 0.4rem 0.5rem;
      }
    }
  `]
})
export class OrdenesTrabajoPendientesComponent implements OnInit {
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private sucursalState = inject(SucursalStateService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ordenes: OrdenTrabajoPendiente[] = [];
  loading = false;
  private isInitialized = false;

  // ── Opciones de filtros ─────────────────────────────────────────────
  agendamientoOpciones = [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' },
  ];

  vencimientoOpciones = [
    { label: 'A tiempo',  value: 'atiempo',  severity: 'success' },
    { label: 'Próximo',   value: 'proximo',  severity: 'warn'    },
    { label: 'Vencido',   value: 'vencido',  severity: 'danger'  },
    { label: 'Sin fecha', value: 'sinfecha', severity: 'info'    },
  ];

  constructor() {
    effect(() => {
      const codigoSucursal = this.sucursalState.selectedSucursalCodigo();
      if (codigoSucursal && this.isInitialized) {
        setTimeout(() => this.cargarOrdenes());
      }
    });
  }

  ngOnInit() {
    this.isInitialized = true;
    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (codigoSucursal) {
      this.cargarOrdenes();
    }
  }

  cargarOrdenes() {
    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (!codigoSucursal) {
      this.ordenes = [];
      return;
    }

    this.loading = true;

    this.ordenTrabajoService.obtenerOrdenesTrabajoPendientes(codigoSucursal)
      .subscribe({
        next: (data) => {
          // Agregar campo calculado estadoVencimientoKey a cada orden para el filtro
          this.ordenes = data.map(o => ({
            ...o,
            estadoVencimientoKey: this.getSeverityKey(o.fechaVencimiento)
          }));
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Se cargaron ${data.length} órdenes pendientes`,
            life: 3000
          });
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        }
      });
  }

  // ── Limpiar todos los filtros ───────────────────────────────────────
  limpiarFiltros(table: Table) {
    table.clear();
  }

  // ── Estadísticas ────────────────────────────────────────────────────
  getOrdenesATiempo(): number {
    return this.ordenes.filter(o => this.getSeverityKey(o.fechaVencimiento) === 'atiempo').length;
  }

  getOrdenesProximas(): number {
    return this.ordenes.filter(o => this.getSeverityKey(o.fechaVencimiento) === 'proximo').length;
  }

  getOrdenesVencidas(): number {
    return this.ordenes.filter(o => this.getSeverityKey(o.fechaVencimiento) === 'vencido').length;
  }

  // ── Helpers de vencimiento ──────────────────────────────────────────
  private getSeverityKey(fechaVencimiento: string | null): string {
    if (!fechaVencimiento) return 'sinfecha';
    const dias = this.diasHastaVencimiento(fechaVencimiento);
    if (dias < 0)  return 'vencido';
    if (dias <= 2) return 'proximo';
    return 'atiempo';
  }

  private diasHastaVencimiento(fecha: string): number {
    const hoy = new Date();
    const venc = new Date(fecha);
    return Math.floor((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  getSeverity(fecha: string | null): 'success' | 'info' | 'warn' | 'danger' {
    const key = this.getSeverityKey(fecha);
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      atiempo:  'success',
      proximo:  'warn',
      vencido:  'danger',
      sinfecha: 'info',
    };
    return map[key];
  }

  getEstadoVencimiento(fecha: string | null): string {
    const map: Record<string, string> = {
      atiempo:  'A tiempo',
      proximo:  'Próximo',
      vencido:  'Vencido',
      sinfecha: 'Sin fecha',
    };
    return map[this.getSeverityKey(fecha)];
  }

  // ── Navegación ──────────────────────────────────────────────────────
  verDetalle(orden: OrdenTrabajoPendiente) {
    this.router.navigate(['skavia/ordenes-trabajo/detalle', orden.numeroOrden]);
  }

  exportarExcel() {
    console.log('Exportar a Excel');
  }
}
