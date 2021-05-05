import { NgModule } from '@angular/core';

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DiceComponent } from './dice.component';
import { DiceRollerComponent } from './dice-roller.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule
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
