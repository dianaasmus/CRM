import { Component } from '@angular/core';
import { signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading: boolean = false;
  showLoginOptions: boolean = true;
  loginForm!: FormGroup;
  userNotFound: boolean = false;
  signUp: boolean = false;
  signupForm!: FormGroup;


  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
    this.setSignUpForm();
    this.setLoginForm();
  }


  /**
   * Resets the signup form, hides login options, and sets the signup flag to true.
   */
  setNewUser() {
    this.signupForm.reset();
    this.showLoginOptions = false;
    this.signUp = true
  }


  /**
   * Resets the login form and sets the signup flag to false.
   */
  alreadyUser() {
    this.loginForm.reset();
    this.signUp = false;
  }


  /**
   * Resets the login form, shows login options, and sets the signup flag to false.
   */
  loginOptionsReset() {
    this.showLoginOptions = true;
    this.signUp = false;
    this.loginForm.reset();
  }


  /**
   * Gets the active form based on the current signup flag.
   *
   * @returns {FormGroup} The active form (signupForm or loginForm).
   */
  getForm() {
    return this.signUp ? this.signupForm : this.loginForm;
  }


  /**
   * Sets up the sign-up form using Angular Reactive Forms, including custom password matching validation.
   */
  setSignUpForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }


  /**
   * Custom validator function to check if the password and confirmPassword fields match.
   * 
   * @param {FormGroup} formGroup - The form group containing the password and confirmPassword fields.
   * @returns {null | { passwordMismatch: true }} Null if the passwords match, otherwise an object indicating a password mismatch.
   */
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  /**
   * Attempts to sign up a new user using the provided email and password.
   * 
   * @throws {Error} If there is an error during the sign-up process.
   */
  async signUpUser() {
    this.loading = true;
    await createUserWithEmailAndPassword(this.authService.auth, this.signupForm.value.email, this.signupForm.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
      .finally(() => {
        this.loading = false;
        this.authService.openSnackBar('Registration was successful!');
        this.redirectUser();
      });
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
