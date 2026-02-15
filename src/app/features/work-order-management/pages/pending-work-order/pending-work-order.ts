import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBar } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';

// Services & Models
import { WorkOrderService } from '../../services/work-order.service';
import { WorkOrderResult } from '../../models/work-order-result';

@Component({
  selector: 'app-pending-work-order',
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    DatePickerModule,
    TagModule,
    CommonModule,
    ProgressBar,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    TooltipModule
  ],
  templateUrl: './pending-work-order.html',
})
export class PendingWorkOrder {
  private readonly _workOrderService = inject(WorkOrderService);

  workOrders: WorkOrderResult[] | null = null;
  loading = false;
  searchValue: string | undefined;
  serviceDescriptions: any[] = [];
  slaStatuses: any[] = [];
  sin30Options = [
    { label: 'Todos', value: null },
    { label: 'Solo SIN30', value: true },
    { label: 'Sin SIN30', value: false }
  ];
  externalSchedulingOptions = [
    { label: 'Todos', value: null },
    { label: 'Solo Externo', value: true },
    { label: 'Solo Interno', value: false }
  ];

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  loadWorkOrders(): void {
    this.loading = true;
    this._workOrderService.getPendingWorkOrders().subscribe({
      next: (data) => {
        this.workOrders = data;
        this.loading = false;

        // Service descriptions
        this.serviceDescriptions = Array.from(new Set(data.map(wo => wo.serviceDescription)))
          .sort()
          .map(s => ({ label: s, value: s }));

        // SLA statuses
        this.slaStatuses = Array.from(new Set(data.map(wo => wo.slaStatus)))
          .sort()
          .map(s => ({ label: this.translateSlaStatus(s), value: s }));
      },
      error: (error: any) => {
        console.error('Error al cargar órdenes:', error);
        this.workOrders = [];
        this.loading = false;
      },
    });
  }

  clear(table: Table): void {
    table.clear();
    this.searchValue = '';
  }

  getSeverity(status: string): "danger" | "success" | "info" | "warn" | null {
    switch (status) {
      case 'Pending': return 'warn';
      case 'Overdue': return 'danger';
      case 'DueSoon': return 'warn';
      case 'OnTime': return 'success';
      case 'Completed': return 'success';
      case 'Failed': return 'danger';
      default: return null;
    }
  }

  getInitials(fullName: string): string {
    if (!fullName) return '??';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  translateSlaStatus(status: string): string {
    const translations: { [key: string]: string } = {
      'OnTime': 'A Tiempo',
      'DueSoon': 'Por Vencer',
      'Overdue': 'Vencido',
      'Pending': 'Pendiente',
      'Completed': 'Completado'
    };
    return translations[status] || status;
  }
}
