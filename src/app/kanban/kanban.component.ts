import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, inject } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { DatabaseService } from '../database.service';
import { updateDoc } from 'firebase/firestore';
import { Product } from 'src/models/products.class';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
  usersList: User[] = [];
  pendingArray: any[] = [];
  inProgressArray: any[] = [];
  pendingArrayFilter: any[] = [];
  inProgressArrayFilter: any[] = [];
  doneArrayFilter: any[] = [];
  doneArray: any[] = [];
  @Input() input!: string;
  firestore: Firestore = inject(Firestore);


  constructor(private authService: AuthService, private database: DatabaseService) { }
  

  ngOnInit(): void {
    this.authService.navigate();
    this.subUsersList();
  }


  filterData() {
    this.pendingArray = this.input ? this.matchesInput(this.pendingArray) : this.pendingArrayFilter;
    this.inProgressArray = this.input ? this.matchesInput(this.inProgressArray) : this.inProgressArrayFilter;
    this.doneArray = this.input ? this.matchesInput(this.doneArray) : this.doneArrayFilter;
  }


  matchesInput(stateArray: any) {
    const filteredItems = stateArray.filter((item: any) => {
      const titleMatches = item.title.toLowerCase().includes(this.input.toLowerCase());
  
      if (titleMatches) {
        return true;
      } else {
        const matchingUser = this.usersList.find(user => user.id === item.purchaseUser) as User;
  
        if (matchingUser) {
          return (
            matchingUser.firstName.toLowerCase().includes(this.input.toLowerCase()) ||
            matchingUser.lastName.toLowerCase().includes(this.input.toLowerCase())
          );
        } else {
          return false;
        }
      }
    });
  
    return filteredItems;
  }


  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.categorizePurchases();
    });
  }


  ngOnDestroy(): void {
    this.subUsersList();
  }


  categorizePurchases(): void {
    this.pendingArray = [];
    this.inProgressArray = [];
    this.doneArray = [];

    for (const user of this.usersList) {
      for (const purchase of user.purchases) {
        this.addToCategory(purchase);
      }
    }

    this.pendingArrayFilter = [...this.pendingArray];
    this.inProgressArrayFilter = [...this.inProgressArray];
    this.doneArrayFilter = [...this.doneArray];
  }


  private addToCategory(purchase: Product): void {
    if (purchase.state === 'pending') {
      this.pendingArray.push(purchase);
    } else if (purchase.state === 'inProgress') {
      this.inProgressArray.push(purchase);
    } else {
      this.doneArray.push(purchase);
    }
  }


  getUserById(userId: string): any {
    const user = this.usersList.find(user => user.id === userId);
    return user!.firstName + ' ' + user!.lastName;
  }


  async drop(event: CdkDragDrop<string[]>) {
    const droppedPurchase = event.previousContainer.data[event.previousIndex] as any;
    const user = this.usersList.find(user => user.id === droppedPurchase.purchaseUser) as User;
    droppedPurchase.state = event.container.id;
    this.assignPurchaseToState(event)
    this.updateUserPurchaseState(user);
  }


  assignPurchaseToState(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


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


  getSingleDocRef(user: User) {
    return doc(collection(this.firestore, 'users'), user.id);
  }

}