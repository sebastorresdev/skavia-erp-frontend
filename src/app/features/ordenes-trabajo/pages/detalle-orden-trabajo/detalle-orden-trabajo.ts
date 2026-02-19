import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Services y modelos
import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { SucursalStateService } from '../../services/sucursal-state.service';
import {
  DetalleOrdenTrabajo,
  CrearVisitaTecnicaRequest,
  CrearInteraccionRequest,
} from '../../models/orden-trabajo-models';

enum EstadoVisita {
  Agendada = 1,
  Completada = 2,
  Cancelada = 4,
}

@Component({
  selector: 'app-detalle-orden-trabajo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    TimelineModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    SelectModule,
    ToastModule,
    SkeletonModule,
    Tooltip,
  ],
  providers: [MessageService],
  templateUrl: './detalle-orden-trabajo.html',
  styles: [`
    :host ::ng-deep {
      .p-card .p-card-body {
        padding: 1.5rem;
      }

      .p-card .p-card-content {
        padding: 0;
      }

      /* DatePicker sobre el dialog */
      .p-datepicker {
        z-index: 1100 !important;
      }

      .p-datepicker-panel {
        z-index: 1100 !important;
      }
    }
  `]
})
export class DetalleOrdenTrabajoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private sucursalState = inject(SucursalStateService);
  private messageService = inject(MessageService);

  detalle = signal<DetalleOrdenTrabajo | null>(null);
  loading = signal(true);

  // Dialogs
  showDialogVisita = signal(false);
  showDialogInteraccion = signal(false);

  // Forms
  visitaForm: CrearVisitaTecnicaRequest = {
    fechaVisita: '',
    tecnicoAsignado: '',
  };

  interaccionForm: CrearInteraccionRequest = {
    estadoContacto: '',
    descripcion: '',
  };

  // Opciones de estado de contacto (según el enum EstadoContacto del backend)
  estadosContacto = [
    { label: 'No Contactado', value: 'NoContactado' },
    { label: 'Contactado', value: 'Contactado' },
  ];

  ngOnInit() {
    const numeroOrden = this.route.snapshot.paramMap.get('numeroOrden');
    console.log('Número Orden:', numeroOrden);

    if (numeroOrden) {
      this.cargarDetalle(numeroOrden);
    }
  }

  cargarDetalle(numeroOrden: string) {
    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (!codigoSucursal) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se ha seleccionado una sucursal',
      });
      return;
    }

    this.loading.set(true);
    this.ordenTrabajoService.obtenerDetalleOrdenTrabajo(numeroOrden, codigoSucursal)
      .subscribe({
        next: (data) => {
          this.detalle.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar detalle:', error);
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el detalle de la orden',
          });
        },
      });
  }

  // ══════════════════════════════════════════════════════════════════
  // VISITA TÉCNICA
  // ══════════════════════════════════════════════════════════════════

  puedeCrearVisita(): boolean {
    const detalle = this.detalle();
    if (!detalle || !detalle.visitasTecnicas) return true;

    // Si no hay visitas, puede crear
    if (detalle.visitasTecnicas.length === 0) return true;

    // Obtener la última visita
    const ultimaVisita = detalle.visitasTecnicas[detalle.visitasTecnicas.length - 1];

    // Solo puede crear si la última está cancelada
    return ultimaVisita.estadoVisita === 'Cancelada';
  }

  obtenerMensajeBloqueoVisita(): string {
    const detalle = this.detalle();
    if (!detalle?.visitasTecnicas || detalle.visitasTecnicas.length === 0) {
      return '';
    }

    const ultimaVisita = detalle.visitasTecnicas[detalle.visitasTecnicas.length - 1];

    if (ultimaVisita.estadoVisita === 'Agendada') {
      return 'Ya existe una visita agendada';
    }
    if (ultimaVisita.estadoVisita === 'Completada') {
      return 'La visita ya fue completada';
    }

    return '';
  }

  abrirDialogVisita() {
    if (!this.puedeCrearVisita()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No permitido',
        detail: this.obtenerMensajeBloqueoVisita(),
      });
      return;
    }

    this.visitaForm = {
      fechaVisita: '',
      tecnicoAsignado: '',
    };
    this.showDialogVisita.set(true);
  }

  guardarVisita() {
    const detalle = this.detalle();
    if (!detalle) return;

    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (!codigoSucursal) return;

    // Convertir fecha a ISO string
    const payload: CrearVisitaTecnicaRequest = {
      ...this.visitaForm,
      fechaVisita: new Date(this.visitaForm.fechaVisita).toISOString(),
    };

    this.ordenTrabajoService
      .crearVisitaTecnica(detalle.ordenId, codigoSucursal, payload)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Visita técnica creada correctamente',
          });
          this.showDialogVisita.set(false);
          this.cargarDetalle(detalle.numeroOrden);
        },
        error: (error) => {
          console.error('Error al crear visita:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la visita técnica',
          });
        },
      });
  }

  // ══════════════════════════════════════════════════════════════════
  // INTERACCIÓN
  // ══════════════════════════════════════════════════════════════════

  abrirDialogInteraccion() {
    this.interaccionForm = {
      estadoContacto: '',
      descripcion: '',
    };
    this.showDialogInteraccion.set(true);
  }

  guardarInteraccion() {
    const detalle = this.detalle();
    if (!detalle) return;

    const codigoSucursal = this.sucursalState.getSucursalCodigo();
    if (!codigoSucursal) return;

    this.ordenTrabajoService
      .crearInteraccion(detalle.ordenId, codigoSucursal, this.interaccionForm)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Interacción registrada correctamente',
          });
          this.showDialogInteraccion.set(false);
          this.cargarDetalle(detalle.numeroOrden);
        },
        error: (error) => {
          console.error('Error al crear interacción:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar la interacción',
          });
        },
      });
  }

  // ══════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════

  getSeverityEstadoOrden(estado: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'Pendiente': 'warn',
      'En Proceso': 'info',
      'Completada': 'success',
      'Cancelada': 'danger',
    };
    return map[estado] || 'info';
  }

  getSeverityEstadoTarea(estado: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'Pendiente': 'warn',
      'En Proceso': 'info',
      'Completada': 'success',
      'Cancelada': 'danger',
    };
    return map[estado] || 'info';
  }

  getSeverityEstadoVisita(estado: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'Agendada': 'info',
      'Completada': 'success',
      'Cancelada': 'danger',
    };
    return map[estado] || 'info';
  }

  getSeverityPrioridad(prioridad: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'Baja': 'info',
      'Media': 'warn',
      'Alta': 'danger',
      'Urgente': 'danger',
    };
    return map[prioridad] || 'info';
  }

  volver() {
    this.router.navigate(['/ordenes-trabajo/pendientes']);
  }

  abrirMapa() {
    const detalle = this.detalle();
    if (detalle && detalle.coordX && detalle.coordY) {
      const coordX = detalle.coordX.toString().replace(',', '.');
      const coordY = detalle.coordY.toString().replace(',', '.');

      const url = `https://www.google.com/maps?q=${coordX},${coordY}`;
      window.open(url, '_blank');
    }
  }
}
