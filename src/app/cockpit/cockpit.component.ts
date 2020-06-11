import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import * as firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  games: any[];
  gameToAdd = { playernames: ['Heinz', 'Eric'], teamnames: ['Männer, Frauen'], gamestate: [-1, -1],
    matchpoints: [0, 0], totalpoints: [0, 0], edit_mode: false, ausgeber: 3, team_done:[false, false], correction_mode: false, user: 'schach94@gmx.ch', active: true};
  constructor(public dataService: DataService, public router: Router) {}

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
