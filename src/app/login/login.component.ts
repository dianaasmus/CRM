import { Component, inject } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { signInAnonymously, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, User } from 'firebase/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
  auth: Auth = getAuth(this.app);
  provider = new GoogleAuthProvider();
  loading: boolean = false; // _____________________________________________
  login: boolean = false;
  loginForm: FormGroup;



  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }



  signIn() {
    try {
      signInWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.loginForm.reset();
          this.redirectUser();
          console.log(this.auth);

        })
    } catch {
      console.log(Error);
      
    }

    // signInWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     this.loginForm.reset();
    //     this.redirectUser();
    //     console.log(this.auth);

    //   })
    //   .catch((error) => {
    //     console.log(this.auth);

    //     if (error.code === 'auth/user-not-found') {
    //       this.handleError('Benutzer nicht gefunden');
    //     } else {
    //       this.handleError('Anderer Authentifizierungsfehler');
    //     }
    //   });
  }


  handleError(message: string) {
    // Was soll passieren
    console.log(message);

  }


  signInAnonymously() {
    signInAnonymously(this.auth)
      .then(() => {
        this.authService.navigate();
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
