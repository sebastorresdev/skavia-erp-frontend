// // Angular
// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// // PrimeNG
// import { Card } from 'primeng/card';
// import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
// import { ToastModule } from 'primeng/toast';
// import { DividerModule } from 'primeng/divider';
// import { Message } from 'primeng/message';

// // Services
// import { WorkOrderService } from '../../services/work-order.service';
// // Models
// import { ImportedResult } from '../../models/imported-result';

// @Component({
//   selector: 'app-imported-work-orders',
//   imports: [FileUpload, ToastModule, CommonModule, Card, DividerModule, Message],
//   templateUrl: './imported-work-orders.html',
//   providers: [],
// })
// export class ImportedWorkOrders {
//   private _workOrderService = inject(WorkOrderService);

//   public uploadedFiles: FileUploadHandlerEvent[] = [];
//   public importedResult: ImportedResult | undefined;

//   public onUpload(event: FileUploadHandlerEvent): void {
//     const file = event.files[0];
//     this._workOrderService.importWorkOrders(file).subscribe({
//       next: (result) => {
//         this.importedResult = result;
//       },
//       // TODO: Implementar mensajes de errores
//       error: (error) => {
//         console.log(error);
//       },
//     });
//   }
// }

// ============================================
// imported-work-orders.component.ts
// ============================================
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

// Services
import { WorkOrderService } from '../../services/work-order.service';

// Models
import { ImportedResult } from '../../models/imported-result';

@Component({
  selector: 'app-imported-work-orders',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FileUploadModule,
    ButtonModule,
    TableModule,
    ProgressBarModule,
    DividerModule,
    ToastModule,
    BadgeModule
  ],
  templateUrl: './imported-work-orders.html',
  providers: [MessageService]
})
export class ImportedWorkOrders {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private _workOrderService = inject(WorkOrderService);
  private _messageService = inject(MessageService);

  public selectedFile: File | null = null;
  public importedResult: ImportedResult | null = null;
  public isProcessing = false;

  // Método cuando se selecciona un archivo
  public onSelect(event: any): void {
    this.selectedFile = event.currentFiles[0];
  }

  // Método cuando se remueve el archivo
  public onRemove(): void {
    this.selectedFile = null;
  }

  // Método para procesar el archivo
  public processFile(): void {
    if (!this.selectedFile) return;

    this.isProcessing = true;

    this._workOrderService.importWorkOrders(this.selectedFile).subscribe({
      next: (result: ImportedResult) => {
        this.importedResult = result;
        this.isProcessing = false;

        this._messageService.add({
          severity: 'success',
          summary: 'Importación Completada',
          detail: `${result.totalImported} órdenes importadas correctamente`,
          life: 5000
        });
      },
      error: (error) => {
        this.isProcessing = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo procesar el archivo. Verifica el formato e intenta nuevamente.',
          life: 5000
        });
        console.error('Error al importar:', error);
      }
    });
  }

  // Método para descargar reporte de errores en CSV
  public downloadErrorReport(): void {
    if (!this.importedResult?.skippedDetails.length) return;

    const csvHeader = 'Número de Tarea,Razón\n';
    const csvRows = this.importedResult.skippedDetails
      .map(detail => `"${detail.workTaskNumber}","${detail.reason}"`)
      .join('\n');

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `errores-importacion-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Método para resetear e importar otro archivo
  public resetImport(): void {
    this.selectedFile = null;
    this.importedResult = null;
    this.fileUpload.clear();
  }

  // Getter para calcular el total de registros procesados
  public get totalProcessed(): number {
    if (!this.importedResult) return 0;
    return this.importedResult.totalImported +
           this.importedResult.totalExisting +
           this.importedResult.skippedDetails.length;
  }

  // Getter para calcular el porcentaje de éxito
  public get successRate(): number {
    if (!this.importedResult || this.totalProcessed === 0) return 0;
    return Math.round((this.importedResult.totalImported / this.totalProcessed) * 100);
  }
}
