import { Component, Input } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { DatabaseService } from '../database.service';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  usersList: User[] = [];
  @Input() input!: string;
  filteredData!: any[];

  
  constructor(private authService: AuthService, private database: DatabaseService, public dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.authService.navigate();
    this.subUsersList();
  }


  filterData() {
    if (this.input) {      
      this.filteredData = this.usersList.filter(item => this.firstOrLastNameOrCityMatchesInput(item));
    } else {
      this.filteredData = this.usersList;
    }
  }


  firstOrLastNameOrCityMatchesInput(item: any) {
    return item.firstName.toLowerCase().includes(this.input.toLowerCase()) || 
    item.lastName.toLowerCase().includes(this.input.toLowerCase()) || 
    item.city.toLowerCase().includes(this.input.toLowerCase());
  }


  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, { panelClass: 'custom-container' });
  }


  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.filteredData = usersList;
      this.sortUsersByFirstName();
    });
  }


  sortUsersByFirstName() {
    return this.usersList.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }


  sortUsersByLastName() {
    return this.usersList.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }


  sortUsersByCity() {
    return this.usersList.sort((a, b) => a.city.localeCompare(b.city));
  }

} 
