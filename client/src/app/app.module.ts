import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DiceRollerModule } from './dice-roller/dice-roller.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DiceRollerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
