const DICE_SIDES = 10;
const TUMBLE_INTERVAL_MS = 50;
const TUMBLE_OPACITY = 0.5;

function main() {
  const $diceRollArea = $('#dice-roll-area');
  const diceInPlay = [];
  $('#dice-count-form').on('submit', (e) => {
    $('.dice').remove();
    diceInPlay.length = 0;
    for (let i = 0; i < $('#dice-count').val(); i++) {
      const dice = new Dice().appendTo($diceRollArea);
      dice.roll();
      diceInPlay.push(dice);
    }
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
    this._$dice.on('click', this.roll.bind(this));
  }

  appendTo($diceRollArea) {
    this._$dice.appendTo($diceRollArea);
    return this;
  }

  roll() {
    this._value = randomBetween(1, DICE_SIDES);
    this._$dice.css('opacity', TUMBLE_OPACITY);
    this._tumblesRemaining = randomBetween(15, 20); // How many times this dice should tumble before stopping.
    this._tumble();
  }

  _tumble() {
    const nextHighestNumber = this._value + randomBetween(0, DICE_SIDES - 1);
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

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

main();