import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GameConstants, NamedItem } from '../../shared/game.constants';

@Component({
  selector: 'd10-preroll-form',
  templateUrl: './preroll-form.component.html',
  styleUrls: ['./preroll-form.component.scss']
})
export class PrerollFormComponent implements OnInit {
  TRAITS = GameConstants.TRAITS;
  SKILLS = GameConstants.SKILLS;

  selectedTrait: NamedItem | null = null;
  selectedSkill: NamedItem | null = null;

  rollForm = this.formBuilder.group({
    trait: '',
    skill: '',
    diceCount: ''
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onRoll(): void {
    console.log('submitted!');
    event?.stopPropagation();
  }
}
