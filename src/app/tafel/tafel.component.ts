import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as firebase from "firebase";
import {Game} from "../game.model";

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
  constructor(public router: Router) {
    this.game = new Game();
    this.punktzahl = -1;
    this.summe = [0, 0];
    this.match_this_game = [0, 0];
  }
  scoreEnter(value:string){
    const neu = Number(value);
    if (Number.isNaN(neu)){
      return;
    }
    this.punktzahl = neu;
  }
  disciplineEnter(diszi:number){
    if (this.game.edit_mode){
      if (this.game.gamestate[diszi] !== -1) {
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
      }
      else {
        this.game.gamestate[diszi] = this.punktzahl * (diszi + 1);
      }
      this.checkDone();
      if (this.game.correction_mode){
        this.game.correction_mode = false;
      }
      else {
        this.getNewAusgeber();
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
    while(i<20){
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
  }
  editButtonClicked(){
    if (!this.game.correction_mode) {
      this.game.edit_mode = !this.game.edit_mode;
    }
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
  ngOnInit(): void {
    const user = firebase.auth().currentUser;
    if (!user){
      this.router.navigateByUrl('/login');
    }
    this.game.user = user.email;
  }

}
