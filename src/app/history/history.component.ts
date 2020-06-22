import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  games: any[];
  gameToAdd = new Game();
  constructor(public dataService: DataService, public router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.authService.checkLoggedIn();
    this.getGames();
  }
  getGames(){
    this.dataService.getGames().subscribe(res => this.games = res);
  }

create(game: Game){
    this.dataService.createGame(game);
    console.log(this.games);
}


delete(id: string){
    this.dataService.deleteGame(id);
}

}
