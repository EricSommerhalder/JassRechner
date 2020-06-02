import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TafelComponent } from './tafel/tafel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CockpitComponent } from './cockpit/cockpit.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { OktaAuthModule } from '@okta/okta-angular';
import { TestComponent } from './test/test.component';
@NgModule({
  declarations: [
    AppComponent,
    TafelComponent,
    CockpitComponent,
    HomeComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    OktaAuthModule.initAuth({
      issuer: 'https://dev-268424.okta.com/oauth2/default',
      redirectUri: 'http://localhost:4200/implicit/callback',
      clientId: '0oaduy0llgcsx8SBh4x6'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
