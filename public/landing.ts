const DICESIDES = 10;
const RAISEVALUE = 10;
const TUMBLEINTERVALMS = 50;
const TUMBLEOPACITY = 0.5;
const MINTUMBLETIMES = 15;
const MAXTUMBLETIMES = 20;

const diceInPlay: Dice[] = [];

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

  refreshLogMessages();
  setInterval(refreshLogMessages, 5000);
}


class Dice {

  private $dice: JQuery;
  private $diceValue: JQuery;
  private value = 0;
  private tumblesRemaining = 0;
  private tumbleCallback = 0;

  constructor() {
    this.$dice = $('<div>').addClass('dice');
    this.$diceValue = $('<span>').appendTo(this.$dice);
    this.tumblesRemaining = 0;
    this.$dice.on('click', () => {
      diceInPlay.forEach(d => d.clearRaiseSet());
      this.roll().then(RaiseSetCalculator.calculateSets);
    });
  }

  /**
   * Returns the current value of this rolled dice.
   */
  getValue(): number {
    if (this.tumbleCallback > 0) { throw Error('Still tumbling.'); }
    return this.value;
  }

  /**
   * Appends the dice element to the given dice roll area.
   */
  appendTo($diceRollArea: JQuery): Dice {
    this.$dice.appendTo($diceRollArea);
    return this;
  }

  /**
   * Sets this dice's style to associate it with the (potentially) additional dice in its raise set.
   */
  setRaiseSet(raiseSet: Dice[]) {
    this.$dice.on({
      'mouseenter.raiseset': () => raiseSet.forEach(d => d.$dice.addClass('highlight')),
      'mouseleave.raiseset': () => raiseSet.forEach(d => d.$dice.removeClass('highlight'))
    });
  }

  /**
   * Sets the dice's style to indicate that it is a leftover dice, not part of any raise set.
   */
  isLeftover(value: boolean) {
    this.$dice.toggleClass('leftover', value);
  }

  /** Undoes the effect of calling setRaiseSet() and/or isLeftover(). */
  clearRaiseSet() {
    this.$dice.removeClass('leftover');
    this.$dice.removeClass('highlight');
    this.$dice.off('.raiseset');
  }

  /**
   * Rolls the dice to a random value, which takes some time to complete as the dice will tumble first.
   * @returns promise that will complete when the dice value is finalized.
   */
  roll(): Promise<Dice> {
    this.isLeftover(false);
    this.value = randomBetween(1, DICESIDES);
    this.$dice.css('opacity', TUMBLEOPACITY);
    this.tumblesRemaining = randomBetween(MINTUMBLETIMES, MAXTUMBLETIMES); // How many times this dice should tumble before stopping.
    return this.tumble();
  }

  private tumble(): Promise<Dice> {
    return new Promise(resolve => {
      const nextHighestNumber = this.value + randomBetween(0, DICESIDES - 2);
      this.value = nextHighestNumber % DICESIDES + 1;
      this.$diceValue.text(this.value);
      this.$dice.css('background-color', `rgb(${255 + 50 - this.value * 5}, ${228 + 50 - this.value * 5}, ${202 + 50 - this.value * 5})`);
      this.tumblesRemaining -= 1;
      if (this.tumblesRemaining > 0) {
        this.tumbleCallback = setTimeout(() => resolve(this.tumble()), TUMBLEINTERVALMS);
      } else {
        this.tumbleCallback = 0;
        this.$dice.css('opacity', 1);
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
    while (remainingDice.length > 0 && maxErrorThreshold < DICESIDES) {
      let raiseSet = RaiseSetCalculator.findOneRaiseSet(remainingDice, maxErrorThreshold);
      while (raiseSet != null) {
        raiseCount++;
        raiseSet.forEach(d => d.setRaiseSet(raiseSet));
        remainingDice = remainingDice.filter(d => !raiseSet.includes(d));
        raiseSet = RaiseSetCalculator.findOneRaiseSet(remainingDice, maxErrorThreshold);
      }
      maxErrorThreshold++;
    }
    remainingDice.forEach(dice => dice.isLeftover(true));
    $('#raise-count').text(raiseCount);
    $('#leftover-dice-count').text(remainingDice.length.toString());
    $('#raises').show();

    const logMessage = `raises: ${raiseCount} | leftover die: ${remainingDice.length}`;
    $.post('/api/log', { player: $('#player-name').val(), message: logMessage, time: Date.now() });
    refreshLogMessages();
  }

  private static findOneRaiseSet(remainingDice: Dice[], maxErrorThreshold: number) {
    for (let i = 0; i < remainingDice.length; i++) {
      const raiseDiceSet = [remainingDice[i]];
      let currentSum = remainingDice[i].getValue();
      if (currentSum >= RAISEVALUE) {
        return raiseDiceSet;
      }
      for (let j = i + 1; j < remainingDice.length; j++) {
        const prospectiveDice = remainingDice[j];
        if (Math.abs(RAISEVALUE - (currentSum + prospectiveDice.getValue())) <= maxErrorThreshold) {
          raiseDiceSet.push(prospectiveDice);
          currentSum += prospectiveDice.getValue();
          if (currentSum >= RAISEVALUE) {
            return raiseDiceSet;
          }
        }
      }
    }
    return null;
  }
}

function refreshLogMessages() {
  $.ajax({ type: 'GET', url: '/api/log' }).then((log) => {
    const $log = $('#log').empty();
    log.forEach(roll => {
      const $msg = $('<div>').addClass('log').appendTo($log);
      $('<span>').addClass('timestamp log-element').text(new Date(+roll.time).toLocaleTimeString()).appendTo($msg);
      $('<span>').addClass('player log-element').text(roll.player).appendTo($msg);
      $('<span>').addClass('message log-element').text(roll.message).appendTo($msg);
    });

  });
}

/**
 * Returns a random number between min and max, inclusive of both values.
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

main();