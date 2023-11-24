import { Component, inject } from '@angular/core';
import { Firestore, addDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { collection } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent {
  users = new User();
  email = new FormControl('', [Validators.required, Validators.email]);
  birthDate!: Date;
  firestore: Firestore = inject(Firestore);
  loading: boolean = false;
  userForm: any;


  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>) { }


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  addNewUser() {
    this.users.birthDate = this.birthDate.getTime(); // Wandelt das Datum in einen Timestamp um
    this.saveUser(this.users);
    this.dialogRef.close();
  }


  async saveUser(item: User) {
    this.loading = true;
    const userData = { ...item };
    const collectionRef = this.getUserRef();

    try {
      const docRef = await addDoc(collectionRef, userData);
      console.log('Dokument mit ID erstellt:', docRef.id);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }


  getUserRef() {
    return collection(this.firestore, 'users');
  }


  getMaxDate(): string {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  }
}
