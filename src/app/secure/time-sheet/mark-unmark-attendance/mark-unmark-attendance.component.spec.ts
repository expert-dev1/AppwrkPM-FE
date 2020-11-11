import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkUnmarkAttendanceComponent } from './mark-unmark-attendance.component';

describe('MarkUnmarkAttendanceComponent', () => {
  let component: MarkUnmarkAttendanceComponent;
  let fixture: ComponentFixture<MarkUnmarkAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkUnmarkAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkUnmarkAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
