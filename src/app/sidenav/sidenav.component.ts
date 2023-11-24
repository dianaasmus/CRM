import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/models/user.class';
import { AuthService } from '../auth.service';
import { DatabaseService } from '../database.service';
import { MediaMatcher } from '@angular/cdk/layout';



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


  constructor(private router: Router, private database: DatabaseService, private authService: AuthService, private mediaMatcher: MediaMatcher) {
    this.currentUrl = this.router.url;
    this.subUsersList();
    this.subURL()
  }


  logout() {
    this.authService.signOutUser();
  }


  isSmallScreen(): boolean {
    return this.mediaMatcher.matchMedia('(max-width: 1000px)').matches;
  }


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


  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }


  sidenavFocus(routerLink: string) {
    return this.router.isActive(routerLink, true);
  }


  subURL() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.getUserFromId();
      }
    });
  }


  subUsersList() {
    this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    });
  }


  getUserFromId() {
    this.usersList.forEach(user => {
      if (this.currentUrl == "/user/" + user.id) {
        this.currentUserId = user.id;
        this.userName = user.firstName + ' ' + user.lastName;
      }
    });
  }


}
