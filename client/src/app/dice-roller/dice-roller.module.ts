import { NgModule } from '@angular/core';

import { DiceComponent } from './dice.component';
import { DiceRollerComponent } from './dice-roller.component';

@NgModule({
  imports: [
  ],
  declarations: [
    DiceComponent,
    DiceRollerComponent
  ],
  exports: [
    DiceRollerComponent
  ],
  providers: [],
})
export class DiceRollerModule { }
