import {Component, NgZone, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from "firebase";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from '../popupdialog/popupdialog.component';


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
    private fb: FormBuilder,
    public dialog: MatDialog,
    public ngZone: NgZone
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
        this.router.navigate(['/tafel']);
      });
  }
  tryGoogleLogin(){
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/tafel']);
      });
  }

  tryLogin(value){
    this.authService.doLogin(value)
      .then(res => {
        this.router.navigate(['/tafel']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }
  forgotPassword(email: string){
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(email).then(a => this.createDialog('E-mail zum Passwort ändern wurde gesendet')).catch(error => this.createDialog('Da ist etwas schiefgegangen. Bitte nochmals versuchen'));
  }
  createDialog(message: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: message,
      leftMessage: 'Alles klar!',
      rightMessage: ''
    };
    this.dialog.open(PopupdialogComponent, dialogConfig);
  }
  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(user => this.ngZone.run(() => {
      if (user) {
        this.router.navigate(['/tafel']);
      }
    }));
  }
}
