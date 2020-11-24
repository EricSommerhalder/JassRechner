import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import {User} from 'firebase';
import {stringify} from 'querystring';
import * as firebase from 'firebase';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from '../popupdialog/popupdialog.component';
import {ElementRef} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

class Group {
  public name: string;
  public id: string;
  constructor(n: string, i: string) {
    this.name = n;
    this.id = i;
  }
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  @ViewChild('playerNameA1') playerNameA1: ElementRef;
  @ViewChild('playerNameA2') playerNameA2: ElementRef;
  @ViewChild('playerNameA3') playerNameA3: ElementRef;
  @ViewChild('playerNameB1') playerNameB1: ElementRef;
  @ViewChild('playerNameB2') playerNameB2: ElementRef;
  @ViewChild('playerNameB3') playerNameB3: ElementRef;
  game: Game = new Game();
  groups: Group[] = [];
  public fourPlayers = '';
  gameObservable: Observable<any>;
  cash = '';
  constructor(public authService: AuthService, public router: Router, public dataService: DataService, public dialog: MatDialog) { }

  async storeGame(){
    if (this.dataService.gameId.length > 0){
      this.dataService.updateGame(this.dataService.gameId, this.game);
    }
    else{
      await this.dataService.createGame(this.game, this.dataService.chosenGroup);
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
      case 5:
        this.game.amountPer100  = val;
        break;
      case 6:
        this.game.minimalAmount = val;
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
    this.playerNameA1.nativeElement.value = '';
    this.playerNameA2.nativeElement.value = '';
    this.playerNameA3.nativeElement.value = '';
    this.playerNameB1.nativeElement.value = '';
    this.playerNameB2.nativeElement.value = '';
    this.playerNameB3.nativeElement.value = '';
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
  getGroupNames(){
    this.dataService.firestore.collection('users').doc(this.dataService.userStorage).snapshotChanges().subscribe(
        (a) => {
          const groups = a.payload.data()['groups'];
          for (const group of groups) {
              this.dataService.firestore.collection('groups').doc(group).snapshotChanges().subscribe(
                (b) => {
                  for (const gr of this.groups) {
                    if (gr.id === b.payload.id) {
                      return;
                    }
                  }
                  const g = new Group(b.payload.data()['name'], b.payload.id);
                  this.groups.push(g);
                });
          }
        });
  }
  createGroup(name: string) {
    //TODO warnmäldige
    if (name === '') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Bitte einen Gruppennamen eingeben',
        leftMessage: 'Alles klar!',
        rightMessage: ''
      };
      this.dialog.open(PopupdialogComponent, dialogConfig);
      return;
    }
    if (this.fourPlayers === '') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Bitte Spieleranzahl aussuchen',
        leftMessage: 'Alles klar!',
        rightMessage: ''
      };
      this.dialog.open(PopupdialogComponent, dialogConfig);
      return;
    }
    if (this.cash === '') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Bitte Spielart aussuchen',
        leftMessage: 'Alles klar!',
        rightMessage: ''
      };
      this.dialog.open(PopupdialogComponent, dialogConfig);
      return;
    }
    this.dataService.createGroup(name, this.fourPlayers === '4', this.cash === 'cash');
    this.gameObservable = this.dataService.getGameObservable();
    this.gameObservable.subscribe(a => {this.game = a.payload.data(); });
  }
  async groupChanged(id: string) {
    await this.dataService.changeGroup(id);
    this.gameObservable = this.dataService.getGameObservable();
    this.gameObservable.subscribe(a => {this.game = a.payload.data(); });

  }

  deleteGroup(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'Gruppe wirklich löschen?',
      leftMessage: 'Nein!',
      rightMessage: 'Jepp!'
    };
    const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( async result => {
      if (result === 'yes'){
        this.groups = this.groups.filter(obj => obj.id !== id);
        await this.dataService.deleteGroup(id);
      }
    });
  }
  async ngOnInit() {
    this.authService.checkLoggedIn();
    const user: User = await this.authService.getUserAsync() as User;
    this.game.user = user.email;
    await this.dataService.init(user.email);
    this.getGroupNames();
    if (this.dataService.gameId.length === 0){
      await this.dataService.getGameId();
    }
    if (this.dataService.gameId.length > 0) {
      this.game = await this.dataService.loadGame();
    }
    this.gameObservable = this.dataService.getGameObservable();
    this.gameObservable.subscribe(a => {this.game = a.payload.data(); });
  }

}
