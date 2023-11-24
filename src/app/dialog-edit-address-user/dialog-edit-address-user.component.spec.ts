import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAddressUserComponent } from './dialog-edit-address-user.component';

describe('DialogEditAddressUserComponent', () => {
  let component: DialogEditAddressUserComponent;
  let fixture: ComponentFixture<DialogEditAddressUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditAddressUserComponent]
    });
    fixture = TestBed.createComponent(DialogEditAddressUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
