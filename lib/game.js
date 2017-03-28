const Hand = require("./hand.js");
const Deck = require("./deck.js");

class Game {
  constructor(playerChips, numDecks) {
    this.gameState = true;
    this.playerChips = playerChips;
    this.playerHands = [new Hand()];
    this.dealerHand = new Hand();
    this.deck = new Deck(numDecks);
    this.currentHand = this.playerHands[0];
  }

  updateGameState(newState) {
    this.gameState = newState;
  }

  updateplayerChips(change) {
    this.playerChips += change;
  }

  newGame(numDecks) {
    this.playerHands = [new Hand()];
    this.dealerHand = new Hand();
    this.deck = new Deck(numDecks);
    this.currentHand = this.playerHands[0];
    this.deal();
  }

  activeHands() {
    for (let i = 0; i < this.playerHands.length; i++) {
      if (this.playerHands[i].handState === true && this.playerHands[i] !== this.currentHand) {
        return true;
      }
    }
    return false;
  }

  switchHands() {
    if (this.playerHands[0] === this.currentHand) {
      this.currentHand = this.playerHands[1];
    } else {
      this.currentHand = this.playerHands[0];
    }
  }

  deal() {
    this.deck.shuffle();
    let playerCard1 = this.deck.dealCard();
    let playerCard2 = this.deck.dealCard();
    let dealerCard1 = this.deck.dealCard();
    let dealerCard2 = this.deck.dealCard();

    this.currentHand.addCard(playerCard1);
    this.currentHand.addCard(playerCard2);

    let dealerHand = new Hand();
    this.dealerHand.addCard(dealerCard1);
    this.dealerHand.addCard(dealerCard2);
    console.log("Player cards: ", this.currentHand);
    console.log("Dealer cards", this.dealerHand);
  }

  hit() {
    if (this.currentHand.handState === true) {
      this.currentHand.addCard(this.deck.dealCard());
      if (this.currentHand.getValue() > 21) {
        this.playerChips -= 10;
        this.currentHand.handState = false;
        this.gameState = false;
        this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
        if (this.activeHands()) {
          this.switchHands();
        }
      }
    }
    console.log("Player cards after hit: ", this.currentHand);
  }

  stand() {
    if (this.currentHand.handState === true && !this.activeHands()) {
      let dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];

      while (this.dealerHand.getValue() < 17) {
        let newCard = this.deck.dealCard();
        this.dealerHand.addCard(newCard);
        dealerCardRanks.push(newCard.rank);
        if (dealerCardRanks.includes("A") && this.dealerHand.getValue() === 17 &&
          this.dealerHand.getSoftValue() < 17) {
            while (this.dealerHand.getValue() < 18) {
              this.dealerHand.addCard(this.deck.dealCard());
            }
        }
      }

      let dealerPoints = this.dealerHand.getValue();
      let handPoints = 0;

      for (let i = 0; i < this.playerHands.length; i++) {
        if (dealerPoints < this.playerHands[i].getValue() ||
          dealerPoints > 21) {
            this.playerChips += 10;
        } else if (this.playerHands[i].getValue() < dealerPoints) {
          this.playerChips -= 10;
        }
        this.playerHands[i].handState = false;
      }
      this.gameState = false;
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
    } else {
      this.currentHand.splitAction = "stand";
      this.switchHands();
    }
  }

  double() {

    if (this.currentHand.handState === true && this.currentHand.cards.length === 2) {
      this.currentHand.addCard(this.deck.dealCard());
      if (this.currentHand.getValue() > 21) {
        this.playerChips -= 20;
        this.currentHand.handState = false;
      } else {
        this.stand();
        if (this.playerHands.indexOf(this.currentHand) === this.playerHands.length - 1) {
          if (this.currentHand.getValue() > this.dealerHand.getValue()) {
            this.playerChips += 10;
          } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
            this.playerChips -= 10;
          }
        }
      }
    }
    console.log("Player cards after double", this.currenHand);
    console.log("Dealer cards after double", this.dealerHand);
  }

  split() {

    if (this.currentHand.cards[0].rank === this.currentHand.cards[1].rank) {
      let userHand1 = new Hand();
      let userHand2 = new Hand();
      userHand1.addCard(this.currentHand.cards[0]);
      userHand2.addCard(this.currentHand.cards[1]);
      userHand1.addCard(this.deck.dealCard());
      userHand2.addCard(this.deck.dealCard());
      this.playerHands.pop();
      this.playerHands.push(userHand1);
      this.playerHands.push(userHand2);
      this.currentHand = this.playerHands[0];
      console.log("Player hands after split", this.playerHands);
      console.log("Current hand", this.currentHand);
      console.log("Dealer hand after split", this.dealerHand);
    }
  }

  surrender() {
    if (this.currentHand.handState === true && this.currentHand.cards.length === 2) {
      this.playerChips -= 10;
      this.currentHand.handState = false;
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
      if (this.activeHands()) {
        this.switchHands();
      }
    }
  }

}

module.exports = Game;
