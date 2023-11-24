import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditAboutUserComponent } from './dialog-edit-about-user.component';

describe('DialogEditAboutUserComponent', () => {
  let component: DialogEditAboutUserComponent;
  let fixture: ComponentFixture<DialogEditAboutUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditAboutUserComponent]
    });
    fixture = TestBed.createComponent(DialogEditAboutUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
