const DICESIDES = 10;
const RAISEVALUE = 10;
const TUMBLEINTERVALMS = 50;
const TUMBLEOPACITY = 0.5;
const MINTUMBLETIMES = 15;
const MAXTUMBLETIMES = 20;

const diceInPlay: Dice[] = [];
let sessionUser: SessionUser;
let diceRoll: DiceRoll;

function main() {
  const $diceRollArea = $('#dice-roll-area');
  $('#dice-count-form').on('submit', (e) => {
    $('.dice').remove(); // Remove any pre-existing dice on a new roll submission.
    diceInPlay.length = 0;
    const totalDie = Array.from($('.roller-input input[type=number]')).map((x: HTMLInputElement) => +x.value).reduce((a, b) => a + b);
    for (let i = 0; i < totalDie; i++) {
      diceInPlay.push(new Dice().appendTo($diceRollArea));
    }
    diceRoll = new DiceRoll($('#trait').val() as string, $('#skill').val() as string, totalDie);
    Promise.allSettled(diceInPlay.map(dice => dice.roll())).then(RaiseSetCalculator.calculateSets);
    return false; // To prevent form submission and page reload.
  });
  sessionUser = new SessionUser($('#sessionId').val() as string, $('#userId').val() as string, $('#charName').val() as string);
  $.post('/api/upsert-session-user', sessionUser).then(processApiResponse).then((charRows: CharRow[]) => {
    const charRow = charRows.find(charRow => charRow.sessionUser.userId === sessionUser.userId);
    diceRoll = charRow.roll;
  });
  setInterval(refreshLogMessages, 2500);
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
      diceRoll.rerolls += 1;
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

    diceRoll.raises = raiseCount;
    diceRoll.leftoverDice = remainingDice.length;
    sendLogUpdate();
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

class SessionUser {
  constructor(public sessionId: string, public userId: string, public charName: string) {
    console.log(sessionId, userId, charName);
  }
}

class DiceRoll {
  public raises = 0;
  public leftoverDice = 0;
  public rerolls = 0;
  constructor(public trait: string, public skill: string, public diceCount: number) {}
}

class CharRow {
  constructor(public sessionUser: SessionUser, public roll: DiceRoll) { }
}

function sendLogUpdate() {
  $.post('/api/log', new CharRow(sessionUser, diceRoll)).then(processApiResponse);
}

function refreshLogMessages() {
  return $.ajax({ type: 'GET', url: '/api/log/' + sessionUser.sessionId }).then(processApiResponse);
}

function processApiResponse(log: {}): CharRow[] {
  const $charRowsTable = $('#char-rows');
  $charRowsTable.find('.char-row').remove() // Delete existing rows to repopualte the table.
  const charRows: CharRow[] = Object.values(log);
  charRows.sort((a, b) => a.roll && b.roll && compareNumbers(a.roll.raises, b.roll.raises) || a.sessionUser.charName.localeCompare(b.sessionUser.charName));
  charRows.forEach((charRow: CharRow) => {
    const $row = $('<tr>').addClass('char-row').appendTo($charRowsTable);
    $('<td>').text(charRow.sessionUser.charName).appendTo($row);
    if (charRow.roll) {
      const diceBreakdown = `rolled ${charRow.roll.diceCount}, rerolled ${charRow.roll.rerolls}, had ${charRow.roll.leftoverDice} unused dice`;
      $('<td>').text(charRow.roll.trait + ' + ' + charRow.roll.skill).prop('title', diceBreakdown).appendTo($row);
      $('<td>').addClass('numeric').text(charRow.roll.raises).appendTo($row);
      $('<td>').addClass('numeric').text(charRow.roll.leftoverDice).appendTo($row);
    }
  })
  return charRows;
}

/**
 * Returns a random number between min and max, inclusive of both values.
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

function compareNumbers(a: number, b: number): number {
  return a > b ? 1 : a === b ? 0 : -1;
}

main();