import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/models/products.class';
import { User } from 'src/models/user.class';
import { DataFlowFirebaseService } from '../data-flow-firebase.service';
import { DatabaseService } from '../database.service';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';



@Component({
  selector: 'app-dialog-change-state',
  templateUrl: './dialog-change-state.component.html',
  styleUrls: ['./dialog-change-state.component.scss'],
  providers: [DataFlowFirebaseService]
})
export class DialogChangeStateComponent {
  state1Data: any;
  state2Data: any;
  purchase!: Product;
  usersList: any[] = [];
  firestore: Firestore = inject(Firestore);


  constructor(private database: DatabaseService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogChangeStateComponent>) { }


  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    });
  }


  ngOnDestroy(): void {
    this.subUsersList();
  }


  ngOnInit() {
    this.subUsersList();
    this.state1Data = this.data.state1;
    this.state2Data = this.data.state2;
    this.purchase = this.data.purchase;
  }


  changeState(state: any) {
    const user = this.usersList.find(user => user.id === this.purchase.purchaseUser) as User;
    this.purchase.state = state.id;
    this.database.updateUserPurchaseState(user);
    this.dialogRef.close();
  }

}
