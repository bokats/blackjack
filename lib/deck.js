const Card = require("./card.js");

const SUITS = ['C', 'S', 'H', 'D'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T',
  'J', 'Q', 'K'];

class Deck {

  constructor(numDecks) {
    this.deck = [];

    for (let count = 0; count < numDecks; count++) {
      for (let i = 0; i < SUITS.length; i++) {
        for (var j = 0; j < RANKS.length; j++) {
          this.deck.push(new Card(SUITS[i], RANKS[j]));
        }
      }
    }
  }

  shuffle() {
    let currentIndex = this.deck.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = this.deck[currentIndex];
      this.deck[currentIndex] = this.deck[randomIndex];
      this.deck[randomIndex] = temporaryValue;
    }
  }

  dealCard(card) {

    let cardToDelete = card ||
      this.deck[Math.floor(Math.random() * this.deck.length)];

    delete this.deck[this.deck.indexOf(cardToDelete)];

    return cardToDelete;
  }
}

module.exports = Deck;
