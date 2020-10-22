import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppwrkLoadingButtonComponent } from './appwrk-loading-button.component';

describe('AppwrkLoadingButtonComponent', () => {
  let component: AppwrkLoadingButtonComponent;
  let fixture: ComponentFixture<AppwrkLoadingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppwrkLoadingButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppwrkLoadingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
