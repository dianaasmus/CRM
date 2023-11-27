import { Component } from '@angular/core';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  loading: boolean = false;
  signupForm!: FormGroup;


  constructor(private router: Router, private formbuilder: FormBuilder, private authService: AuthService) {
    this.setSignUpForm();
  }


  /**
   * Sets up the sign-up form using Angular Reactive Forms, including custom password matching validation.
   */
  setSignUpForm() {
    this.signupForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
  async signUp() {
    this.loading = true;
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;

    await createUserWithEmailAndPassword(this.authService.auth, email, password)
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
   * Redirects the user to the dashboard after successful sign-up.
   */
  redirectUser() {
    this.router.navigate(['/dashboard']);
  }

}
