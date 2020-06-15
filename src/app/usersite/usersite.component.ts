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

}
