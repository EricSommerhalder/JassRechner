import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'JassRechner';
  logininfo = '';
  isAuthenticated = false;
  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }
  ngOnInit(){
    this.oktaAuth.isAuthenticated().then((auth) => {this.isAuthenticated = auth});
  }
  login(){
    console.log("login called");
    this.oktaAuth.loginRedirect();
  }
  logout() {
    this.oktaAuth.logout('/');
  }
  account(): void {
    console.log("account() called");
    if (this.isAuthenticated) {
      this.logout();
    } else {
      this.login();
    }
  }
}

