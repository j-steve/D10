import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { randomNumber } from '../shared/util.constants';
import { DieComponent } from './die/die.component';

@Component({
  selector: 'd10-dice-roller',
  templateUrl: './dice-roller.component.html',
  styleUrls: ['./dice-roller.component.scss']
})
export class DiceRollerComponent implements OnInit {

  dice: number[] = [];
  @ViewChildren(DieComponent) diceComponents!: QueryList<DieComponent>;

  ngOnInit(): void {}

  onNewRoll(diceCount: number): void {
    this.dice.length = 0;
    for (let i = 0; i < diceCount; i++) {
      this.dice.push(randomNumber(1, 10));
    }
  }
}
