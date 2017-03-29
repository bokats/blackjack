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

  showDealButton() {
    $(".surrender-button, .split-button, .double-button, .stand-button, .hit-button").remove();
    $(".buttons-container").append("<input type='button' class='deal-button' value='Deal'/>");
    $(".buttons-container").append("<input type='button' class='reset-button' value='Reset'/>");
    $(".deal-button").click( () => this.deal());
  }

  showGameButtons() {
    $(".deal-button, .reset-button").remove();
    $(".buttons-container").append("<input type='button' class='surrender-button' value='Surrender'/>");
    $(".buttons-container").append("<input type='button' class='split-button' value='Split'/>");
    $(".buttons-container").append("<input type='button' class='double-button' value='Double'/>");
    $(".buttons-container").append("<input type='button' class='stand-button' value='Stand'/>");
    $(".buttons-container").append("<input type='button' class='hit-button' value='Hit'/>");
    $(".hit-button").click( () => this.hit());
    $(".stand-button").click( () => this.stand());
    $(".double-button").click( () => this.double());
    $(".split-button").click( () => this.split());
  }

  removeFirstHandButtons() {
    $(".surrender-button, .split-button, .double-button").remove();
  }

  deal() {
    $(".card").remove();
    this.game.newGame(6);
    this.game.deal();
    $(".player-chips").empty().append(`$${this.game.playerChips}`);

    let dealerCards = this.game.dealerHand.cards;
    for (let i = 0; i < dealerCards.length; i++) {
      let cardId = "";
      if (i == 1) {
        cardId = "card-back";
      } else {
        cardId = this.createCardId(dealerCards[i]);
      }
      $(".dealer-cards").append(`<p id=${cardId}
        class='card'></p>`);
    }

    let playerCards = this.game.playerHands[0].cards;
    for (let i = 0; i < playerCards.length; i++) {

      $(".player-cards").append(`<p id=${this.createCardId(playerCards[i])}
        class='card'></p>`);
    }
    if (this.game.currentHand.getValue() === 21) {
      $(".in-game-message").append("Blackjack!");
      setTimeout(() => $(".in-game-message").empty(), 2000);
      $(".surrender-button, .split-button, .double-button, .stand-button, .hit-button").removeClass();
    } else {
      this.showGameButtons();
    }
  }

  hit() {
    if (this.game.gameState === true) {
      this.game.hit();
      let cards = this.game.currentHand.cards;
      let newCard = cards[cards.length - 1];
      $(".player-cards").append(`<p id=${this.createCardId(newCard)}
        class='card'></p>`);
      if (this.game.gameState === false) {
        $(".in-game-message").append("Busted!");
        setTimeout(() => $(".in-game-message").empty(), 2000);
        $(".player-chips").empty().append(`$${this.game.playerChips}`);
        this.showDealButton();
      } else {
        this.removeFirstHandButtons();
      }
    }

  }

  stand() {
    if (this.game.gameState === true) {
      this.game.stand();
      if (this.game.gameState === false) {
        let dealerCards = this.game.dealerHand.cards;
        $("#card-back").removeAttr("id").attr('id', this.createCardId(dealerCards[1]));
        let cardId = "";
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card'></p>`);
        }
        if (this.game.currentHand.won === true) {
          $(".in-game-message").append("You win!");
          setTimeout(() => $(".in-game-message").empty(), 2000);

        } else if (this.game.currentHand.won === false) {
          $(".in-game-message").append("You lose!");
          setTimeout(() => $(".in-game-message").empty(), 2000);
        } else {
          $(".in-game-message").append("Push");
          setTimeout(() => $(".in-game-message").empty(), 2000);
        }
        $(".player-chips").empty().append(`$${this.game.playerChips}`);
        this.showDealButton();
      }
    }
  }

  double() {
    if (this.game.gameState === true &&
      this.game.currentHand.cards.length === 2) {
      this.game.double();
      let newCard = this.game.currentHand.cards[2];

      $(".player-cards").append(`<p id=${this.createCardId(newCard)}
        class='card'></p>`);
      if (this.game.gameState === false) {
        let dealerCards = this.game.dealerHand.cards;
        $("#card-back").removeAttr("id").attr('id', this.createCardId(dealerCards[1]));
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card'></p>`);
        }
        if (this.game.currentHand.getValue() > 21) {
          $(".in-game-message").append("You win!");
          setTimeout(() => $(".in-game-message").empty(), 2000);
        } else if (this.game.currentHand.won === true) {
          $(".in-game-message").append("You win!");
          setTimeout(() => $(".in-game-message").empty(), 2000);

        } else if (this.game.currentHand.won === false) {
          $(".in-game-message").append("You lose!");
          setTimeout(() => $(".in-game-message").empty(), 2000);
        } else {
          $(".in-game-message").append("Push");
          setTimeout(() => $(".in-game-message").empty(), 2000);
        }
        $(".player-chips").empty().append(`$${this.game.playerChips}`);
        this.showDealButton();
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
