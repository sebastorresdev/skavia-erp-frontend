import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDetails } from './work-order-details';

describe('WorkOrderDetails', () => {
  let component: WorkOrderDetails;
  let fixture: ComponentFixture<WorkOrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
