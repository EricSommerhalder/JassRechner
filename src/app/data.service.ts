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
  createGame(data){
    return new Promise<any>((resolve, reject) =>{
      this.firestore
        .collection('games')
        .add(data)
        .then(res => {}, err => reject(err));
    });
  }
  updateGame(data){
    this.firestore.collection('games').doc(data.payload.doc.id).set({ completed: true }, { merge: true });
  }
  deleteGame(data){
    this.firestore.collection('games').doc(data.payload.doc.id).delete();
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
