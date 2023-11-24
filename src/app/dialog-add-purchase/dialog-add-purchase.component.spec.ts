import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPurchaseComponent } from './dialog-add-purchase.component';

describe('DialogAddPurchaseComponent', () => {
  let component: DialogAddPurchaseComponent;
  let fixture: ComponentFixture<DialogAddPurchaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddPurchaseComponent]
    });
    fixture = TestBed.createComponent(DialogAddPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
