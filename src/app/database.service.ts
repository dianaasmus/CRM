import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/models/products.class';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private usersListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private productsListSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  usersList$ = this.usersListSubject.asObservable();
  products$ = this.productsListSubject.asObservable();
  firestore: Firestore = inject(Firestore);


  constructor(
  ) {
    this.subUsersList();
    this.subProductsList();
  }


  /**
   * Updates the purchase state of a user in Firestore.
   * 
   * @param {User} user - The user whose purchase state needs to be updated.
   * @throws {Error} If there is an error during the update operation.
   */
  async updateUserPurchaseState(user: User) {
    if (user.id) {
      const docRef = this.getSingleDocRef(user);
      const userJSON = JSON.stringify(user);
      try {
        await updateDoc(docRef, JSON.parse(userJSON));
      } catch (err) {
        console.error(err);
      }
    }
  }


  /**
   * Gets a reference to a single document in the 'users' collection in Firestore.
   * 
   * @param {User} user - The user for whom the document reference is needed.
   * @returns {DocumentReference} Reference to the requested document.
   */
  getSingleDocRef(user: User) {
    return doc(collection(this.firestore, 'users'), user.id);
  }


  /**
   * Subscribes to the 'users' collection in Firestore and updates the usersListSubject.
   * 
   * @private
   */
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

  /**
   * Subscribes to the 'products' collection in Firestore and updates the productsListSubject.
   * 
   * @private
   */
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


  /**
   * Creates a User object using the provided properties.
   * 
   * @private
   * @param {any} obj - The object containing user properties.
   * @param {string} id - The ID of the user.
   * @returns {User} The created User object.
   */
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


  /**
   * Creates a Product object using the provided properties.
   * 
   * @private
   * @param {any} obj - The object containing product properties.
   * @param {string} id - The ID of the product.
   * @returns {Product} The created Product object.
   */
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
