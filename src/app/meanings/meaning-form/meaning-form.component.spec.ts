import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeaningFormComponent } from './meaning-form.component';

describe('MeaningFormComponent', () => {
  let component: MeaningFormComponent;
  let fixture: ComponentFixture<MeaningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeaningFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeaningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
