import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseConfig = {
    apiKey: "AIzaSyBBz_Mh-ZK_uL81UfYcn_TajI_nBadb7xY",
    authDomain: "simple-crm-2d008.firebaseapp.com",
    projectId: "simple-crm-2d008",
    storageBucket: "simple-crm-2d008.appspot.com",
    messagingSenderId: "651292357158",
    appId: "1:651292357158:web:1c0159cd692e3691d8ece7",
  };
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);


  constructor(private snackBar: MatSnackBar) { }


  signOutUser() {
    signOut(this.auth)
      .then(() => {
        this.openSnackBar('Successfully logged out!');
      })
      .catch((error) => {
        this.openSnackBar('Error when logging out!');
      });
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
