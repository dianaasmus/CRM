import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';

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


  /**
   * Closes the dialog without making any changes.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


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
   * Gets the maximum date in the format 'YYYY-MM-DD' for date input controls.
   * 
   * @returns {string} The maximum date string.
   */
  getMaxDate(): string {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
  }


  /**
   * Updates a user in the Firestore database.
   * 
   * @throws {Error} If the user ID is not provided.
   */
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


  /**
   * Retrieves a reference to a single user document in Firestore.
   * 
   * @returns {any} A reference to the user document.
   */
  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.user.id);
  }
}
