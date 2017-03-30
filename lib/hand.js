
const VALUES = {'A':11, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
  '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10};

class Hand {

  constructor() {
    this.cards = [];
    this.handState = true;
    this.splitAction = undefined;
    this.won = "";
  }

  addCard(card) {
    this.cards.push(card);
  }

  getValue() {
    let value = 0;
    let handRanks = [];

    for (let i = 0; i < this.cards.length; i++) {
      handRanks.push(this.cards[i].rank);
      value += VALUES[this.cards[i].rank];
    }

    for (let i = 0; i < handRanks.length; i++) {
      if (value > 21 && handRanks[i] === "A") {
        value -= 10;
      }
    }
    return value;
  }

  getSoftValue() {
    let value = 0;
    let check = false;

    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].rank === "A" && check === false) {
        value += 11;
        check = true;
      } else {
        value += VALUES[this.cards[i].rank];
      }

    }
    return value;
  }
}

module.exports = Hand;
