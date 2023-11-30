import { Component } from '@angular/core';
import { Product } from 'src/models/products.class';
import { User } from 'src/models/user.class';
import { DatabaseService } from '../database.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  usersList: User[] = [];
  products: Product[] = [];
  totalRevenue: number = 0;


  constructor(private database: DatabaseService) { }


  /**
   * Navigates to the appropriate route using the AuthService, subscribes to user and product lists, and checks purchase revenue.
   */
  ngOnInit(): void {
    this.subUsersList();
    this.subProductsList();
    this.checkPurchaseRevenue();
  }


  /**
   * Subscribes to the usersList$ observable from the database and updates the usersList property.
   */
  async subUsersList() {
    await this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    });
  }


  /**
   * Subscribes to the products$ observable from the database and updates the products property.
   */
  async subProductsList() {
    await this.database.products$.subscribe(product => {
      this.products = product;
    });
  }


  /**
   * Subscribes to the usersList$ observable from the database, calculates the total revenue from user purchases, and updates the totalRevenue property.
   */
  async checkPurchaseRevenue() {
    await this.database.usersList$.subscribe(users => {
      users.forEach(user => {
        user.purchases.forEach(purchase => {
          this.totalRevenue += +purchase.value;
        });
      });
    });
  }

}
