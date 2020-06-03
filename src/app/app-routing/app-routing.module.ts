import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TafelComponent} from '../tafel/tafel.component';
import {CockpitComponent} from '../cockpit/cockpit.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';

const routes: Routes = [
  {
    path: 'tafel',
    component: TafelComponent
  },
  {
    path: 'cockpit',
    component: CockpitComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {path: 'login', component : LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: LoginComponent}
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
