import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';



@Component({
  selector: 'app-usersite',
  templateUrl: './usersite.component.html',
  styleUrls: ['./usersite.component.css']
})
export class UsersiteComponent implements OnInit {

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.checkLoggedIn();
  }
  changePassword(password: string){
    const user = this.authService.getUser();
    // tslint:disable-next-line:only-arrow-functions
    user.updatePassword(password).then(function() {
      console.log('Password changed');

      // tslint:disable-next-line:only-arrow-functions
    }).catch(function(error) {
      if (error.code === 'auth/requires-recent-login') {

      }

    });
  }
reauthenticate(){

}
}
