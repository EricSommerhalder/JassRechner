import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from './game.model';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService{
  public gameId = '';
  constructor(private firestore: AngularFirestore) { }
  getGames(){
    return this.firestore.collection('games').snapshotChanges();
  }
  createGame(game: Game){
    let data = {};
    for (const [key, value] of Object.entries(game)){
      data[key] = value;
    }
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('games')
        .add(data)
        .then(res => {}, err => reject(err));
    });
  }
  updateGame(id: string, game: Game){
    let data = {};
    for (const [key, value] of Object.entries(game)){
      data[key] = value;
    }
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
  async getGameId(user: string){
    let allGames: any = null;
    allGames = await this.getAllGames();
    if (allGames.length > 0 && this.gameId.length === 0) {
      for (const game of allGames) {
        if (this.getPropertyOfObservable(game, 'user') === user && this.getPropertyOfObservable(game, 'active')){
          this.gameId = game.payload.doc.id;
          console.log('Updated gameID to ', this.gameId);
          break;
        }
      }
    }
  }
  async loadGame(){
    let allGames = null;
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
        user : this.getPropertyOfObservable(gameFromData, 'user')
      });
    }
    return null;
  }
}

