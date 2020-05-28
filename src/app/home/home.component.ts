import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  punkte: number[]; // stores team 1 from 0-9, team 2 from 10-19
  punktzahl: number;
  summe: number[];
  match: number[];
  edit_mode: boolean;
  team_names: string[];
  player_names: string[]; // stores team 1 from 0-2, team 2 from 3-5
  ausgeber: number;
  team_done: boolean[];
  constructor() {
    this.punkte = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    this.punktzahl = -1;
    this.summe = [0, 0];
    this.match = [0, 0];
    this.edit_mode = false;
    this.team_names = ['Männer', 'Frauen'];
    this.player_names = ['Heinz', 'Eric', 'Bob Dylan', 'Claudia', 'Anja', 'Tina Turner'];
    this.ausgeber = Math.floor(Math.random() * 6);
    this.team_done = [false, false];
  }
  scoreEnter(value:string){
    const neu = Number(value);
    if (Number.isNaN(neu)){
      return;
    }
    this.punktzahl = neu;
    console.log(this.punktzahl);
  }
  disciplineEnter(diszi:number){
    if (this.edit_mode){
      this.punkte[diszi] = -1;
      this.edit_mode = false;
    }
    else {
      if (this.punkte[diszi] !== -1 || this.punktzahl < 0){
         return; // TODO: Add dialog that entry was impossible, as the value was impossible or the discipline was already full
      }
      if (diszi > 9) {
        if (this.ausgeber > 2){ // TODO add dialog that entry was impossible, as this is not the active team
          return;
        }
        this.punkte[diszi] = this.punktzahl * (diszi - 9);
      }
      else {
        if (this.ausgeber < 3){ // TODO add dialog that entry was impossible, as this is not the active team
          return;
        }
        this.punkte[diszi] = this.punktzahl * (diszi + 1);
      }
      this.checkDone();
      this.getNewAusgeber();
    }
    this.summe = [0, 0];
    this.match = [0, 0];
    let i = 0;
    while (i < 10){
      if (this.punkte[i] === 0){
        this.match[1] ++;
      }
      if (this.punkte[i] % 257 === 0 && this.punkte[i] !== 0){
        this.match[0] += 0.5;
      }
      if (this.punkte[i] !== -1) {
        this.summe[0] += this.punkte[i];
      }
      i++;
    }
    while(i<20){
      if (this.punkte[i] === 0){
        this.match[0]++;
      }
      if (this.punkte[i] % 257 === 0 && this.punkte[i] !== 0){
        this.match[1] += 0.5;
      }
      if (this.punkte[i] !== -1) {
        this.summe[1] += this.punkte[i];
      }
      i++;
    }
    this.punktzahl = -1;
  }
  editButtonClicked(){
    this.edit_mode = !this.edit_mode;
  }
  checkDone(){
    let i = 0;
    this.team_done = [true, true];
    while (i < 10){
      if (this.punkte[i] === -1){this.team_done[0] = false;  }
      i++;
    }
    while (i < 20){
      if (this.punkte[i] === -1){this.team_done[1] = false;  }
      i++;
    }
  }
  getNewAusgeber(){
    if (this.team_done[0] && this.team_done[1]){
      return;
    }
    if (this.ausgeber < 3){
      this.ausgeber += 3;
    }
    else if (this.ausgeber < 5){
      this.ausgeber -= 2;
      return;
    }
    else {this.ausgeber = 0; }
    if ((this.ausgeber < 3 && this.team_done[1]) || (this.ausgeber > 2 && this.team_done[0])){ //team schon fertig
      console.log('Unerlaubter Ausgeber', this.player_names[this.ausgeber]);
      this.getNewAusgeber();
    }
  }
  ngOnInit(): void {

  }

}
