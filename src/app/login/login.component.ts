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


  /**
   * Sets up the login form using Angular Reactive Forms.
   */
  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  /**
   * Attempts to sign in the user using provided email and password.
   * 
   * @throws {Error} If the provided credentials are invalid.
   */
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


  /**
   * Attempts to sign in the user anonymously.
   * 
   * @throws {Error} If an error occurs during anonymous sign-in.
   */
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


  /**
   * Redirects the user to the dashboard after successful sign-in.
   */
  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
