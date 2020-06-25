import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {AuthService} from '../auth.service';
import {User} from "firebase";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  games: any[];
  constructor(public dataService: DataService, public router: Router, public authService: AuthService) {}

  async ngOnInit() {
    this.authService.checkLoggedIn();
    await this.getTable();
  }
  async getTable(){
    const table = [];
    let allGames = null;
    const user: User = await this.authService.getUserAsync() as User;
    const user_email = user.email;
    allGames = await this.dataService.getGames();
    if (allGames) {
      for (const game of allGames) {
        if (user_email === game.user){
          table.push(game);
        }
      }
    }
    console.log(table);
  }


}
