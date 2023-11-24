import { TestBed } from '@angular/core/testing';

import { DataFlowFirebaseService } from './data-flow-firebase.service';

describe('DataFlowFirebaseService', () => {
  let service: DataFlowFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFlowFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
