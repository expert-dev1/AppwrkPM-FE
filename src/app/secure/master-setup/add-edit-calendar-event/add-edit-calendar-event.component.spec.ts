import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCalendarEventComponent } from './add-edit-calendar-event.component';

describe('AddEditCalendarEventComponent', () => {
  let component: AddEditCalendarEventComponent;
  let fixture: ComponentFixture<AddEditCalendarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCalendarEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCalendarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
