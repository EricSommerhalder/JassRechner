import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as firebase from "firebase";
import {Game} from "../game.model";
import {DataService} from "../data.service";
import {AuthService} from '../auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from 'firebase';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from '../popupdialog/popupdialog.component';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-tafel',
  templateUrl: './tafel.component.html',
  styleUrls: ['./tafel.component.css']
})
export class TafelComponent implements OnInit {
  punktzahl: number;
  summe: number[];
  match_this_game: number[];
  game: Game;
  gameObservable: Subscription;
  constructor(public router: Router, public dataService: DataService, public authService: AuthService, private firestore: AngularFirestore, private dialog: MatDialog) {
    this.game = new Game();
    this.punktzahl = -1;
    this.summe = [0, 0];
    this.match_this_game = [0, 0];
  }
  scoreEnter(value:string){
    if (value.length === 0){
      this.punktzahl = -1;
      return;
    }
    const neu = Number(value);
    if (Number.isNaN(neu)){
      this.punktzahl = -1;
      return;
    }
    this.punktzahl = neu;
  }
  async disciplineEnter(diszi:number){
    if (this.game.edit_mode){
      if (this.game.gamestate[diszi] !== -1) {
        if (this.game.team_done[0] && this.game.team_done[1]){
          if (this.summe[0] > this.summe[1]){
            this.game.totalpoints[0] -= this.game.pointsPerGame;
          }
          if (this.summe[1] > this.summe[0]){
            this.game.totalpoints[1] -= this.game.pointsPerGame;
          }
        }
        if (this.game.gamestate[diszi] % 257 === 0 && this.game.gamestate[diszi] !== 0){
          if (diszi <= 9){
            this.game.totalpoints[0] = this.game.totalpoints[0] - this.game.pointsPerMatch;
          }
          else {
           this.game.totalpoints[1] = this.game.totalpoints[1] - this.game.pointsPerMatch;
          }
        }
        if (this.game.gamestate[diszi] === 0){
          if (diszi <= 9){
            this.game.totalpoints[1] -= this.game.pointsPerCounterMatch;
          }
          else {
            this.game.totalpoints[0] -= this.game.pointsPerCounterMatch;
          }
        }
        this.game.gamestate[diszi] = -1;
        this.game.edit_mode = false;
        this.game.correction_mode = true;
      }
    }
    else {
      if (this.game.gamestate[diszi] !== -1){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Diese Disziplin hat bereits einen Wert',
          leftMessage: 'Alles klar!',
          rightMessage: ''
        };
        this.dialog.open(PopupdialogComponent, dialogConfig);
        this.punktzahl = -1;
        return;
      }
      if (this.punktzahl < 0 || this.punktzahl > 257 || (this.punktzahl > 156 && this.punktzahl < 257)){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Wert muss zwischen 0 und 156 oder 257 sein',
          leftMessage: 'Alles klar!',
          rightMessage: ''
        };
        this.dialog.open(PopupdialogComponent, dialogConfig);
        this.punktzahl = -1;
        return;
      }
      if (diszi > 9) {
        this.game.gamestate[diszi] = this.punktzahl * (diszi - 9);
        if (this.punktzahl === 257){
          this.game.totalpoints[1] = this.game.totalpoints[1] + this.game.pointsPerMatch;
        }
        if (this.punktzahl === 0){
          this.game.totalpoints[0]  += this.game.pointsPerCounterMatch;
        }
      }
      else {
        this.game.gamestate[diszi] = this.punktzahl * (diszi + 1);
        if (this.punktzahl === 257){
          this.game.totalpoints[0] = this.game.totalpoints[0] + this.game.pointsPerMatch;
        }
        if (this.punktzahl === 0){
          this.game.totalpoints[1] += this.game.pointsPerCounterMatch;
        }
      }
      if (this.game.correction_mode){
        this.game.correction_mode = false;
      }
      else {
        this.checkDone();
        this.getNewAusgeber();
      }
    }
    this.updateFields();
    if (this.game.team_done[0] && this.game.team_done[1]) {
      console.log('Recognized both teams done');
      if (this.summe[0] > this.summe[1]){
        this.game.totalpoints[0] += this.game.pointsPerGame;
      }
      if (this.summe[1] > this.summe[0]){
        this.game.totalpoints[1] += this.game.pointsPerGame;
      }
    }
    if (this.game.totalpoints[0] >= this.game.tournamentWonWith || this.game.totalpoints[1] >= this.game.tournamentWonWith){
      await this.openFinishMatchDialog();
    }
    this.punktzahl = -1;
    this.storeGame();
  }
  editButtonClicked(){
    if (!this.game.correction_mode) {
      this.game.edit_mode = !this.game.edit_mode;
    }
    this.storeGame();
  }
  checkDone(){
    let i = 0;
    this.game.team_done = [true, true];
    while (i < 10){
      if (this.game.gamestate[i] === -1){this.game.team_done[0] = false;  }
      i++;
    }
    while (i < 20){
      if (this.game.gamestate[i] === -1){this.game.team_done[1] = false;  }
      i++;
    }
  }
  getNewAusgeber(){
    if (this.game.team_done[0] && this.game.team_done[1]){
      return;
    }
    if (!this.dataService.currentlyFour) {
      if (this.game.ausgeber < 3) {
        if (this.game.team_done[0]) {
          this.game.ausgeber = (this.game.ausgeber + 1) % 3;
        } else {
          this.game.ausgeber += 3;
        }
      } else {
        if (this.game.team_done[1]) {
          this.game.ausgeber++;
          if (this.game.ausgeber > 5) {
            this.game.ausgeber = 3;
          }
        } else {
          this.game.ausgeber = (this.game.ausgeber - 2) % 3;
        }
      }
    } else {
      switch (this.game.ausgeber) {
        case 0:
          if (this.game.team_done[0]) {
            this.game.ausgeber = 1;
          }
          else {
            this.game.ausgeber = 3;
          }
          break;
        case 1:
          if (this.game.team_done[0]) {
            this.game.ausgeber = 0;
          }
          else {
            this.game.ausgeber = 4;
          }
          break;
        case 3:
          if (this.game.team_done[1]) {
            this.game.ausgeber = 4;
          }
          else {
            this.game.ausgeber = 1;
          }
          break;
        case 4:
          if (this.game.team_done[1]) {
            this.game.ausgeber = 3;
          }
          else {
            this.game.ausgeber = 0;
          }
          break;
        default:
          break;
      }
    }
  }
  storeGame(){
    if (this.dataService.gameId.length > 0){
      this.dataService.updateGame(this.dataService.gameId, this.game);
    }
    else{
      this.dataService.createGame(this.game, this.dataService.chosenGroup);
    }
  }
  async openFinishGameDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Spiel fertig?',
      leftMessage: 'Noch korrigieren',
      rightMessage: 'Bedanke mich'
    };
    const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( async result => {
      if (result === 'yes'){
        await this.finishGame();
      }
    });
  }
  async finishGame(){
    if (this.dataService.currentlyCash){
      await this.finishMatch();
      return;
    }
    this.game.gamestate = Array(20).fill(-1);
    this.game.team_done = [false, false];
    this.storeGame();
    this.updateFields();
    if (this.game.totalpoints[0] >= this.game.tournamentWonWith || this.game.totalpoints[1] >= this.game.tournamentWonWith){
      await this.openFinishMatchDialog();
    }

  }
  async openFinishMatchDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Das Turnier ist beendet!',
      leftMessage: 'Noch korrigieren',
      rightMessage: 'Nächstes Spiel'
    };
    const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
    await dialogRef.afterClosed().subscribe( async result => {
      if (result === 'yes') { await this.finishMatch(); }});
  }
  async finishMatch(){
        const temp = {playernames: this.game.playernames, teamnames: this.game.teamnames, pointsPerMatch: this.game.pointsPerMatch, pointsPerCounterMatch: this.game.pointsPerCounterMatch, pointsPerGame: this.game.pointsPerGame, tournamentWonWith: this.game.tournamentWonWith, user: this.game.user, amountPer100: this.game.amountPer100, minimalAmount: this.game.minimalAmount};
        this.game.active = false;
        this.game.endDate = this.game.getToday();
        this.storeGame();
        this.dataService.gameId = '';
        this.game = new Game();
        this.game.playernames = temp.playernames;
        this.game.teamnames = temp.teamnames;
        this.game.pointsPerMatch = temp.pointsPerMatch;
        this.game.pointsPerCounterMatch = temp.pointsPerCounterMatch;
        this.game.pointsPerGame = temp.pointsPerGame;
        this.game.user = temp.user;
        this.game.tournamentWonWith = temp.tournamentWonWith;
        this.game.minimalAmount = temp.minimalAmount;
        this.game.amountPer100 = temp.amountPer100;
        this.storeGame();
        this.gameObservable.unsubscribe();
        await this.dataService.getGameId();
        this.gameObservable = this.getSubscription();
        this.updateFields();
  }
  updateFields(){
    this.summe = [0, 0];
    this.match_this_game = [0, 0];
    let i = 0;
    while (i < 10){
      if (this.game.gamestate[i] === 0){
        this.match_this_game[1] += this.game.pointsPerCounterMatch;
      }
      if (this.game.gamestate[i] % 257 === 0 && this.game.gamestate[i] !== 0){
        this.match_this_game[0] += this.game.pointsPerMatch;
      }
      if (this.game.gamestate[i] !== -1) {
        this.summe[0] += this.game.gamestate[i];
      }
      i++;
    }
    while (i < 20){
      if (this.game.gamestate[i] === 0){
        this.match_this_game[0] += this.game.pointsPerCounterMatch;
      }
      if (this.game.gamestate[i] % 257 === 0 && this.game.gamestate[i] !== 0){
        this.match_this_game[1] += this.game.pointsPerMatch;
      }
      if (this.game.gamestate[i] !== -1) {
        this.summe[1] += this.game.gamestate[i];
      }
      i++;
    }
  }
  abortGame(){
    if (this.game.team_done[0] && this.game.team_done[1]) {
      if (this.summe[0] > this.summe[1]){
        this.game.totalpoints[0] -= this.game.pointsPerGame;
      }
      if (this.summe[1] > this.summe[0]){
        this.game.totalpoints[1] -= this.game.pointsPerGame;
      }
    }
    for (let i = 0; i < 10; i++){
      if (this.game.gamestate[i] % 257 === 0 && this.game.gamestate[i] !== 0){
        this.game.totalpoints[0] -= this.game.pointsPerMatch;
      }
      if (this.game.gamestate[i] === 0){
        this.game.totalpoints[1] -= this.game.pointsPerCounterMatch;
      }
      if (this.game.gamestate[i + 10] % 257 === 0 && this.game.gamestate[i + 10] !== 0){
        this.game.totalpoints[1] -= this.game.pointsPerMatch;
      }
      if (this.game.gamestate[i + 10] === 0){
        this.game.totalpoints[0] -= this.game.pointsPerCounterMatch;
      }
      this.game.gamestate[i] = -1;
      this.game.gamestate[i + 10] = -1;
    }
    this.game.team_done[0] = false;
    this.game.team_done[1] = false;
    this.game.ausgeber = Math.floor(Math.random() * 6);
    this.storeGame();
    this.updateFields();
  }
  async openAbortGameDialog(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Spiel abbrechen?',
      leftMessage: 'Nein',
      rightMessage: 'Ja'
    };
    const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( async result => {
      if (result === 'yes'){
        this.abortGame();
      }
    });
  }
  getToday(){
    const date = new Date();
    return date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();
  }
  async updateSub() {
    this.gameObservable.unsubscribe();
    await this.dataService.getGameId();
    this.gameObservable = await this.getSubscription();
  }
  getSubscription(){
    return this.dataService.getGameObservable().subscribe(async a => {
      console.log('Changed to subscription with ID:', a.payload.id);
      this.game = a.payload.data() as Game;
      this.updateFields();
      if (!this.game.active) {
        // this.gameObservable.unsubscribe();
        console.log('Caught inactive');
        /*await this.dataService.getGameId(this.game.user);
        console.log('Changed Game ID to', this.dataService.gameId);
        this.gameObservable = await this.getSubscription();
         */
        window.location.reload();
        // await this.updateSub();
      }
      });
  }
  getCoiffeurString(): string {
    if (this.dataService.currentlyFour) {
      return '3-3-3';
    }
    return '2-2-2';
  }
  getCashAmount(): number {
      const amount = Math.abs((this.summe[0] - this.summe[1]) * this.game.amountPer100 / 100);
      if (amount > this.game.minimalAmount) {
        return amount;
      }
      return this.game.minimalAmount;
  }
  async ngOnInit(){
    this.authService.checkLoggedIn();
    const user: User = await this.authService.getUserAsync() as User;
    this.game.user = user.email;
    await this.dataService.init(user.email);
    if (this.dataService.gameId.length > 0){
      this.game = await this.dataService.loadGame();
      this.updateFields();
    }
    if (this.dataService.chosenGroup.length === 0){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Zur Zeit ist noch keine Gruppe ausgewählt. Bitte zu Settings wechseln und eine Gruppe erstellen oder auswählen.',
        rightMessage: 'Ab zu Settings!',
        leftMessage: 'Später! (nicht empfohlen)'
      };
      const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe( async result => {
        if (result === 'yes'){
          this.router.navigateByUrl('/settings');
        }
      });
    }
    this.gameObservable = await this.getSubscription();
    if (this.dataService.currentlyCash){
      this.game.pointsPerCounterMatch = 0;
      this.game.pointsPerGame = 0;
      this.game.pointsPerMatch = 0;
      this.game.tournamentWonWith = 1000000;
    }
    while (this.dataService.currentlyFour && (this.game.ausgeber === 2 || this.game.ausgeber === 5)){
      this.game.ausgeber = Math.floor(Math.random() * 6);
    }
  }
}
