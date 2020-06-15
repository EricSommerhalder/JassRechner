import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as firebase from "firebase";
import {Game} from "../game.model";
import {DataService} from "../data.service";
import {AuthService} from '../auth.service';

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
  constructor(public router: Router, public dataService: DataService, public authService: AuthService) {
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
  disciplineEnter(diszi:number){
    if (this.game.edit_mode){
      if (this.game.gamestate[diszi] !== -1) {
        if (this.game.gamestate[diszi] % 257 === 0 && this.game.gamestate[diszi] !== 0){
          if (diszi < 9){
            this.game.totalpoints[0] = this.game.totalpoints[0] - 0.5;
          }
          else {
           this.game.totalpoints[1] = this.game.totalpoints[1] - 0.5;
          }
        }
        if (this.game.gamestate[diszi] === 0){
          if (diszi < 9){
            this.game.totalpoints[1]--;
          }
          else {
            this.game.totalpoints[0]--;
          }
        }
        this.game.gamestate[diszi] = -1;
        this.game.edit_mode = false;
        this.game.correction_mode = true;
      }
    }
    else {
      if (this.game.gamestate[diszi] !== -1 || this.punktzahl < 0){
         return; // TODO: Add dialog that entry was impossible, as the value was impossible or the discipline was already full
      }
      if (diszi > 9) {
        this.game.gamestate[diszi] = this.punktzahl * (diszi - 9);
        if (this.punktzahl === 257){
          this.game.totalpoints[1] = this.game.totalpoints[1] + 0.5;
        }
        if (this.punktzahl === 0){
          this.game.totalpoints[0]++;
        }
      }
      else {
        this.game.gamestate[diszi] = this.punktzahl * (diszi + 1);
        if (this.punktzahl === 257){
          this.game.totalpoints[0] = this.game.totalpoints[0] + 0.5;
        }
        if (this.punktzahl === 0){
          this.game.totalpoints[1]++;
        }
      }
      this.checkDone();
      if (this.game.correction_mode){
        this.game.correction_mode = false;
      }
      else {
        this.getNewAusgeber();
      }
      if (this.game.team_done[0] && this.game.team_done[1]){
        this.finishGame();
      }
    }
    this.summe = [0, 0];
    this.match_this_game = [0, 0];
    let i = 0;
    while (i < 10){
      if (this.game.gamestate[i] === 0){
        this.match_this_game[1] ++;
      }
      if (this.game.gamestate[i] % 257 === 0 && this.game.gamestate[i] !== 0){
        this.match_this_game[0] += 0.5;
      }
      if (this.game.gamestate[i] !== -1) {
        this.summe[0] += this.game.gamestate[i];
      }
      i++;
    }
    while (i < 20){
      if (this.game.gamestate[i] === 0){
        this.match_this_game[0]++;
      }
      if (this.game.gamestate[i] % 257 === 0 && this.game.gamestate[i] !== 0){
        this.match_this_game[1] += 0.5;
      }
      if (this.game.gamestate[i] !== -1) {
        this.summe[1] += this.game.gamestate[i];
      }
      i++;
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
    if (this.game.ausgeber < 3){
      this.game.ausgeber += 3;
    }
    else if (this.game.ausgeber < 5){
      this.game.ausgeber -= 2;
      return;
    }
    else {this.game.ausgeber = 0; }
    if ((this.game.ausgeber < 3 && this.game.team_done[1]) || (this.game.ausgeber > 2 && this.game.team_done[0])){ //team schon fertig
      console.log('Unerlaubter Ausgeber', this.game.playernames[this.game.ausgeber]);
      this.getNewAusgeber();
    }
  }
  storeGame(){
    this.dataService.createGame(this.game);
  }
  finishGame(){
    // TODO add finish Game dialog
  }
  ngOnInit(): void {
    this.authService.checkLoggedIn();
    this.game.user = this.authService.getUser().email;
    let allGames: any = null;
    this.dataService.getGames().subscribe(res => allGames = res);
    for (const game of allGames){
      if (this.dataService.getPropertyOfObservable(game, 'user') === this.game.user && this.dataService.getPropertyOfObservable(game, 'active') ){
      }
    }
  }
}
