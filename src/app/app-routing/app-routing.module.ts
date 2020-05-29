import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TafelComponent} from '../tafel/tafel.component';

const routes: Routes = [
  {
    path: 'tafel',
    component: TafelComponent
  }
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
