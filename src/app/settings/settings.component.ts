import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import {User} from 'firebase';
import {stringify} from 'querystring';
import * as firebase from 'firebase';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from '../popupdialog/popupdialog.component';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  game: Game = new Game();
  constructor(public authService: AuthService, public router: Router, public dataService: DataService, public dialog: MatDialog) { }

  storeGame(){
    if (this.dataService.gameId.length > 0){
      this.dataService.updateGame(this.dataService.gameId, this.game);
    }
    else{
      this.dataService.createGame(this.game);
    }
  }
  updateNumberProperty(identifier: number, value: string){
    if (value.length === 0){
      return;
    }
    const val = Number(value);
    if (Number.isNaN(val)){
      return;
    }
    switch (identifier){
      case 1:
        for (const points of this.game.gamestate){
          if (points % 257 === 0 && points !== 0){
            console.log('Cannot change, value in use');
            return;
          }
        }
        this.game.pointsPerMatch = val;
        break;
      case 2:
        if (this.game.gamestate.indexOf(0) !== -1){
          console.log('Cannot change, value in use');
          return;
        }
        this.game.pointsPerCounterMatch = val;
        break;
      case 3:
        this.game.pointsPerGame = val;
        break;
      case 4:
        this.game.tournamentWonWith = val;
        break;
      default:
        break;
    }
    this.storeGame();
  }
  emptyPlayerFields() {
    for (let i = 1; i < 4; i++) {
      this.game.playernames[i - 1] = 'Spieler A' + i.toString();
    }
    for (let i = 4; i < 7; i++) {
      this.game.playernames[i - 1] = 'Spieler B' + (i - 3).toString();
    }
    this.storeGame();
    window.location.reload();
  }
  async fireChangePassword(oldPassword, newPassword, confirmNewPassword){
    if (newPassword !== confirmNewPassword){
      this.createDialog('Neues Passwort wurde nicht zweimal gleichangegeben');
      return;
    }
    if (oldPassword.length < 6){
      this.createDialog('Passwort muss mindestens 6 Stellen haben');
      return;
    }
    const user = await this.authService.getUserAsync() as User;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
    user.reauthenticateWithCredential(cred).then(success => user.updatePassword(newPassword)).then( a => {
      this.createDialog('Passwort wurde geändert'); }).catch(error => {
        this.createDialog('Da ist etwas schiefgegangen. Nochmals probieren bitte');
      });
  }
  async fireDeleteUser(password) {
    const user = await this.authService.getUserAsync() as User;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, password);
    user.reauthenticateWithCredential(cred).then(success => user.delete().then(a => {
      this.createDialog('User gelöscht. Danke fürs Jassen!');
      this.authService.doLogout();
    }).catch(error => this.createDialog('Da ist etwas schiefgegangen. Nochmals probieren bitte')));
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
  async ngOnInit() {
    console.log('Reached Settings');
    this.authService.checkLoggedIn();
    const user: User = await this.authService.getUserAsync() as User;
    this.game.user = user.email;
    if (this.dataService.gameId.length === 0){
      await this.dataService.getGameId(this.game.user);
    }
    if (this.dataService.gameId.length > 0) {
      this.game = await this.dataService.loadGame();
    }
  }

}
