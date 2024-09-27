import { TestBed } from '@angular/core/testing';

import { MeaningsService } from './meanings.service';

describe('MeaningsService', () => {
  let service: MeaningsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeaningsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
