interface constructorHelper{
  playernames: string[];
  teamnames: string[];
  gamestate: number[];
  totalpoints: number[];
  edit_mode: boolean;
  ausgeber: number;
  team_done: boolean[];
  correction_mode: boolean;
  user: string;
  active: boolean;
  pointsPerMatch: number;
  pointsPerCounterMatch: number;
  pointsPerGame: number;
  tournamentWonWith: number;
  pastGames: {game: number[], date: string}[];
}

export class Game {
  playernames: string[];
  teamnames: string[];
  gamestate: number[];
  totalpoints: number[];
  edit_mode: boolean;
  ausgeber: number;
  team_done: boolean[];
  correction_mode: boolean;
  user: string;
  active: boolean;
  pointsPerMatch: number;
  pointsPerCounterMatch: number;
  pointsPerGame: number;
  tournamentWonWith: number;
  pastGames: {game: number[], date: string}[];
  constructor(helper?: constructorHelper) {
    this.gamestate = helper && helper.gamestate || [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    this.edit_mode = helper && helper.edit_mode || false;
    this.correction_mode = helper && helper.correction_mode || false;
    this.teamnames = helper && helper.teamnames || ['Team A', 'Team B'];
    this.playernames = helper && helper.playernames || ['Spieler A1', 'Spieler A2', 'Spieler A3', 'Spieler B1', 'Spieler B2', 'Spieler B3'];
    this.ausgeber = helper && helper.ausgeber || Math.floor(Math.random() * 6);
    this.team_done = helper && helper.team_done || [false, false];
    this.totalpoints = helper && helper.totalpoints || [0, 0];
    this.active = helper && helper.active || true;
    this.user = helper && helper.user || '';
    this.pointsPerMatch = helper && helper.pointsPerMatch || 0.5;
    this.pointsPerCounterMatch = helper && helper.pointsPerCounterMatch || 1;
    this.pointsPerGame = helper && helper.pointsPerGame || 1;
    this.tournamentWonWith = helper && helper.tournamentWonWith || 21;
    this.pastGames = helper && helper.pastGames || [];
  }
}
