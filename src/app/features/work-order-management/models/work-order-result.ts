export interface WorkOrderResult {
  workOrderId: string;
  workOrderNumber: string;
  fullName: string;
  scheduledEnd: Date | null;
  customerCode: string;
  taskNumber: string;
  serviceDescription: string;
  sla: string;
  slaStatus: string;
  creationDate: Date;
  taskStatus: string;
  isExternalScheduling: boolean;
  isSin30: boolean;
}
