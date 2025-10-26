import { TestBed } from '@angular/core/testing';

import { AuthPostulacionesService } from './auth-postulaciones.service';

describe('AuthPostulacionesService', () => {
  let service: AuthPostulacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPostulacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
