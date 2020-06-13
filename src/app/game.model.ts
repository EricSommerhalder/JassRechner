export class Game {
  playernames: string[];
  teamnames: string[];
  gamestate: number[];
  matchpoints: number[];
  totalpoints: number[];
  edit_mode: boolean;
  ausgeber: number;
  team_done: boolean[];
  correction_mode: boolean;
  user: string;
  active: boolean;
  constructor() {
    this.gamestate = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    this.edit_mode = false;
    this.correction_mode = false;
    this.teamnames = ['Männer', 'Fraue'];
    this.playernames = ['Heinz', 'Eric', 'Bob Dylan', 'Claudia', 'Anja', 'Tina Turner'];
    this.ausgeber = Math.floor(Math.random() * 6);
    this.team_done = [false, false];
    this.matchpoints = [0, 0];
    this.totalpoints = [0, 0];
    this.active = true;
  }
}
