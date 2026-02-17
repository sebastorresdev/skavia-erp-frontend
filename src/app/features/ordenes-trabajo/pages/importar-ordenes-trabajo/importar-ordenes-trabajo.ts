import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

// Services
import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { ImportarOrdenTrabajoResponse, TareaOmitida } from '../../models/orden-trabajo-models';

@Component({
  selector: 'app-importar-ordenes-trabajo',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    MessageModule,
    ToastModule,
    TableModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './importar-ordenes-trabajo.html',
  styles: [`
    :host ::ng-deep {
      .p-fileupload-content {
        padding: 2rem;
      }

      .p-fileupload .p-fileupload-buttonbar {
        background: transparent;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
    }
  `]
})
export class ImportarOrdenesTrabajoComponent {
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // Estado
  uploading = signal(false);
  uploadCompleted = signal(false);
  uploadResult = signal<ImportarOrdenTrabajoResponse | null>(null);
  selectedFile = signal<File | null>(null);

  // Configuración del uploader
  maxFileSize = 10485760; // 10MB
  acceptedFormats = '.xlsx,.xls';

  onFileSelect(event: any) {
    const file = event.currentFiles[0];
    if (file) {
      this.selectedFile.set(file);
      this.uploadCompleted.set(false);
      this.uploadResult.set(null);
    }
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];

    if (!file) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se seleccionó ningún archivo',
        life: 5000
      });
      return;
    }

    this.uploading.set(true);
    this.uploadCompleted.set(false);

    this.ordenTrabajoService.importarOrdenesTrabajo(file).subscribe({
      next: (response: ImportarOrdenTrabajoResponse) => {
        // El backend retorna un array, tomamos el primer elemento
        console.log('Respuesta del backend:', response);
        const result: ImportarOrdenTrabajoResponse = response ?? {
          totalTareasImportadas: 0,
          totalTareasRepetidas: 0,
          totalOmitidos: 0,
          tareasOmitidas: []
        };

        console.log('Resultado procesado:', result);

        this.uploadResult.set(result);
        this.uploading.set(false);
        this.uploadCompleted.set(true);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Importación Exitosa',
          detail: `Se importaron ${result.totalTareasImportadas} tareas correctamente`,
          life: 5000
        });

        // Si hay tareas omitidas, mostrar advertencia
        if (result.totalOmitidos > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Tareas Omitidas',
            detail: `${result.totalOmitidos} tareas fueron omitidas. Revisa los detalles abajo.`,
            life: 7000
          });
        }
      },
      error: (error) => {
        console.error('Error al importar órdenes:', error);
        this.uploading.set(false);
        this.uploadCompleted.set(false);

        this.messageService.add({
          severity: 'error',
          summary: 'Error en la Importación',
          detail: error.error?.message || 'No se pudo importar el archivo. Verifica el formato.',
          life: 7000
        });
      }
    });
  }

  onRemove() {
    this.selectedFile.set(null);
    this.uploadCompleted.set(false);
    this.uploadResult.set(null);
  }

  goToOrdenesPendientes() {
    this.router.navigate(['skavia/ordenes-trabajo/pendientes']);
  }

  resetUpload() {
    this.selectedFile.set(null);
    this.uploadCompleted.set(false);
    this.uploadResult.set(null);
    this.uploading.set(false);
  }

  getSeverityByMotivo(motivo: string): 'success' | 'info' | 'warn' | 'danger' {
    const motivoLower = motivo.toLowerCase();

    if (motivoLower.includes('duplicado') || motivoLower.includes('repetida')) {
      return 'warn';
    }
    if (motivoLower.includes('formato') || motivoLower.includes('inválido')) {
      return 'danger';
    }
    if (motivoLower.includes('omitido')) {
      return 'info';
    }

    return 'warn';
  }
}
