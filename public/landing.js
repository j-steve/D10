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
    setCaluclateSetsTimeout();
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
      setCaluclateSetsTimeout();
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

  roll() {
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

function setCaluclateSetsTimeout() {
  $('#raises').hide();
  setTimeout(calculateSets, MAX_TUMBLE_TIMES * TUMBLE_INTERVAL_MS + 100);
}

function calculateSets() {
  const diceValues = diceInPlay.map(d => d.getValue());
  diceValues.sort((a, b) => a - b);
  let raiseCount = 0;
  let currentRaiseValue = 0;
  let currentRaiseDice = 0;
  while (diceValues.length) {
    const adding = currentRaiseValue === 0 ? diceValues.pop() : diceValues.shift();
    currentRaiseValue += adding; //currentRaiseValue === 0 ? diceValues.pop() : diceValues.shift();
    currentRaiseDice += 1;
    console.log(diceValues.length, 'added', adding, 'to get', currentRaiseValue);
    if (currentRaiseValue >= RAISE_VALUE) {
      raiseCount += 1
      currentRaiseValue = 0;
      currentRaiseDice = 0;
    }
  }
  $('#raise-count').text(raiseCount);
  $('#leftover-dice-count').html('&ge;' + currentRaiseDice);
  $('#raises').show();
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

main();