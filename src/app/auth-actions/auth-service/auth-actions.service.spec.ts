import { TestBed } from '@angular/core/testing';

import { AuthActionsService } from './auth-actions.service';

describe('AuthActionsService', () => {
  let service: AuthActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
