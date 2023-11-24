import { Component, inject } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  firestore: Firestore = inject(Firestore);
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
  loading: boolean = false; // _____________________________________________


  constructor(private router: Router) { }


  signUp(loginForm: NgForm) {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
      .finally(() => {
        loginForm.resetForm();
      });
  }

  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
