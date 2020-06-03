import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  games: any[];
  gameToAdd = { playernames: 'Heinz, Eric', teamnames: 'Männer, Frauen', gamestate: '-1, -1', matchpoints: '5', totalpoints: '15'};
  constructor(public dataService: DataService) {}

  ngOnInit() {
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
