import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TafelComponent} from '../tafel/tafel.component';
import {CockpitComponent} from '../cockpit/cockpit.component';
import {HomeComponent} from '../home/home.component';

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
  {path: '**', component: HomeComponent}
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
