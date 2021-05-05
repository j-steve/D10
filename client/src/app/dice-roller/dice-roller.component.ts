import { Component, OnInit } from '@angular/core';

import { GameConstants, NamedItem } from '../shared/game.constants';

@Component({
  selector: 'd10-dice-roller',
  templateUrl: './dice-roller.component.html',
  styleUrls: ['./dice-roller.component.scss']
})
export class DiceRollerComponent implements OnInit {
  TRAITS = GameConstants.TRAITS;
  SKILLS = GameConstants.SKILLS;

  selectedTrait: NamedItem | null = null;
  selectedSkill: NamedItem | null = null;

  ngOnInit() {
  }
}
