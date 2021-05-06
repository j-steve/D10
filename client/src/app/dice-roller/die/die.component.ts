import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { randomNumber } from '../../shared/util.constants';

const DICESIDES = 10;
const TUMBLEINTERVALMS = 50;
const TUMBLEOPACITY = 0.5;
const MINTUMBLETIMES = 15;
const MAXTUMBLETIMES = 20;

@Component({
  selector: 'd10-die',
  templateUrl: './die.component.html',
  styleUrls: ['./die.component.scss']
})
export class DieComponent implements OnInit {

  @Output() tumbled = new EventEmitter<number>();

  value = 0;

  ngOnInit(): void {
    this.tumble();
  }

  private tumble() {
    //let tumbleCallback:Timeout = 0;
    let tumblesRemaining = randomNumber(MINTUMBLETIMES, MAXTUMBLETIMES)
    timer(0, TUMBLEINTERVALMS).pipe(take(tumblesRemaining)).subscribe(
      () => {
        const nextHighestNumber = this.value + randomNumber(0, DICESIDES - 2);
        this.value = nextHighestNumber % DICESIDES + 1;
      },
      null,
      () => {
        this.tumbled.emit(this.value);
      }
    );
    //return new Promise(resolve => {
    //  const nextHighestNumber = this.value + randomBetween(0, DICESIDES - 2);
    //  this.value = nextHighestNumber % DICESIDES + 1;
    //  this.$dice.css('background-color', `rgb(${255 + 50 - this.value * 5}, ${228 + 50 - this.value * 5}, ${202 + 50 - this.value * 5})`);
    //  tumblesRemaining -= 1;
    //  if (tumblesRemaining > 0) {
    //    tumbleCallback = setTimeout(() => resolve(this.tumble()), TUMBLEINTERVALMS);
    //  } else {
    //    tumbleCallback = 0;
    //    this.$dice.css('opacity', 1);
    //    resolve(this);
    //  }
    //});
  }


}
