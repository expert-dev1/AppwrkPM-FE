import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppwrkLoaderComponent } from './appwrk-loader.component';

describe('AppwrkLoaderComponent', () => {
  let component: AppwrkLoaderComponent;
  let fixture: ComponentFixture<AppwrkLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppwrkLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppwrkLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
