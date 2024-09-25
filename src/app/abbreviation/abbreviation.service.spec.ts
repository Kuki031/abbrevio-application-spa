import { TestBed } from '@angular/core/testing';

import { AbbreviationService } from './abbreviation.service';

describe('AbbreviationService', () => {
  let service: AbbreviationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbbreviationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
