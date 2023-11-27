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


  /**
   * Navigates using the AuthService and subscribes to the user list.
   */
  ngOnInit(): void {
    this.authService.navigate();
    this.subUsersList();
  }


  /**
   * Filters the user data based on the input value.
   */
  filterData() {
    if (this.input) {
      this.filteredData = this.usersList.filter(item => this.firstOrLastNameOrCityMatchesInput(item));
    } else {
      this.filteredData = this.usersList;
    }
  }


  /**
   * Checks if the first name, last name, or city of the given user matches the input.
   * 
   * @param {any} item - The user to be checked.
   * @returns {boolean} True if the user matches the input, false otherwise.
   */
  firstOrLastNameOrCityMatchesInput(item: any) {
    return item.firstName.toLowerCase().includes(this.input.toLowerCase()) ||
      item.lastName.toLowerCase().includes(this.input.toLowerCase()) ||
      item.city.toLowerCase().includes(this.input.toLowerCase());
  }


  /**
   * Opens a dialog to add a new user.
   */
  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, { panelClass: 'custom-container' });
  }


  /**
   * Subscribes to the usersList$ observable from the database and initializes and sorts the user list.
   */
  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.filteredData = usersList;
      this.sortUsersByFirstName();
    });
  }


  /**
   * Sorts the user list by first name in ascending order.
   * 
   * @returns {any[]} The sorted user list.
   */
  sortUsersByFirstName() {
    return this.usersList.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }


  /**
   * Sorts the user list by last name in ascending order.
   * 
   * @returns {any[]} The sorted user list.
   */
  sortUsersByLastName() {
    return this.usersList.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }


  /**
   * Sorts the user list by city in ascending order.
   * 
   * @returns {any[]} The sorted user list.
   */
  sortUsersByCity() {
    return this.usersList.sort((a, b) => a.city.localeCompare(b.city));
  }

} 
