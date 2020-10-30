import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TafelComponent } from './tafel/tafel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HistoryComponent } from './history/history.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import * as firebase from 'firebase';
import { PopupdialogComponent } from './popupdialog/popupdialog.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersiteComponent } from './usersite/usersite.component';
import { HomeComponent } from './home/home.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [
    AppComponent,
    TafelComponent,
    HistoryComponent,
    LoginComponent,
    RegisterComponent,
    PopupdialogComponent,
    SettingsComponent,
    UsersiteComponent,
    HomeComponent
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
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatCheckboxModule,
        MatRadioModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PopupdialogComponent]
})
export class AppModule { }
