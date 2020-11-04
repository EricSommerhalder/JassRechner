import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from './game.model';
import {first} from 'rxjs/operators';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService{
  public gameId = '';
  public chosenGroup = '';
  public currentlyFour: boolean;
  public currentlyCash: boolean;
  public userStorage = '';
  constructor(public firestore: AngularFirestore) { }
  getGames(){
    return this.firestore.collection('games').snapshotChanges();
  }
  async getAllUsers(): Promise<any>{
    return await this.firestore.collection('users')
      .snapshotChanges().pipe(first()).toPromise();
  }
  async getUserStorage(email: string){
    if (this.userStorage !== '') {
      return;
    }
    const users = await this.getAllUsers();
    for (const user of users) {
      if (this.getPropertyOfObservable(user, 'email') === email) {
        this.userStorage = user.payload.doc.id;
        return;
      }
    }
  }
  createGame(game: Game, groupId: string){
    let data = {};
    for (const [key, value] of Object.entries(game)){
      data[key] = value;
    }
    return new Promise<any>(async (resolve, reject) => {
      this.firestore
        .collection('games')
        .add(data)
        .then(async res => {
          await this.addGameToGroup(res.id, groupId);
        }, err => reject(err));
      await this.getGameId();
    });
  }
  async addGameToGroup(gameId: string, groupId: string) {
    const g = await this.readGamesOfGroup(groupId);
    g.push(gameId);
    await this.firestore.collection('groups').doc(groupId).update({games: g});
  }
  async readGamesOfGroup(groudId: string) {
    let g = [];
    await this.firestore.collection('groups').doc(groudId).ref.get().then((u) => {
      if ('games' in u.data()) {
        g = u.data()['games'];
      }
      else {console.log('No groups yet'); }
    });
    return g;
  }
  updateGame(id: string, game: Game){
    let data = {};
    for (const [key, value] of Object.entries(game)){
      data[key] = value;
    }
    this.firestore.collection('games').doc(id).update(data);
  }
  updateGameWithDict(id: string, data: any){
    this.firestore.collection('games').doc(id).update(data);
  }
  deleteGame(id: string){
    this.firestore.collection('games').doc(id).delete();
  }
  getPropertyOfObservable(observable: any, property: string){
    try {
      return observable.payload.doc.data()[property];
    }
    catch {
      return '';
    }
  }
  async getAllGames(): Promise<any>{
    return await this.firestore.collection('games')
      .snapshotChanges().pipe(first()).toPromise();
  }
/*async getGameId(user: string){
    let allGames: any = null;
    allGames = await this.getAllGames();
    if (allGames.length > 0 && this.gameId.length === 0) {
      for (const game of allGames) {
        if (this.getPropertyOfObservable(game, 'user') === user && this.getPropertyOfObservable(game, 'active') === true){
          this.gameId = game.payload.doc.id;
          break;
        }
      }
    }
  }*/
  async getGameId() {
      let g = [];
      await this.firestore.collection('groups').doc(this.chosenGroup).ref.get().then((u) => {
        if ('games' in u.data()) {
          g = u.data()['games'];
        }
        else {console.log('No games yet'); }
      });
      for (const game of g) {
        let act = false;
        await this.firestore.collection('games').doc(game).ref.get().then((u) => {
            act = u.data()['active'];
        });
        if (act) {
          this.gameId = game;
          break;
        }
      }
  }
  async getAllGamesOfUser(user: string){
    const toReturn = [];
    let allGames: any = null;
    allGames = await this.getAllGames();
    console.log(allGames);
    if (allGames.length > 0) {
      for (const game of allGames) {
        if (this.getPropertyOfObservable(game, 'user') === user){
          toReturn.push(game);
        }
      }
    }
    return toReturn;
  }
  async loadGame(){
    let toReturn = new Game();
    await this.firestore.collection('games').doc(this.gameId).snapshotChanges().subscribe(a => { toReturn = a.payload.data() as Game; });
    return toReturn;
    /*let allGames = null;
    let gameFromData = null;
    allGames = await this.getAllGames();
    if (allGames){
      for (const game of allGames){
        if (this.gameId === game.payload.doc.id){
          gameFromData = game;
          break;
        }
      }
    }
    if (gameFromData){
      return new Game({
        gamestate: this.getPropertyOfObservable(gameFromData, 'gamestate'),
        edit_mode: this.getPropertyOfObservable(gameFromData, 'edit_mode'),
        correction_mode : this.getPropertyOfObservable(gameFromData, 'correction_mode'),
        teamnames : this.getPropertyOfObservable(gameFromData, 'teamnames'),
        playernames : this.getPropertyOfObservable(gameFromData, 'playernames'),
        ausgeber : this.getPropertyOfObservable(gameFromData, 'ausgeber'),
        team_done : this.getPropertyOfObservable(gameFromData, 'team_done'),
        totalpoints : this.getPropertyOfObservable(gameFromData, 'totalpoints'),
        active : this.getPropertyOfObservable(gameFromData, 'active'),
        user : this.getPropertyOfObservable(gameFromData, 'user'),
        pointsPerGame : this.getPropertyOfObservable(gameFromData, 'pointsPerGame'),
        pointsPerMatch : this.getPropertyOfObservable(gameFromData, 'pointsPerMatch'),
        pointsPerCounterMatch : this.getPropertyOfObservable(gameFromData, 'pointsPerCounterMatch'),
        tournamentWonWith: this.getPropertyOfObservable(gameFromData, 'tournamentWonWith'),
        paidOn : this.getPropertyOfObservable(gameFromData, 'paidOn'),
        startDate: this.getPropertyOfObservable(gameFromData, 'startDate'),
        endDate: this.getPropertyOfObservable(gameFromData, 'endDate')
      });
    }
    return null;*/
  }
  getGameObservable(){
    return this.firestore.collection('games').doc(this.gameId).snapshotChanges();
  }
  createUser(email: string){
    let data = {"email" : email, groups: [], chosenGroup: ''};
    return new Promise<any>(async (resolve, reject) => {
      this.firestore
        .collection('users')
        .add(data)
        .then(res => {}, err => reject(err));
    });
  }
  async addGroupToUser(id: string) {
    let g = await this.readGroups();
    /*let g = [];
    await this.firestore.collection('users').doc(this.userStorage).ref.get().then((u) => {
      if ('groups' in u.data()) {
        g = u.data()['groups'];
        }
        else {console.log('No groups yet'); }
    });*/
    g.push(id);
    await this.firestore.collection('users').doc(this.userStorage).update({groups: g, chosenGroup: id});
    this.chosenGroup = id;
    this.firestore.collection('groups').doc(this.chosenGroup).snapshotChanges().subscribe(
      a => {
        console.log('setting to:', a.payload.data());
        this.currentlyFour = a.payload.data()['fourPlayers'];
        this.currentlyCash = a.payload.data()['cashGame']
      }
    );
    await this.getGameId();
  }
  async readGroups() {
    let g = [];
    await this.firestore.collection('users').doc(this.userStorage).ref.get().then((u) => {
      if ('groups' in u.data()) {
        g = u.data()['groups'];
      }
      else {console.log('No groups yet'); }
    });
    return g;
  }
  createGroup(n: string, four: boolean, cash: boolean) {
    const data = {name: n, fourPlayers: four, cashGame: cash, games: [] };
    return new Promise<any>(async (resolve, reject) => {
      this.firestore
        .collection('groups')
        .add(data)
        .then(async res => {
          await this.addGroupToUser(res.id);
          const game: Game = new Game();
          await this.createGame(game, res.id);
        }, err => reject(err));
    });
  }
  async changeGroup(id: string){
    this.chosenGroup = id;
    await this.firestore.collection('users').doc(this.userStorage).update({chosenGroup: id});
    this.firestore.collection('groups').doc(this.chosenGroup).snapshotChanges().subscribe(
      a => {
        this.currentlyFour = a.payload.data()['fourPlayers'];
        this.currentlyCash = a.payload.data()['cashGame'];
      }
    );
    await this.getGameId();
  }
  async checkChosenGroup(){
    await this.firestore.collection('users').doc(this.userStorage).ref.get().then((u) => {
      this.chosenGroup = u.data()['chosenGroup'];
    });
    this.firestore.collection('groups').doc(this.chosenGroup).snapshotChanges().subscribe(
      a => {
        this.currentlyFour = a.payload.data()['fourPlayers'];
        this.currentlyCash = a.payload.data()['cashGame'];
      }
    );
  }
}

