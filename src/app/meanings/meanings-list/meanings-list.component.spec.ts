import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeaningsListComponent } from './meanings-list.component';

describe('MeaningsListComponent', () => {
  let component: MeaningsListComponent;
  let fixture: ComponentFixture<MeaningsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeaningsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeaningsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
