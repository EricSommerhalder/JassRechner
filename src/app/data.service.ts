import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from './game.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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
}
