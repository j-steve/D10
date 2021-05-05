import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DiceRollerModule } from './dice-roller/dice-roller.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameStatusComponent } from './game-status/game-status.component';

@NgModule({
  declarations: [
    AppComponent,
    GameStatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DiceRollerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
