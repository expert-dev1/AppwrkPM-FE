import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimeSheetComponent } from './employee-time-sheet.component';

describe('EmployeeTimeSheetComponent', () => {
  let component: EmployeeTimeSheetComponent;
  let fixture: ComponentFixture<EmployeeTimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTimeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
