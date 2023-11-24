import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Product } from 'src/models/products.class';
import { ProductsComponent } from './products/products.component';
import { DialogAddPurchaseComponent } from './dialog-add-purchase/dialog-add-purchase.component';

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
    private productsComponent: ProductsComponent) {
    this.sendUser();
    this.sendProducts();
  }


  async sendUser() {
    this.unsubUsersList = await this.subUsersList();
    this.dasboard.usersList = this.usersList;
    this.addPurchase.usersList = this.usersList;
  }

  
  async sendProducts() {
    this.unsubProductsList = await this.subProductsList();
    this.productsComponent.products = this.products;
  }


  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, { panelClass: 'custom-container' });
  }


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


  ngOnDestroy(): void {
    this.unsubUsersList();
    this.unsubProductsList();
  }


  subUsersList() {
    let ref = collection(this.firestore, 'users'); // Pfad angeben
    // const q = query(ref, limit(16)); // filter, der in den onSnapshot eingebunden wird -- !! limit = maximum
    return onSnapshot(ref, (list) => { // der notesRef ist in query drinnen
      this.usersList = [];
      list.forEach((element) => {
        this.usersList.push(this.setUserObject(element.data(), element.id));
      });
      console.log(this.usersList);
      // this.sendUser();
    });
  }


  subProductsList() {
    let ref = collection(this.firestore, 'products');
    // const q = query(ref, limit(16));
    return onSnapshot(ref, (list) => {
      this.products = [];
      list.forEach((element) => {
        this.products.push(this.setProductsObject(element.data(), element.id));
      });
      console.log(this.products);
    });
  }
}
