import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Product } from 'src/models/products.class';
import { ProductsComponent } from './products/products.component';
import { DialogAddPurchaseComponent } from './dialog-add-purchase/dialog-add-purchase.component';
import { DialogChangeStateComponent } from './dialog-change-state/dialog-change-state.component';

@Injectable({
  providedIn: 'root'
})
export class DataFlowFirebaseService {
  usersList: User[] = [];
  products: Product[] = [];

  firestore: Firestore = inject(Firestore);


  unsubUsersList: any;
  unsubProductsList: any;


  constructor(public dialog: MatDialog,
    private dasboard: DashboardComponent,
    private addPurchase: DialogAddPurchaseComponent,
    private productsComponent: ProductsComponent,
    private dialogChangeState: DialogChangeStateComponent) {
    this.sendUser();
    this.sendProducts();
  }


  /**
   * Sends the usersList data to various components in the application.
   * Unsubscribes from the user list observable.
   * 
   * @throws {Error} If there is an error during the user list subscription.
   */
  async sendUser() {
    this.unsubUsersList = await this.subUsersList();
    this.dasboard.usersList = this.usersList;
    this.addPurchase.usersList = this.usersList;
    this.dialogChangeState.usersList = this.usersList;
  }


  /**
   * Sends the products data to the ProductsComponent.
   * Unsubscribes from the products list observable.
   * 
   * @throws {Error} If there is an error during the products list subscription.
   */
  async sendProducts() {
    this.unsubProductsList = await this.subProductsList();
    this.productsComponent.products = this.products;
  }


  /**
   * Opens a dialog to add a new user.
   */
  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, { panelClass: 'custom-container' });
  }


  /**
   * Creates a Product object using the provided properties.
   * 
   * @param {any} obj - The object containing product properties.
   * @param {string} id - The ID of the product.
   * @returns {Product} The created Product object.
   */
  setProductsObject(obj: any, id: string): Product {
    return {
      id: id,
      title: obj.title,
      type: obj.type,
      price: obj.price,
      amount: obj.amount,
      value: obj.value,
      state: obj.state,
      purchaseUser: obj.purchaseUser
    }
  }


  /**
   * Creates a User object using the provided properties.
   * 
   * @param {any} obj - The object containing user properties.
   * @param {string} id - The ID of the user.
   * @returns {User} The created User object.
   */
  setUserObject(obj: any, id: string): User {
    return {
      id: id,
      firstName: obj.firstName,
      lastName: obj.lastName,
      email: obj.email,
      birthDate: obj.birthDate,
      street: obj.street,
      zipCode: obj.zipCode,
      city: obj.city,
      purchases: obj.purchases
    }
  }


  /**
   * Lifecycle hook that is called before the component is destroyed.
   * Unsubscribes from user and product list observables.
   */
  ngOnDestroy(): void {
    this.unsubUsersList();
    this.unsubProductsList();
  }


  /**
   * Subscribes to the 'users' collection in Firestore and updates the usersList property.
   * 
   * @returns {Function} A function to unsubscribe from the user list observable.
   */
  subUsersList() {
    let ref = collection(this.firestore, 'users');
    return onSnapshot(ref, (list) => {
      this.usersList = [];
      list.forEach((element) => {
        this.usersList.push(this.setUserObject(element.data(), element.id));
      });
    });
  }


  /**
   * Subscribes to the 'products' collection in Firestore and updates the products property.
   * 
   * @returns {Function} A function to unsubscribe from the product list observable.
   */
  subProductsList() {
    let ref = collection(this.firestore, 'products');
    return onSnapshot(ref, (list) => {
      this.products = [];
      list.forEach((element) => {
        this.products.push(this.setProductsObject(element.data(), element.id));
      });
    });
  }
}
