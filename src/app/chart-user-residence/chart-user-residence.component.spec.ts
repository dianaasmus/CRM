import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUserResidenceComponent } from './chart-user-residence.component';

describe('ChartUserResidenceComponent', () => {
  let component: ChartUserResidenceComponent;
  let fixture: ComponentFixture<ChartUserResidenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartUserResidenceComponent]
    });
    fixture = TestBed.createComponent(ChartUserResidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
