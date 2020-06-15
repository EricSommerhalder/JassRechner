import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {MatDialogModule} from '@angular/material/dialog';
import {PopupdialogComponent} from './popupdialog/popupdialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'JassRechner';
  user: firebase.User =  firebase.auth().currentUser;
  constructor(private router: Router, public authService: AuthService, private dialog: MatDialog) {
  }
  ngOnInit(){
  }
  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Log Out'
    };

    this.dialog.open(PopupdialogComponent, dialogConfig);
  }

}

