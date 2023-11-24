import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartProductsSoldComponent } from './chart-products-sold.component';

describe('ChartProductsSoldComponent', () => {
  let component: ChartProductsSoldComponent;
  let fixture: ComponentFixture<ChartProductsSoldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartProductsSoldComponent]
    });
    fixture = TestBed.createComponent(ChartProductsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
