import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbrevationFormComponent } from './abbrevation-form.component';

describe('AbbrevationFormComponent', () => {
  let component: AbbrevationFormComponent;
  let fixture: ComponentFixture<AbbrevationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbbrevationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbbrevationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
