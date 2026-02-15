export interface ImportedResult {
  totalImported: number;
  totalExisting: number;
  skippedDetails: SkippedDetail[];
}

export interface SkippedDetail {
  workTaskNumber: string;
  reason: string;
}
