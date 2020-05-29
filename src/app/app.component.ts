import { Component } from '@angular/core';
import { LoginComponent, LoginData } from './login/login.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'JassRechner';
  logininfo = '';
  loggedin = false;
  constructor(public dialog: MatDialog) {
  }
 public openLoginDialog(): void {
    const loginConfig = new MatDialogConfig();
    loginConfig.autoFocus = true;
    loginConfig.width = '500px';
    loginConfig.height = '600px';
    loginConfig.data = {
      user: 'Heinz',
      password: ''
    };

    const dialogRef = this.dialog.open(LoginComponent, loginConfig);

    dialogRef.afterClosed().subscribe(
      data => {
          console.log(data);
          if (data.user === null || data.password === null ) { //here we can check if user matches password later
            this.openLoginDialog();
          } else {
            this.logininfo = data.user;
            this.loggedin = true;
          }
        });
  }

  public logout(): void {
    this.loggedin = false;
    this.logininfo = '';
  }

  account(): void {
    if (this.loggedin) {
      this.logout();
    } else {
      this.openLoginDialog();
    }
  }
}

