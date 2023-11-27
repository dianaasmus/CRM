import { Component, inject } from '@angular/core';
import { Firestore, collection, updateDoc, doc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details/user-details.component';


@Component({
  selector: 'app-dialog-edit-address-user',
  templateUrl: './dialog-edit-address-user.component.html',
  styleUrls: ['./dialog-edit-address-user.component.scss']
})
export class DialogEditAddressUserComponent {
  user!: any;
  firestore: Firestore = inject(Firestore);
  loading: boolean = false;
  userForm: any;

  
  constructor(public dialogRef: MatDialogRef<UserDetailsComponent>) { }


  /**
   * Closes the current dialog without making any changes.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Updates a user in the Firestore database.
   * 
   * @throws {Error} If the user ID is not provided.
   */
  async updateUser() {
    this.loading = true;
    if (this.user.id) {
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
