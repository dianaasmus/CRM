import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
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
 

  constructor(private authService: AuthService, private database: DatabaseService) { }
  

  ngOnInit(): void {
    this.authService.navigate();
    this.subProductsList();
  }


  filterData() {
    if (this.input) {      
      this.filteredData = this.products.filter(item => this.titleOrTypeOrPriceMatchesInput(item));
    } else {
      this.filteredData = this.products;
    }
  }


  titleOrTypeOrPriceMatchesInput(item: any) {
    return item.title.toLowerCase().includes(this.input.toLowerCase()) || 
    item.type.toLowerCase().includes(this.input.toLowerCase()) || 
    item.price.toLowerCase().includes(this.input.toLowerCase());
  }


  subProductsList() {
    this.database.products$.subscribe(product => {
      this.products = product;  
      this.filteredData = product;  
      this.sortByTitle();    
    });
  }


  sortByTitle() {
    return this.products.sort((a, b) => a.title.localeCompare(b.title));
  }


  sortByType() {
    return this.products.sort((a, b) => a.type.localeCompare(b.type));
  }


  sortByPrice() {
    return this.products.sort((a, b) => {
      return a.value - b.value;
    });
  }
  
}

