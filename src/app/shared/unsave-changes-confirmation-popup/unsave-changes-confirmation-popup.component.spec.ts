import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsaveChangesConfirmationPopupComponent } from './unsave-changes-confirmation-popup.component';

describe('UnsaveChangesConfirmationPopupComponent', () => {
  let component: UnsaveChangesConfirmationPopupComponent;
  let fixture: ComponentFixture<UnsaveChangesConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsaveChangesConfirmationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsaveChangesConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
