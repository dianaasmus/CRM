import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Firestore, Timestamp, collection, doc, updateDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dialog-edit-about-user',
  templateUrl: './dialog-edit-about-user.component.html',
  styleUrls: ['./dialog-edit-about-user.component.scss']
})
export class DialogEditAboutUserComponent {
  user!: any;
  email = new FormControl('', [Validators.required, Validators.email]);
  birthDate!: any;
  firestore: Firestore = inject(Firestore);
  loading: boolean = false;
  userForm: any;

  constructor(public dialogRef: MatDialogRef<UserDetailsComponent>) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  getMaxDate(): string {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  }


  async updateUser() {
    this.loading = true;
    if (this.user.id) {
      this.user.birthDate = this.birthDate.getTime();
      const docRef = this.getSingleDocRef();
      const userJSON = JSON.stringify(this.user);
      try {
        await updateDoc(docRef, JSON.parse(userJSON));
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        this.dialogRef.close();
      }
    }
  }


  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.user.id); //doc braucht datenbank (firestor) + id von single document
  }
}
