import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TafelComponent} from '../tafel/tafel.component';
import {HistoryComponent} from '../history/history.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {SettingsComponent} from '../settings/settings.component';
import {UsersiteComponent} from '../usersite/usersite.component';

const routes: Routes = [
  {
    path: 'tafel',
    component: TafelComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'usersite',
    component: UsersiteComponent
  },
  {path: 'login', component : LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
