import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Game} from '../game.model';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {User} from 'firebase';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupdialogComponent} from '../popupdialog/popupdialog.component';

class DisplayGame {
  teamNameA: string;
  teamNameB: string;
  pointsTeamA: number;
  pointsTeamB: number;
  startedOn: string;
  endedOn: string;
  paidOn: string;
  gameId: string;
  verliererTeam: string;
  toPay: number;
  active: boolean;

  constructor() {
    this.teamNameA = '';
    this.teamNameB = '';
    this.pointsTeamA = 0;
    this.pointsTeamB = 0;
    this.startedOn = '';
    this.endedOn = '';
    this.paidOn = '';
    this.gameId = '';
    this.verliererTeam = '';
    this.toPay = -1;
    this.active = true;
  }
}
class Group {
  name: string;
  id: string;
  games: DisplayGame[];
  cash: boolean;
  constructor() {
    this.name = '';
    this.id = '';
    this.games = [];
    this.cash = false;
  }
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  groups: Group[] = [];

  constructor(public dataService: DataService, public router: Router, public authService: AuthService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    this.authService.checkLoggedIn();
    const user: User = await this.authService.getUserAsync() as User;
    await this.dataService.init(user.email);
    if (this.dataService.chosenGroup.length === 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Zur Zeit ist noch keine Gruppe ausgewählt. Bitte zu Settings wechseln und eine Gruppe erstellen oder auswählen.',
        rightMessage: 'Ab zu Settings!',
        leftMessage: 'Später! (nicht empfohlen)'
      };
      const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(async result => {
        if (result === 'yes') {
          this.router.navigateByUrl('/settings');
        }
      });
    }
    await this.getTables();
    for (const group of this.groups) {
      group.games.sort((a, b) => {
        const aString = a.startedOn.substr(6) + a.startedOn.substr(3, 2) + a.startedOn.substr(0, 2);
        const bString = b.startedOn.substr(6) + b.startedOn.substr(3, 2) + b.startedOn.substr(0, 2);
        if (a.active && !b.active){
          return - 1;
        }
        if (b.active && !a.active){
          return 1;
        }
        if (aString > bString) {
          return -1;
        }
        if (aString < bString) {
          return 1;
        }
        return 0;
      });
    }
  }

  async getTables() {
    const g = await this.dataService.readGroups();
    for (const group of g) {
      const groupToPush = new Group();
      groupToPush.id = group;
      await this.dataService.firestore.collection('groups').doc(group).ref.get().then((gr) => {
        groupToPush.name = gr.data().name;
        groupToPush.cash = gr.data().cashGame;
      });
      const rawData = await this.dataService.readGamesOfGroup(group);
      for (const game of rawData) {
        const toPush = new DisplayGame();
        toPush.gameId = game;
        await this.dataService.firestore.collection('games').doc(game).ref.get().then((u) => {
          const data = u.data();
          toPush.teamNameA = data['teamnames'][0];
          toPush.teamNameB = data['teamnames'][1];
          if (this.dataService.currentlyCash) {
            for (let i = 0; i < 10; i++) {
              if (data.gamestate[i] > 0) {
                toPush.pointsTeamA += data.gamestate[i];
              }
              if (data.gamestate[i + 10] > 0) {
                toPush.pointsTeamB += data.gamestate[i + 10];
              }
            }
          } else {
            toPush.pointsTeamA = data['totalpoints'][0];
            toPush.pointsTeamB = data['totalpoints'][1];
          }
          toPush.startedOn = data['startDate'];
          toPush.endedOn = data['endDate'];
          toPush.paidOn = data['paidOn'];
          toPush.active = data.active;
          const amount = Math.abs(Math.round((toPush.pointsTeamA - toPush.pointsTeamB) * data.amountPer100 / 100));
          if (amount > data.minimalAmount) {
            toPush.toPay = amount;
          } else {
            toPush.toPay = data.minimalAmount;
          }
        });
        if (toPush.pointsTeamA > toPush.pointsTeamB) {
          toPush.verliererTeam = toPush.teamNameB;
        } else if (toPush.pointsTeamB > toPush.pointsTeamA) {
          toPush.verliererTeam = toPush.teamNameA;
        }
        groupToPush.games.push(toPush);
      }
      this.groups.push(groupToPush);
    }
  }

  updatePaidOn(id: string, value: string) {
    this.dataService.updateGameWithDict(id, {paidOn: value});

  }

}
