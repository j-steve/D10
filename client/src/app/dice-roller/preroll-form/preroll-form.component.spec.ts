import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerollFormComponent } from './preroll-form.component';

describe('PrerollFormComponent', () => {
  let component: PrerollFormComponent;
  let fixture: ComponentFixture<PrerollFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrerollFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrerollFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
