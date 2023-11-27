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
    public dialogRef: MatDialogRef<DialogAddPurchaseComponent>) { }


  /**
   * Extracts the user ID from the current URL and updates the userId property.
   */
  getUserId() {
    const currentUrl = this.router.url;
    const userIdMatch = currentUrl.match(/\/user\/([^\/]+)/);

    if (userIdMatch && userIdMatch[1]) {
      const userId = userIdMatch[1];
      this.userId = userId;
    }
  }


  /**
   * Adds or removes a purchase from the selected product at the specified position.
   * 
   * @param {any} position - The position of the product in the list.
   */
  addPurchases(position: any) {
    let purchase = this.products[position];
    const tr = document.getElementById('product' + position);

    if (tr!.classList.contains('selected')) {
      this.removePurchase(purchase, tr);
    } else {
      this.addPurchase(purchase, tr);
    }
  }


  /**
   * Removes a purchase from the user's purchase list and updates the user data.
   * 
   * @param {any} purchase - The purchase to be removed.
   * @param {any} tr - The HTML table row element associated with the purchase.
   */
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


  /**
   * Adds a purchase to the user's purchase list and updates the user data.
   * 
   * @param {any} purchase - The purchase to be added.
   * @param {any} tr - The HTML table row element associated with the purchase.
   */
  addPurchase(purchase: any, tr: any) {
    tr!.classList.add('selected');
    this.getUserId();
    const userToUpdateIndex = this.usersList.findIndex(user => user.id === this.userId);

    if (userToUpdateIndex !== -1) {
      this.setNewPurchase(purchase, this.usersList[userToUpdateIndex]);
      this.userData = this.usersList[userToUpdateIndex];
    }
  }


  /**
   * Sets a new purchase for the user and updates the user data.
   * 
   * @param {any} purchase - The purchase to be added.
   * @param {any} user - The user to whom the purchase will be added.
   */
  setNewPurchase(purchase: any, user: any) {
    this.user = user;
    purchase.purchaseUser = user.id;
    user.purchases.push({ ...purchase, amount: 1, state: 'pending' });
  }


  /**
   * Updates the user data in the Firestore database.
   */
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


  /**
   * Retrieves a reference to a single user document in Firestore.
   * 
   * @returns {any} A reference to the user document.
   */
  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.userId);
  }


  /**
   * Closes the dialog without making any changes.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * Subscribes to product and user lists.
   */
  ngOnInit(): void {
    this.subProductsList();
    this.subUsersList();
  }


  /**
   * Subscribes to the products$ observable from the database and updates the products property.
   */
  subProductsList() {
    this.database.products$.subscribe(product => {
      this.products = product;
    });
  }


  /**
   * Subscribes to the usersList$ observable from the database and updates the usersList property.
   */
  subUsersList() {
    this.database.usersList$.subscribe(user => {
      this.usersList = user;
    });
  }

}