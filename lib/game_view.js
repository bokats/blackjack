const Game = require("./game.js");

class GameView {
  constructor() {
    let g = new Game(100, 6);
    $(".deal-button").click(this.deal);
  }

  deal() {
    this.g.deal();
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
      $(".dealer-cards").append("<p class=``>")
    }
  }

}
