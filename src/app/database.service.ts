import { Injectable, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/models/products.class';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private usersListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private productsListSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  usersList$ = this.usersListSubject.asObservable();
  products$ = this.productsListSubject.asObservable();
  firestore: Firestore = inject(Firestore);


  constructor() {
    this.subUsersList();
    this.subProductsList();
  }


  private subUsersList() {
    let ref = collection(this.firestore, 'users');

    onSnapshot(ref, (list) => {
      const usersList: User[] = [];
      list.forEach((element) => {
        usersList.push(this.setUserObject(element.data(), element.id));
      });            
      this.usersListSubject.next(usersList);
    });
  }


  private subProductsList() {
    let ref = collection(this.firestore, 'products');

    onSnapshot(ref, (list) => {
      const products: Product[] = [];
      list.forEach((element) => {
        products.push(this.setProductsObject(element.data(), element.id));
      });
      this.productsListSubject.next(products);
    });
  }


  private setUserObject(obj: any, id: string): User {
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
    };
  }


  private setProductsObject(obj: any, id: string): Product {
    return {
      id: id,
      title: obj.title,
      type: obj.type,
      price: obj.price,
      amount: obj.amount,
      value: obj.value,
      state: obj.state,
      purchaseUser: obj.purchaseUser
    };
  }
}
