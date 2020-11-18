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
  constructor(public firestore: AngularFirestore) {
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

  async getGameId() {
      let g = [];
      await this.firestore.collection('groups').doc(this.chosenGroup).ref.get().then((u) => {
        if ('games' in u.data()) {
          g = u.data()['games'];
          console.log(g);
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
  async loadGame(){
    let toReturn = new Game();
    await this.firestore.collection('games').doc(this.gameId).snapshotChanges().subscribe(a => { toReturn = a.payload.data() as Game; });
    return toReturn;
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
      try {
        this.chosenGroup = u.data()['chosenGroup'];
      }
      catch (e) {
        if (e instanceof TypeError){
          return;
        }
      }
    });
    if (this.chosenGroup.length > 0) {
      this.firestore.collection('groups').doc(this.chosenGroup).snapshotChanges().subscribe(
        a => {
          this.currentlyFour = a.payload.data()['fourPlayers'];
          this.currentlyCash = a.payload.data()['cashGame'];
        }
      );
    }
  }
  async deleteGroup(id: string){
    if (id === this.chosenGroup) {
      console.log('Ausgewählte Gruppe nicht löschbar');
      // TODO: Warnmäldig
      return;
    }
    await this.firestore.collection('groups').doc(id).delete();
    let g = await this.readGroups();
    g = g.filter(obj => obj !== id);
    await this.firestore.collection('users').doc(this.userStorage).update({groups: g});
  }
  async init(user: string){
    await this.getUserStorage(user);
    await this.checkChosenGroup();
    if (this.chosenGroup.length > 0) {
      await this.getGameId();
    }
  }
}

