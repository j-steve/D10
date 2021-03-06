const DICE_SIDES = 10;
const RAISE_VALUE = 10;
const TUMBLE_INTERVAL_MS = 50;
const TUMBLE_OPACITY = 0.5;
const MIN_TUMBLE_TIMES = 15;
const MAX_TUMBLE_TIMES = 20;

const diceInPlay = [];

function main() {
  const $diceRollArea = $('#dice-roll-area');
  $('#dice-count-form').on('submit', (e) => {
    $('.dice').remove();
    diceInPlay.length = 0;
    for (let i = 0; i < $('#dice-count').val(); i++) {
      const dice = new Dice().appendTo($diceRollArea);
      dice.roll();
      diceInPlay.push(dice);
    }
    RaiseSetCalculator.setCaluclateSetsTimeout();
    return false;
  });
}

class Dice {
  constructor($diceRollArea) {
    this._$dice = $('<div>').addClass('dice');
    this._$diceValue = $('<span>').appendTo(this._$dice);
    this._value = 0;
    this._tumblesRemaining = 0;
    this._tumbleCallback = 0;
    this._$dice.on('click', () => {
      RaiseSetCalculator.setCaluclateSetsTimeout();
      this.roll();
    });
  }

  getValue() {
    if (this._tumbleCallback > 0) { throw Error('Still tumbling.'); }
    return parseInt(this._value);
  }

  appendTo($diceRollArea) {
    this._$dice.appendTo($diceRollArea);
    return this;
  }

  setRaiseSet(raiseSet) {
    this._$dice.on({
      'mouseenter': () => raiseSet.forEach(d => d._$dice.addClass('highlight')),
      'mouseleave': () => raiseSet.forEach(d => d._$dice.removeClass('highlight'))
    });
  }

  isLeftover(value) {
    this._$dice.toggleClass('leftover', value);
  }

  roll() {
    this.isLeftover(false);
    this._value = randomBetween(1, DICE_SIDES);
    this._$dice.css('opacity', TUMBLE_OPACITY);
    this._tumblesRemaining = randomBetween(MIN_TUMBLE_TIMES, MAX_TUMBLE_TIMES); // How many times this dice should tumble before stopping.
    this._tumble();
  }

  _tumble() {
    const nextHighestNumber = this._value + randomBetween(0, DICE_SIDES - 2);
    this._value = nextHighestNumber % DICE_SIDES + 1;
    this._$diceValue.text(this._value);
    this._$dice.css('background-color', `rgb(${255 + 50 - this._value * 5}, ${228 + 50 - this._value * 5}, ${202 + 50 - this._value * 5})`);
    this._tumblesRemaining -= 1;
    if (this._tumblesRemaining > 0) {
      this._tumbleCallback = setTimeout(this._tumble.bind(this), TUMBLE_INTERVAL_MS);
    } else {
      this._tumbleCallback = 0;
      this._$dice.css('opacity', 1);
    }
  }
}

class RaiseSetCalculator {
  static setCaluclateSetsTimeout() {
    $('#raises').hide();
    setTimeout(RaiseSetCalculator._calculateSets, MAX_TUMBLE_TIMES * TUMBLE_INTERVAL_MS + 100);
  }
  static _calculateSets() {
    let remainingDice = [...diceInPlay]; // Make a shallow copy of the list.
    let maxErrorThreshold = 0;
    let raiseCount = 0;
    while (remainingDice.length > 0 && maxErrorThreshold < DICE_SIDES) {
      let raiseSet;
      do {
        raiseSet = RaiseSetCalculator._findOneRaiseSet(remainingDice, maxErrorThreshold);
        if (raiseSet != null) {
          raiseSet.forEach(d => d.setRaiseSet(raiseSet));
          remainingDice = remainingDice.filter(d => !raiseSet.includes(d));
          raiseCount++;
        }
      } while (raiseSet != null)
      maxErrorThreshold++;
    }
    remainingDice.forEach(dice => dice.isLeftover(true));
    $('#raise-count').text(raiseCount);
    $('#leftover-dice-count').html(remainingDice.length);
    $('#raises').show();
  }

  static _findOneRaiseSet(remainingDice, maxErrorThreshold) {
    for (let i = 0; i < remainingDice.length; i++) {
      const raiseDiceSet = [remainingDice[i]];
      let currentSum = remainingDice[i].getValue();
      if (currentSum >= RAISE_VALUE) {
        return raiseDiceSet;
      }
      for (let j = i + 1; j < remainingDice.length; j++) {
        const prospectiveDice = remainingDice[j];
        if (Math.abs(RAISE_VALUE - (currentSum + prospectiveDice.getValue())) <= maxErrorThreshold) {
          raiseDiceSet.push(prospectiveDice);
          currentSum += prospectiveDice.getValue();
          if (currentSum >= RAISE_VALUE) {
            return raiseDiceSet;
          }
        }
      }
    }
    return null;
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

main();