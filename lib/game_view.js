const Game = require("./game.js");

class GameView {
  constructor() {
    this.game = new Game(100, 6);
    $(".deal-button").click( () => this.deal());
    $(".hit-button").click( () => this.hit());
    $(".stand-button").click( () => this.stand());
  }

  deal() {
    this.game.deal();
    let cardId = "";
    let dealerCards = this.game.dealerHand.cards;
    for (let i = 0; i < dealerCards.length; i++) {
      switch (dealerCards[i].suit) {
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
      cardId += `-${dealerCards[i].rank}`;
      $(".dealer-cards").append(`<p id=${cardId} class='card'></p>`);
    }

    let playerCards= this.game.playerHands[0].cards;
    for (let i = 0; i < playerCards.length; i++) {
      switch (playerCards[i].suit) {
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
      cardId += `-${playerCards[i].rank}`;
      $(".player-cards").append(`<p id=${cardId} class='card'></p>`);
    }
  }

  hit() {
    this.game.hit();
    if (this.game.gameState === true) {
      let cards = this.game.currentHand.cards;
      let newCard = cards[cards.length - 1];
      let cardId = "";
      switch (newCard.suit) {
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
      cardId += `-${newCard.rank}`;
      $(".player-cards").append(`<p id=${cardId} class='card'></p>`);
    }
  }

  stand() {
    if (this.game.gameState === true) {
      this.game.stand();
      let dealerCards = this.game.dealerHand.cards;
      let cardId = "";
      for (let i = 2; i < dealerCards.length; i++) {
        switch (dealerCards[i].suit) {
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
        cardId += `-${dealerCards[i].rank}`;
        $(".dealer-cards").append(`<p id=${cardId} class='card'></p>`);
      }
    }
  }

}

module.exports = GameView;
