const Game = require("./game.js");

const VALUES = {'A':11, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
  '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10};

class GameView {
  constructor() {
    this.game = new Game(100, 6);
    $(".deal-button").click( () => this.deal());
    $(".reset-button").click( () => this.reset());
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
    $(".reset-button").click( () => this.reset());
  }

  showGameButtons() {
    $(".buttons-container").empty();
    $(".buttons-container").append("<input type='button' class='surrender-button' value='Surrender'/>");

    $(".buttons-container").append("<input type='button' class='double-button' value='Double'/>");
    $(".buttons-container").append("<input type='button' class='stand-button' value='Stand'/>");
    $(".buttons-container").append("<input type='button' class='hit-button' value='Hit'/>");
    // if (this.game.currentHand.cards[0].rank === this.game.currentHand.cards[1].rank) {
    $(".buttons-container").append("<input type='button' class='split-button' value='Split'/>");
    // }
    $(".hit-button").click( () => this.hit());
    $(".stand-button").click( () => this.stand());
    $(".double-button").click( () => this.double());
    $(".split-button").click( () => this.split());
    $(".surrender-button").click( () => this.surrender());
  }

  removeFirstHandButtons() {
    $(".surrender-button, .split-button, .double-button").remove();
  }

  addFirstHandButtons() {
    $(".buttons-container").append("<input type='button' class='surrender-button' value='Surrender'/>");
    $(".buttons-container").append("<input type='button' class='double-button' value='Double'/>");
    $(".double-button").click( () => this.double());
    $(".surrender-button").click( () => this.surrender());
  }

  deal() {
    $(".start-message").remove();
    $(".card").remove();
    $(".player-hand2").remove();
    $(".in-game-message").empty();
    this.game.newGame(6);
    this.game.deal();
    $(".player-chips").empty().append(`$${this.game.playerChips}`);

    let dealerCards = this.game.dealerHand.cards;
    for (let i = 0; i < dealerCards.length; i++) {
      let cardId = "";
      if (i === 1) {
        cardId = "card-back";
      } else {
        cardId = this.createCardId(dealerCards[i]);
      }
      $(".dealer-cards").append(`<p id=${cardId} class='card card${i}'></p>`);
    }
    $(".dealer-score").empty().append(VALUES[dealerCards[0].rank]);

    let playerCards = this.game.playerHands[0].cards;
    for (let i = 0; i < playerCards.length; i++) {

      $(".player-hand1-cards").append(`<p id=${this.createCardId(playerCards[i])}
        class='card card${i}'></p>`);
    }
    $(".player-hand1-score").empty().append(this.game.currentHand.getValue());
    if (this.game.currentHand.getValue() === 21) {
      $(".in-game-message").append("Blackjack!");
      setTimeout(() => $(".in-game-message").empty(), 2000);
      $(".surrender-button, .split-button, .double-button, .stand-button, .hit-button").removeClass();
    } else {
      this.showGameButtons();
    }
  }

  hit() {
    $(".in-game-message").empty();
    if (this.game.gameState === true) {
      let idx = 1;
      if (this.game.currentHand === this.game.playerHands[0]) {
        idx = 0;
      }
      this.game.hit();
      let cards = this.game.playerHands[idx].cards;
      let newCard = cards[cards.length - 1];
      let cardIdx = cards.length - 1;
      if (idx === 0) {
        $(".player-hand1-cards").append(`<p id=${this.createCardId(newCard)}
          class='card card${cardIdx}'></p>`);
        $(".player-hand1-score").empty().append(this.game.playerHands[0].getValue());
      } else {
        $(".player-hand2-cards").append(`<p id=${this.createCardId(newCard)}
          class='card card${cardIdx}'></p>`);
        $(".player-hand2-score").empty().append(this.game.playerHands[1].getValue());
      }
      if (this.game.playerHands[idx].won === false) {
        $(".in-game-message").append("Busted!");
        $(".player-chips").empty().append(`$${this.game.playerChips}`);
      }
      if (this.game.gameState === false) {
        this.showDealButton();
        let dealerCards = this.game.dealerHand.cards;
        $("#card-back").removeAttr("id").attr('id', this.createCardId(dealerCards[1]));
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card card${i}'></p>`);
        }
        $(".dealer-score").empty().append(this.game.dealerHand.getValue());
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
            class='card card${i}'></p>`);
        }
        $(".dealer-score").empty().append(this.game.dealerHand.getValue());
        let message = "";
        if (this.game.playerHands.length > 1) {
          for (let i = 0; i < this.game.playerHands.length; i++) {
            if (i === 1) {
              if (this.game.playerHands[i].won === true) {
                message += "You win"
              } else if (this.game.playerHands[i].won === false) {
                message += "You lose"
              } else {
                message = "You push first hand";
              }
            } else {
              if (this.game.playerHands[i].won === true) {
                message += ", you win second hand";
              } else if (this.game.playerHands[i].won === false) {
                message += ", you lose second hand";
              } else {
                message = ", you push second hand";
              }
            }
          }
        } else {
          if (this.game.playerHands[0].won === true) {
            message = "You win!";
          } else if (this.game.playerHands[0].won === false) {
            message = "You lose!";
          } else {
            message = "Push";
          }
        }
        $(".player-chips").empty().append(`$${this.game.playerChips}`);
        $(".in-game-message").append(message);
        this.showDealButton();
      } else {
        this.showGameButtons();
      }
    }
  }

  double() {
    if (this.game.gameState === true &&
      this.game.currentHand.cards.length === 2) {
      let currentHandIdx = this.game.currentHand === this.game.playerHands[0] ? 0 : 1;
      this.game.double();
      let currentHand = this.game.playerHands[currentHandIdx];
      let newCard = currentHand.cards[2];
      let cardIdx = currentHand.cards.length - 1;

      if (this.game.playerHands[0] === currentHand) {
        $(".player-hand1-cards").append(`<p id=${this.createCardId(newCard)}
          class='card card${cardIdx}'></p>`);
        $(".player-hand1-score").empty().append(this.game.playerHands[0].getValue());
      } else {
        $(".player-hand2-cards").append(`<p id=${this.createCardId(newCard)}
          class='card card${cardIdx}'></p>`);
        $(".player-hand2-score").empty().append(this.game.playerHands[1].getValue());
      }
      $(".player-chips").empty().append(`$${this.game.playerChips}`);

      if (!currentHand.handState) {
        // $(".in-game-message").empty().append("Busted!");
      }
      if (currentHand !== this.game.currentHand) {
        if (this.game.currentHand.cards.length === 2) {
          this.showGameButtons();
        }
      }

      if (this.game.gameState === false) {
        let dealerCards = this.game.dealerHand.cards;
        $("#card-back").removeAttr("id").attr('id', this.createCardId(dealerCards[1]));
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card card${i}'></p>`);
        }
        $(".dealer-score").empty().append(this.game.dealerHand.getValue());
        if (this.game.currentHand.getValue() > 21) {
          $(".in-game-message").empty().append("Busted!");
        } else if (this.game.currentHand.won === true) {
          $(".in-game-message").append("You win!");

        } else if (this.game.currentHand.won === false) {
          $(".in-game-message").empty().append("You lose!");
        } else {
          $(".in-game-message").empty().append("Push");
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
      $(".player-hand1-cards p").remove();
      $(".player-cards").append("<div class='player-hand2'></div>");
      $(".player-hand2").append("<p class='player-hand2-score'></p>");
      $(".player-hand2").append("<p class='player-hand2-cards'></p>");
      for (let i = 0; i < playerHands.length; i++) {
        for (let j = 0; j < playerHands[i].cards.length; j++) {
          if (i === 0) {
            $(".player-hand1-cards").append(`<p id=${this.createCardId(playerHands[i].cards[j])}
              class='card card${j}'></p>`);
          } else {
            $(".player-hand2-cards").append(`<p id=${this.createCardId(playerHands[i].cards[j])}
              class='card card${j}'></p>`);
          }
        }
      }
      $(".player-hand1-score").empty().append(this.game.playerHands[0].getValue());
      $(".player-hand2-score").empty().append(this.game.playerHands[1].getValue());
    }
  }

  surrender() {
    this.game.surrender();
    $(".player-chips").empty().append(`$${this.game.playerChips}`);
    if (this.game.playerHands.length < 2) {
      this.showDealButton();
    } else {
      if (this.game.dealerHand.cards.length > 2) {
        let dealerCards = this.game.dealerHand.cards;
        $("#card-back").removeAttr("id").attr('id', this.createCardId(dealerCards[1]));
        for (let i = 2; i < dealerCards.length; i++) {
          $(".dealer-cards").append(`<p id=${this.createCardId(dealerCards[i])}
            class='card card${i}'></p>`);
        }
        $(".dealer-score").empty().append(this.game.dealerHand.getValue());
      }
      if (!this.game.gameState) {
        this.showDealButton();
      }
    }
  }

  reset() {
    this.game.resetChips();
    this.deal();
  }
}

module.exports = GameView;
