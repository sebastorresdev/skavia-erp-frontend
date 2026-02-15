export interface WorkOrderTaskDto {
  workOrderId: string;
  workOrderNumber: string;
  fullName: string;
  address: string;
  phoneNumbers: string[];
  creationDate: string; // o Date, si lo parseas
  statusWorkTasks: string;
  workTaskId: string;
  workTaskNumber: string;
  serviceCode: string;
  serviceDescription: string;
}
