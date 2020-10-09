import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {AuthService} from '../auth.service';
import {User} from "firebase";

class DisplayGame {
  teamNameA: string;
  teamNameB: string;
  pointsTeamA: number;
  pointsTeamB: number;
  startedOn: string;
  endedOn: string;
  paidOn: string;
  gameId: string;
  constructor() {
    this.teamNameA = '';
    this.teamNameB = '';
    this.pointsTeamA = -1;
    this.pointsTeamB = -1;
    this.startedOn = '';
    this.endedOn = '';
    this.paidOn = '';
    this.gameId = '';
  }
}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  games: DisplayGame[] = [];
  constructor(public dataService: DataService, public router: Router, public authService: AuthService) {}

  async ngOnInit() {
    this.authService.checkLoggedIn();
    await this.getTable();
    this.games.sort( (a, b) => {
      const aString = a.startedOn.substr(6) + a.startedOn.substr(3, 2) + a.startedOn.substr(0, 2);
      const bString = b.startedOn.substr(6) + b.startedOn.substr(3, 2) + b.startedOn.substr(0, 2);
      if (aString > bString) {
        return -1;
      }
      if (aString < bString) {
        return 1;
      }
      return 0;
    });
  }
  async getTable(){
    const user: User = await this.authService.getUserAsync() as User;
    const userEmail = user.email;
    const rawData = await this.dataService.getAllGamesOfUser(userEmail);
    console.log(rawData);
    for (const game of  rawData){
      const toPush = new DisplayGame();
      toPush.gameId = game.payload.doc.id;
      let temp = await this.dataService.getPropertyOfObservable(game, 'teamnames');
      toPush.teamNameA = temp[0];
      toPush.teamNameB = temp[1];
      temp = await  this.dataService.getPropertyOfObservable(game, 'totalpoints');
      toPush.pointsTeamA = temp[0];
      toPush.pointsTeamB = temp[1];
      toPush.startedOn = await this.dataService.getPropertyOfObservable(game, 'startDate');
      toPush.endedOn = await this.dataService.getPropertyOfObservable(game, 'endDate');
      toPush.paidOn = await this.dataService.getPropertyOfObservable(game, 'paidOn');
      this.games.push(toPush);
    }
  }
  updatePaidOn(id: string, value: string){
    this.dataService.updateGameWithDict(id, {paidOn : value});

  }

}
