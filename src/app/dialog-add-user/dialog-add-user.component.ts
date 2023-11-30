import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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


  /**
   * Gets an error message based on the validation state of the email form control.
   * 
   * @returns {string} The error message.
   */
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  /**
   * Closes the dialog without making any changes.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Adds a new user by setting the birthDate property, saving the user, and closing the dialog.
   */
  addNewUser() {
    this.users.birthDate = this.birthDate.getTime();
    this.saveUser(this.users);
    this.dialogRef.close();
  }


  /**
   * Saves a user to the Firestore database.
   * 
   * @param {User} item - The user to be saved.
   */
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


  /**
   * Retrieves a reference to the 'users' collection in Firestore.
   * 
   * @returns {any} A reference to the 'users' collection.
   */
  getUserRef() {
    return collection(this.firestore, 'users');
  }


  /**
   * Gets the maximum date in the format 'YYYY-MM-DD' for date input controls.
   * 
   * @returns {string} The maximum date string.
   */
  getMaxDate(): string {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  }
}
