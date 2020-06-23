import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import {User} from 'firebase';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  game: Game = new Game();
  constructor(public authService: AuthService, public router: Router, public dataService: DataService) { }

  storeGame(){
    if (this.dataService.gameId.length > 0){
      this.dataService.updateGame(this.dataService.gameId, this.game);
    }
    else{
      this.dataService.createGame(this.game);
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
      default:
        break;
    }
    this.storeGame();
  }
  async ngOnInit() {
    this.authService.checkLoggedIn();
    const user: User = await this.authService.getUserAsync() as User;
    this.game.user = user.email;
    if (this.dataService.gameId.length === 0){
      await this.dataService.getGameId(this.game.user);
    }
    if (this.dataService.gameId.length > 0) {
      this.game = await this.dataService.loadGame();
    }
  }

}
