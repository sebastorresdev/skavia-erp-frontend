import { Component } from '@angular/core';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-finalize-work-order',
  imports: [ButtonModule, CardModule, InputIcon, IconField, InputTextModule, TableModule],
  templateUrl: './finalize-work-order.html',
})
export class FinalizeWorkOrder {
  finalizableWorkOrders: any[] = [];

  public searchWorkOrder(): void {
    this.finalizableWorkOrders = [
      { code: 101, name: 'Install new software', status: 'In Progress' },
      { code: 102, name: 'Network configuration', status: 'In Progress' },
      { code: 103, name: 'Hardware upgrade', status: 'In Progress' },
    ];
  }

  onSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Buscar:', value);

    this.finalizableWorkOrders = [
      { code: 101, name: 'Install new software', status: 'In Progress' },
      { code: 102, name: 'Network configuration', status: 'In Progress' },
      { code: 103, name: 'Hardware upgrade', status: 'In Progress' },
    ];
  }
}
