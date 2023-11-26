import { Component } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth } from "firebase/auth";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
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
  signupForm!: FormGroup;


  constructor(private router: Router, private formbuilder: FormBuilder) { }


  ngOnInit() {
    this.signupForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)] ],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  signUp() {
    this.loading = true;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
      .finally(() => {
        this.loading = false;
        this.redirectUser();
      });
  }


  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
