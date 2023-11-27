import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/models/user.class';
import { AuthService } from '../auth.service';
import { DatabaseService } from '../database.service';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  showNavbar: boolean = true;
  @ViewChild('drawer') drawer!: MatDrawer;
  userId: any = '';
  usersList: User[] = [];
  userName: string = '';
  currentUrl: string = '';
  currentUserId: string = '';


  constructor(private router: Router, private database: DatabaseService, private authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.currentUrl = this.router.url;
    this.subUsersList();
    this.subURL()
  }


  /**
   * Logs the user out by signing them out.
   */
  logout() {
    this.authService.signOutUser();
  }


  /**
   * Checks if the screen size is considered small based on the breakpoint observer.
   * 
   * @returns {boolean} True if the screen is considered small, false otherwise.
   */
  isSmallScreen() {
    return this.breakpointObserver.isMatched('(max-width: 1000px)');
  }


  /**
   * Subscribes to router events to manage the visibility of the navbar based on the current route.
   */
  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.url !== '/' && event.url !== '/sign-up';
      if (this.showNavbar) {
        document.getElementById('drawer')?.classList.remove('d-none');
        document.getElementById('menu')?.classList.remove('d-none');
      } else {
        document.getElementById('drawer')?.classList.add('d-none');
        document.getElementById('menu')?.classList.add('d-none');
      }
    });
  }


  /**
   * Toggles the visibility of the drawer in the UI.
   */
  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }


  /**
   * Checks if the provided router link is the currently active route.
   * 
   * @param {string} routerLink - The router link to check.
   * @returns {boolean} True if the provided router link is the currently active route, false otherwise.
   */
  sidenavFocus(routerLink: string) {
    return this.router.isActive(routerLink, true);
  }


  /**
   * Subscribes to router events to track changes in the URL.
   */
  subURL() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.getUserFromId();
      }
    });
  }


  /**
   * Subscribes to the usersList$ observable from the database and updates the usersList property.
   */
  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    });
  }


  /**
   * Gets user information based on the current URL and updates relevant properties.
   */
  getUserFromId() {
    this.usersList.forEach(user => {
      if (this.currentUrl == "/user/" + user.id) {
        this.currentUserId = user.id;
        this.userName = user.firstName + ' ' + user.lastName;
      }
    });
  }

}
