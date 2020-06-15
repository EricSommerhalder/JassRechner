import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from "firebase";


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
      .then(res => {
        this.router.navigate(['/settings']);
      });
  }
  tryGoogleLogin(){
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/settings']);
      });
  }

  tryLogin(value){
    this.authService.doLogin(value)
      .then(res => {
        this.router.navigate(['/settings']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }
  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.router.navigateByUrl('/settings');
      }
    });
  }
}
