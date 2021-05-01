import { NgModule } from '@angular/core';

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { DiceComponent } from './dice.component';
import { DiceRollerComponent } from './dice-roller.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
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
