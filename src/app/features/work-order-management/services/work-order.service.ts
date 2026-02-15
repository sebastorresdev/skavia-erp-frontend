// Angular
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Services
import { environment } from '../../../../../environments/environment';
// Models
import { ImportedResult } from '../models/imported-result';
import { WorkOrderResult } from '../models/work-order-result';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private readonly _baseUrl = environment.baseUrl + '/WorkOrders';
  private readonly _http = inject(HttpClient);

  public getPendingWorkOrders(companyCode: string = 'I280000'): Observable<WorkOrderResult[]> {
    // Configuramos el parámetro ?companyCodes=valor
    const params = new HttpParams().set('companyCodes', companyCode);
    console.log('Fetching pending work orders for company code:', companyCode);

    return this._http.get<WorkOrderResult[]>(`${this._baseUrl}/Pending`, { params });
  }

  public importWorkOrders(file: File): Observable<ImportedResult> {
    const formData = new FormData();
    formData.append('formFile', file); // 👈 'file' debe coincidir con el nombre que espera tu backend

    return this._http.post<ImportedResult>(`${this._baseUrl}/Imports`, formData);
  }
}
