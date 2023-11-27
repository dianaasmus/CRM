import { Component } from '@angular/core';
import { Product } from 'src/models/products.class';
import { User } from 'src/models/user.class';
import { AuthService } from '../auth.service';
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


  constructor(
    private authService: AuthService,
    private database: DatabaseService) 
  { }


  ngOnInit(): void {
    this.authService.navigate();
    this.subUsersList();
    this.subProductsList();
    this.checkPurchaseRevenue();
  }


  async subUsersList() {
    await this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    });
  }


  async subProductsList() {
    await this.database.products$.subscribe(product => {
      this.products = product;
    });
  }


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
