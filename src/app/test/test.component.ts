import { Component, OnInit } from '@angular/core';
import {ServerService} from '../server.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  output: any[] = ['Hallo'];
  constructor(private server: ServerService) {}

  ngOnInit(): void {
    this.getGames();
    this.addGame();
    this.getGames();
  }
  getGames() {
    this.server.getGames().then((response: any) => {
      console.log('Response', response);
      this.output = response.map((ev) => {
        ev.body = ev.playernames;
        ev.header = ev.teamnames;
        ev.icon = 'fa-clock-o';
        return ev;
      });
    });
  }
  addGame(){
    const newGame = {
      teamnames : 'Männer, Frauen',
      playernames : 'Heinz, Eric, etc.'
    };
    this.server.createGame(newGame);
  }

}
