import { Component } from '@angular/core';
import { signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading: boolean = false;
  login: boolean = false;
  loginForm!: FormGroup;
  userNotFound: boolean = false;


  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
    this.setLoginForm();
  }


  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  async signIn() {
    this.loading = true;
    await signInWithEmailAndPassword(this.authService.auth, this.loginForm.value.email, this.loginForm.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-login-credentials') {
          this.userNotFound = true;
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        this.loading = false;
        this.authService.openSnackBar('Logged in successfully!');
        this.redirectUser();
      });
  }


  async signInAnonymously() {
    this.loading = true;
    await signInAnonymously(this.authService.auth)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
      .finally(() => {
        this.loading = false;
        this.authService.openSnackBar('Logged in as Guest!');
        this.redirectUser();
      });
  }


  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
