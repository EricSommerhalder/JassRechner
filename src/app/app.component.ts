import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'JassRechner';
  user: firebase.User =  firebase.auth().currentUser;
  constructor(private router: Router, public authService: AuthService) {
  }
  ngOnInit(){
  }

  account(): void {
    this.user = this.getUser();
    if (this.user) {
        this.authService.doLogout();
      } else {
        this.router.navigateByUrl('/login');
      }
  }
  getUser(){
    return firebase.auth().currentUser;
  }


}

