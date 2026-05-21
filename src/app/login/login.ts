import { Component }
from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AuthService
} from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './login.html',

  styleUrl:
    './login.css'
})
export class LoginComponent {

  email = '';
  password = '';

  errorMessage = '';

  constructor(
    private authService:
    AuthService
  ) {}

  login() {

    this.errorMessage = '';
    

    if (!this.email) {
      this.errorMessage =
        'Email is required';
      return;
    }

    if (!this.password) {
      this.errorMessage =
        'Password is required';
      return;
    }

    const success =
      this.authService.login(
        this.email,
        this.password
      );

    if (!success) {

      this.errorMessage =
        'Invalid email or password';
    }
    
  }
}