import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'd10-dice-roller',
  templateUrl: './dice-roller.component.html',
  styleUrls: ['./dice-roller.component.scss']
})
export class DiceRollerComponent implements OnInit {

  dice: number[] = [];

  ngOnInit(): void {
  }

  onNewRoll(diceCount: number): void {
    console.log('new roll!', diceCount);
    this.dice.length = 0;
    for (let i = 0; i < diceCount; i++) {
      this.dice.push(i);
    }
  }
}
