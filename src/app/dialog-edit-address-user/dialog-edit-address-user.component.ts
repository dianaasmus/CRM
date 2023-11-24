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


  onNoClick(): void {
    this.dialogRef.close();
  }


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


  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.user.id);
  }
}
