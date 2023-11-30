import { Component, Input } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: any[] = [];
  @Input() input!: string;
  filteredData!: any[];
  selectedFilter: string = '';


  constructor(private database: DatabaseService) { }


  /**
   * Navigates using the AuthService and subscribes to the product list.
   */
  ngOnInit(): void {
    this.subProductsList();
  }


  /**
   * Filters the product data based on the input value.
   */
  filterData() {
    if (this.input) {
      this.filteredData = this.products.filter(item => this.titleOrTypeOrPriceMatchesInput(item));
    } else {
      this.filteredData = this.products;
    }
  }


  /**
   * Checks if the title, type, or price of the given product matches the input.
   * 
   * @param {any} item - The product to be checked.
   * @returns {boolean} True if the product matches the input, false otherwise.
   */
  titleOrTypeOrPriceMatchesInput(item: any) {
    return item.title.toLowerCase().includes(this.input.toLowerCase()) ||
      item.type.toLowerCase().includes(this.input.toLowerCase()) ||
      item.price.toLowerCase().includes(this.input.toLowerCase());
  }


  /**
   * Subscribes to the products$ observable from the database and initializes and sorts the product list.
   */
  subProductsList() {
    this.database.products$.subscribe(product => {
      this.products = product;
      this.filteredData = product;
      this.sortByTitle();
    });
  }


  /**
   * Sorts the product list by title in ascending order.
   * 
   * @returns {any[]} The sorted product list.
   */
  sortByTitle() {
    this.selectedFilter = 'title';
    return this.products.sort((a, b) => a.title.localeCompare(b.title));
  }


  /**
   * Sorts the product list by type in ascending order.
   * 
   * @returns {any[]} The sorted product list.
   */
  sortByType() {
    this.selectedFilter = 'type';
    return this.products.sort((a, b) => a.type.localeCompare(b.type));
  }


  /**
   * Sorts the product list by price in ascending order.
   * 
   * @returns {any[]} The sorted product list.
   */
  sortByPrice() {
    this.selectedFilter = 'price';
    return this.products.sort((a, b) => {
      return a.value - b.value;
    });
  }

}

