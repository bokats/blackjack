const Game = require("./game.js");

const VALUES = {'A':11, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
  '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10};

class GameView {
  constructor() {
    this.game = new Game(100, 6);
    this.showHand = undefined;
    this.chips = 100;
    $(".deal-button").click( () => this.deal());
    $(".reset-button").click( () => this.reset());
    $(".hit-button").click( () => this.hit());
    $(".stand-button").click( () => this.stand());
    $(".double-button").click( () => this.double());
    $(".split-button").click( () => this.split());
  }

  createCardId(card) {
    let cardId = "";
    if (card) {
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
    if (this.game.currentHand.cards[0].rank === this.game.currentHand.cards[1].rank) {
    $(".buttons-container").append("<input type='button' class='split-button' value='Split'/>");
    }
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

  toggleCurrentHand() {
    if (this.game.playerHands.length > 1 &&
      this.game.currentHand !== this.showHand) {
        this.showHand = this.game.currentHand;
        let idx1 = (this.showHand === this.game.playerHands[0] ? 0 : 1) + 1;
        let idx2 = idx1 === 1 ? 2 : 1;
        $(`.player-hand${idx1}`).css("opacity", "1");
        $(`.player-hand${idx2}`).css("opacity", "0.3");
    }
  }

  showChipsChange() {
    if (this.chips !== this.game.playerChips) {
      let change = this.game.playerChips - this.chips;
      this.chips = this.game.playerChips;
      if (change > 0) {
        change = `+${change}`;
      }
      $(".hand-chips").append(change);
      setTimeout(() => $(".hand-chips").empty(), 2000);
    }
  }

  deal() {
    $(".start-message").remove();
    $(".card").remove();
    $(".player-hand2").remove();
    $(".in-game-message").empty();
    $(".player-hand1-score").css("margin-left", "");
    $(".player-hand2-score").css("margin-left", "");
    $(".player-hand1").css("opacity", "1");
    this.game.newGame(6);
    this.game.deal();
    $(".player-chips").empty().append(`$${this.game.playerChips}`);

    let dealerCards = this.game.dealerHand.cards;
    for (let i = 0; i < dealerCards.length; i++) {
      let cardId = "";
      if (i === 1) {
        cardId = "card-back";
      } else {
        if (dealerCards[i]) {
          cardId = this.createCardId(dealerCards[i]);
        }
      }

      $(".dealer-cards").append(`<p id=${cardId} class='card card${i}'></p>`);
    }
    if (dealerCards[0]) {
      $(".dealer-score").empty().append(VALUES[dealerCards[0].rank]);
    }
    let playerCards = this.game.playerHands[0].cards;
    for (let i = 0; i < playerCards.length; i++) {
      $(".player-hand1-cards").append(`<p id=${this.createCardId(playerCards[i])}
        class='card card${i}'></p>`);
    }
    this.showHand = this.game.currentHand;
    $(".player-hand1-score").empty().append(this.game.currentHand.getValue());
    if (this.game.currentHand.getValue() === 21) {
      $(".in-game-message").append("Blackjack!");
      $(".surrender-button, .split-button, .double-button, .stand-button, .hit-button").removeClass();
    } else {
      this.showGameButtons();
    }
  }

  hit() {
    $(".in-game-message").empty();
    if (this.game.gameState === true) {
      let idx = this.game.currentHand === this.game.playerHands[0] ? 0 : 1;
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
    this.toggleCurrentHand();
    this.showChipsChange();
  }

  stand() {
    if (this.game.gameState === true) {
      let idx = this.game.currentHand === this.game.playerHands[0] ? 0 : 1;
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
          switch (this.game.playerHands[0].won) {
            case true:
              switch (this.game.playerHands[1].won) {
                case true:
                  message += "You win both hands!";
                  break;
                case false:
                  message += "You win one hand";
                  break;
                default:
                  message += "Win/push";
                  break;
              }
              break;
            case false:
              switch (this.game.playerHands[1].won) {
                case true:
                  message += "You win one hand";
                  break;
                case false:
                  message += "You lose both hands";
                  break;
                default:
                  message += "Lose/push";
                  break;
              }
              break;
            default:
              switch (this.game.playerHands[1].won) {
                case true:
                  message += "Win/push";
                  break;
                case false:
                  message += "Lose/push";
                  break;
                default:
                  message += "Push both hands";
                  break;
              }
              break;
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
    this.toggleCurrentHand();
    this.showChipsChange();
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
      this.toggleCurrentHand(currentHandIdx);

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
    this.toggleCurrentHand();
    this.showChipsChange();
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
      $(".player-hand1-score").css("margin-left", "6%");

      $(".player-hand2-score").empty().append(this.game.playerHands[1].getValue());
      $(".player-hand2-score").css("margin-left", "6%");
      $(".player-hand2").css("opacity", "0.3");
    }
    if (this.game.currentHand === this.game.playerHands[1]) {
      this.toggleCurrentHand();
      $(".player-chips").empty().append(`$${this.game.playerChips}`);
      $(".in-game-message").append("Blackjack!");
      this.showChipsChange();
    }
  }

  surrender() {
    let idx = this.game.currentHand === this.game.playerHands[0] ? 0 : 1;
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
    this.toggleCurrentHand();
    this.showChipsChange();
  }

  reset() {
    this.game.resetChips();
    $(".player-chips").empty().append(`$${this.game.playerChips}`);
    this.showChipsChange();
  }
}

module.exports = GameView;
