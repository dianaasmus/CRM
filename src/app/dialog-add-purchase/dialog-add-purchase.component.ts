import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/models/products.class';
import { User } from 'src/models/user.class';
import { DatabaseService } from '../database.service';



@Component({
  selector: 'app-dialog-add-purchase',
  templateUrl: './dialog-add-purchase.component.html',
  styleUrls: ['./dialog-add-purchase.component.scss']
})
export class DialogAddPurchaseComponent {
  loading: boolean = false;
  products: Product[] = [];
  usersList: User[] = [];
  userId: any = '';
  firestore: Firestore = inject(Firestore);
  userData: any = [];
  user!: User;


  constructor(private database: DatabaseService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogAddPurchaseComponent>) 
  { }


  getUserId() {
    const currentUrl = this.router.url;
    const userIdMatch = currentUrl.match(/\/user\/([^\/]+)/);

    if (userIdMatch && userIdMatch[1]) {
      const userId = userIdMatch[1];
      this.userId = userId;
    }
  }


  addPurchases(position: any) {
    let purchase = this.products[position];
    const tr = document.getElementById('product' + position);

    if (tr!.classList.contains('selected')) {
      this.removePurchase(purchase, tr);
    } else {
      this.addPurchase(purchase, tr);
    }
  }


  removePurchase(purchase: any, tr: any) {
    tr!.classList.remove('selected');
    this.getUserId();
    const userToUpdateIndex = this.usersList.findIndex(user => user.id === this.userId);

    if (userToUpdateIndex !== -1) {
      const arrayPosition = this.usersList[userToUpdateIndex].purchases.findIndex((p: any) => p.id === purchase.id);

      this.usersList[userToUpdateIndex].purchases.splice(arrayPosition, 1);
      this.userData = this.usersList[userToUpdateIndex];
    }
  }


  addPurchase(purchase: any, tr: any) {
    tr!.classList.add('selected');
    this.getUserId();
    const userToUpdateIndex = this.usersList.findIndex(user => user.id === this.userId);

    if (userToUpdateIndex !== -1) {
      this.setNewPurchase(purchase, this.usersList[userToUpdateIndex]);
      this.userData = this.usersList[userToUpdateIndex];
    }
  }


  setNewPurchase(purchase: any, user: any) {
    this.user = user;
    purchase.purchaseUser = user.id;
    user.purchases.push({ ...purchase, amount: 1, state: 'pending' });
  }


  async updateUser() {
    this.loading = true;
    if (this.userId) {
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
    return doc(collection(this.firestore, 'users'), this.userId);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void {
    this.subProductsList();
    this.subUsersList();
  }


  subProductsList() {
    this.database.products$.subscribe(product => {
      this.products = product;
    });
  }


  subUsersList() {
    this.database.usersList$.subscribe(user => {
      this.usersList = user;
    });
  }

}