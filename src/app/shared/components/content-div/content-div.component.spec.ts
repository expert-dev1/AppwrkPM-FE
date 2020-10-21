import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDivComponent } from './content-div.component';

describe('ContentDivComponent', () => {
  let component: ContentDivComponent;
  let fixture: ComponentFixture<ContentDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentDivComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
