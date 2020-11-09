import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetStatusChangeComponent } from './time-sheet-status-change.component';

describe('TimeSheetStatusChangeComponent', () => {
  let component: TimeSheetStatusChangeComponent;
  let fixture: ComponentFixture<TimeSheetStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSheetStatusChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
