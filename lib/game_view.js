const Game = require("./game.js");

class GameView {
  constructor() {
    this.game = new Game(100, 6);
    $(".deal-button").click( () => this.deal());
    $(".hit-button").click( () => this.hit());
    $(".stand-button").click( () => this.stand());
    $(".double-button").click( () => this.double());
    $(".split-button").click( () => this.split());
  }

  createCardId(card) {
    let cardId = "";
    switch (card.suit) {
      case "C":
        cardId = "clubs";
        break;
      case "S":
        cardId = "spades";
        break;
      case "H":
        cardId = "hearts";
        break;
      case "D":
        cardId = "diamonds";
        break;
    }
    cardId += `-${card.rank}`;
    return cardId;
  }

  deal() {
    this.game.deal();

    let dealerCards = this.game.dealerHand.cards;
    for (let i = 0; i < dealerCards.length; i++) {
      $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
        class='card'></p>`);
    }

    let playerCards= this.game.playerHands[0].cards;
    for (let i = 0; i < playerCards.length; i++) {

      $(".player-cards").append(`<p id=${this.createCardId(playerCards[i])}
        class='card'></p>`);
    }
  }

  hit() {
    this.game.hit();
    if (this.game.gameState === true) {
      let cards = this.game.currentHand.cards;
      let newCard = cards[cards.length - 1];
      debugger;
      $(".player-cards").append(`<p id=${this.createCardId(newCard)}
        class='card'></p>`);
    }
  }

  stand() {
    if (this.game.gameState === true) {
      this.game.stand();
      if (this.game.gameState === false) {
        let dealerCards = this.game.dealerHand.cards;
        let cardId = "";
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card'></p>`);
        }
      }
    }
  }

  double() {
    if (this.game.gameState === true &&
      this.game.currentHand.cards.length === 2) {
      this.game.double();
      let newCard = this.game.currentHand.cards[2];
      debugger;
      $(".player-cards").append(`<p id=${this.createCardId(newCard)}
        class='card'></p>`);
    }

    if (this.game.gameState === false) {
      let dealerCards = this.game.dealerHand.cards;
      for (let i = 2; i < dealerCards.length; i++) {
        $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
          class='card'></p>`);
      }
    }
  }

  split() {
    this.game.split();
    let playerHands = this.game.playerHands;
    if (playerHands.length > 1) {
      $(".player-cards p").remove();
      for (let i = 0; i < playerHands.length; i++) {
        for (let j = 0; j < playerHands[i].cards  .length; j++) {
          $(".player-cards").append(`<p id=${this.createCardId(playerHands[i].cards[j])}
            class='card'></p>`);
        }
      }
    }
  }
}

module.exports = GameView;
