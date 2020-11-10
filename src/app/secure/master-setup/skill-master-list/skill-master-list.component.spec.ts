import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillMasterListComponent } from './skill-master-list.component';

describe('SkillMasterListComponent', () => {
  let component: SkillMasterListComponent;
  let fixture: ComponentFixture<SkillMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
