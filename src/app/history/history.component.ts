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
  gameToAdd = { playernames: ['Heinz', 'Eric'], teamnames: ['Männer, Frauen'], gamestate: [-1, -1],
    matchpoints: [0, 0], totalpoints: [0, 0], edit_mode: false, ausgeber: 3, team_done:[false, false], correction_mode: false, user: 'schach94@gmx.ch', active: true};
  constructor(public dataService: DataService, public router: Router, public authService: AuthService) {}

  ngOnInit() {
    if (!firebase.auth().currentUser){
      this.router.navigateByUrl('/login');
    }
    this.getGames();
  }
  getGames(){
    this.dataService.getGames().subscribe(res => this.games = res);
  }

create(game: Game){
    this.dataService.createGame(game);
}

update(game: Game){
    this.dataService.updateGame(game);
}
delete(id: string){
    this.dataService.deleteGame(id);
}

}
