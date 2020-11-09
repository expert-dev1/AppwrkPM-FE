import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmployeeTimeSheetComponent } from './add-edit-employee-time-sheet.component';

describe('AddEditEmployeeTimeSheetComponent', () => {
  let component: AddEditEmployeeTimeSheetComponent;
  let fixture: ComponentFixture<AddEditEmployeeTimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEmployeeTimeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEmployeeTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
