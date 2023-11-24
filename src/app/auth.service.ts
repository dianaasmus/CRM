import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Router } from '@angular/router';
import { signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();


  constructor(private router: Router) { }


  navigate() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (!user) {
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }
      } 
    });
  }


  signOutUser() {
    signOut(this.auth)
      .then(() => {
        console.log('User erfolgreich ausgeloggt');
      })
      .catch((error) => {
        console.error('Fehler beim Ausloggen:', error);
      });
  }

}
