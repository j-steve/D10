const DICE_SIDES = 10;
const RAISE_VALUE = 10;
const TUMBLE_INTERVAL_MS = 50;
const TUMBLE_OPACITY = 0.5;
const MIN_TUMBLE_TIMES = 15;
const MAX_TUMBLE_TIMES = 20;

/** @type {Dice[]} */
const diceInPlay = [];

function main() {
  const $diceRollArea = $('#dice-roll-area');
  $('#dice-count-form').on('submit', (e) => {
    $('.dice').remove(); // Remove any pre-existing dice on a new roll submission.
    diceInPlay.length = 0;
    for (let i = 0; i < $('#dice-count').val(); i++) {
      diceInPlay.push(new Dice().appendTo($diceRollArea));
    }
    Promise.allSettled(diceInPlay.map(dice => dice.roll())).then(RaiseSetCalculator.calculateSets);
    return false; // To prevent form submission and page reload.
  });
}

class Dice {

  constructor($diceRollArea) {
    /** @type {jQuery} */
    this._$dice = $('<div>').addClass('dice');
    this._$diceValue = $('<span>').appendTo(this._$dice);
    this._value = 0;
    this._tumblesRemaining = 0;
    this._tumbleCallback = 0;
    this._$dice.on('click', () => {
      diceInPlay.forEach(d => d.clearRaiseSet());
      this.roll().then(RaiseSetCalculator.calculateSets);
    });
  }

  /**
   * Returns the value of this dice.
   * @returns {number} the dice value
   */
  getValue() {
    if (this._tumbleCallback > 0) { throw Error('Still tumbling.'); }
    return parseInt(this._value);
  }

  /**
   * Appends the dice element to the given dice roll area.
   * @param {jQuery} $diceRollArea the element to which the dice should be appended
   * @returns {Dice} this entity
   */
  appendTo($diceRollArea) {
    this._$dice.appendTo($diceRollArea);
    return this;
  }

  /**
   * Sets this dice's style to associate it with the (potentially) additional dice in its raise set.
   * @param {Dice[]} raiseSet
   */
  setRaiseSet(raiseSet) {
    this._$dice.on({
      'mouseenter.raiseset': () => raiseSet.forEach(d => d._$dice.addClass('highlight')),
      'mouseleave.raiseset': () => raiseSet.forEach(d => d._$dice.removeClass('highlight'))
    });
  }

  /**
   * Sets the dice's style to indicate that it is a leftover dice, not part of any raise set.
   * @param {boolean} value
   */
  isLeftover(value) {
    this._$dice.toggleClass('leftover', value);
  }

  /** Undoes the effect of calling setRaiseSet() and/or isLeftover(). */
  clearRaiseSet() {
    this._$dice.removeClass('leftover');
    this._$dice.removeClass('highlight');
    this._$dice.off('.raiseset');
  }

  /**
   * Rolls the dice to a random value, which takes some time to complete as the dice will tumble first.
   * @returns {Promise<Dice>} promise that will complete when the dice value is finalized.
   */
  roll() {
    this.isLeftover(false);
    this._value = randomBetween(1, DICE_SIDES);
    this._$dice.css('opacity', TUMBLE_OPACITY);
    this._tumblesRemaining = randomBetween(MIN_TUMBLE_TIMES, MAX_TUMBLE_TIMES); // How many times this dice should tumble before stopping.
    return this._tumble();
  }

  /** @returns {Promise<Dice>} */
  _tumble() {
    return new Promise(resolve => {
      const nextHighestNumber = this._value + randomBetween(0, DICE_SIDES - 2);
      this._value = nextHighestNumber % DICE_SIDES + 1;
      this._$diceValue.text(this._value);
      this._$dice.css('background-color', `rgb(${255 + 50 - this._value * 5}, ${228 + 50 - this._value * 5}, ${202 + 50 - this._value * 5})`);
      this._tumblesRemaining -= 1;
      if (this._tumblesRemaining > 0) {
        this._tumbleCallback = setTimeout(() => resolve(this._tumble()), TUMBLE_INTERVAL_MS);
      } else {
        this._tumbleCallback = 0;
        this._$dice.css('opacity', 1);
        resolve(this);
      }
    });
  }
}

class RaiseSetCalculator {

  static calculateSets() {
    let remainingDice = [...diceInPlay]; // Make a shallow copy of the list.
    let maxErrorThreshold = 0;
    let raiseCount = 0;
    while (remainingDice.length > 0 && maxErrorThreshold < DICE_SIDES) {
      let raiseSet = RaiseSetCalculator._findOneRaiseSet(remainingDice, maxErrorThreshold);
      while (raiseSet != null) {
        raiseCount++;
        raiseSet.forEach(d => d.setRaiseSet(raiseSet));
        remainingDice = remainingDice.filter(d => !raiseSet.includes(d));
        raiseSet = RaiseSetCalculator._findOneRaiseSet(remainingDice, maxErrorThreshold);
      }
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

/**
 * Returns a random number between min and max, inclusive of both values.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

main();