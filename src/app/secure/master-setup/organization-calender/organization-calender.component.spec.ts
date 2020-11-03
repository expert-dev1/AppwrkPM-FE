import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCalenderComponent } from './organization-calender.component';

describe('OrganizationCalenderComponent', () => {
  let component: OrganizationCalenderComponent;
  let fixture: ComponentFixture<OrganizationCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
