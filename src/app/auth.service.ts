import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from './popupdialog/popupdialog.component';
import {User} from 'firebase';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, public router: Router, public dialog: MatDialog, public dataService: DataService) {
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.signOut();
        resolve();
        this.dataService.gameId = '';
        this.router.navigateByUrl('/login');
      } else {
        reject();
      }
    });
  }

  getUser() {
    return firebase.auth().currentUser;
  }
  getUserAsync(): Promise<any>{
    return new Promise((resolve, reject) => {
      try {
        firebase.auth()
          .onAuthStateChanged(user => {
            resolve(user);
          });
      } catch {
        reject('api failed');
      }
    });
  }

  openLogOutDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Abmelden?',
      leftMessage: 'Abbrechen',
      rightMessage: 'Ja, habe genug gejasst'
    };
    const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes'){
        this.doLogout();
      }
    });

  }
  checkLoggedIn(){
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        console.log('Not logged in, redirecting');
        this.router.navigateByUrl('/login');
      }});
  }
}
