/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Hand = __webpack_require__(4);
const Deck = __webpack_require__(3);

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
    this.gameState = true;
    this.playerHands = [new Hand()];
    this.dealerHand = new Hand();
    this.deck = new Deck(numDecks);
    this.currentHand = this.playerHands[0];
    this.deal();
  }

  resetChips() {
    this.playerChips = 1000;
  }

  activeHands() {
    // console.log(this.playerHands[0]);
    // console.log(this.playerHands[1]);
    if (this.playerHands.length > 1) {
      for (let i = 0; i < this.playerHands.length; i++) {
        if (this.playerHands[i].handState === true && this.playerHands[i] !== this.currentHand) {
          return true;
        }
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
    if (this.dealerHand.cards.length < 2) {
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
      if (this.currentHand.getValue() === 21 && this.dealerHand.getValue() !== 21) {
        this.blackjack();
      }
    }
  }

  hit() {
    if (this.currentHand.handState === true) {
      this.currentHand.addCard(this.deck.dealCard());
      // console.log("after hit", this.currentHand);
      if (this.currentHand.getValue() > 21) {
        this.playerChips -= 10;
        this.currentHand.handState = false;
        this.currentHand.won = false;
        let previousHandIdx = this.playerHands[0] === this.currentHand ? 0 : 1;
        this.playerHands[previousHandIdx] = this.currentHand;

        if (this.activeHands()) {
          this.switchHands();
          if (previousHandIdx === 1 && this.currentHand.handState === true) {
            if (this.currentHand.splitAction !== "") {
              let dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];
              while (this.dealerHand.getValue() < 17) {
                let newCard = this.deck.dealCard();
                this.dealerHand.addCard(newCard);
                dealerCardRanks.push(newCard.rank);
              }
              if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
                dealerCardRanks.push(this.deck.dealCard());
              }
            }
            let dealerPoints = this.dealerHand.getValue();
            let playerPoints = this.currentHand.getValue();
            if (playerPoints < 22 && (dealerPoints < playerPoints || dealerPoints > 21)) {
              this.playerChips += 10;
              this.currentHand.won = true;
            } else if (dealerPoints > playerPoints) {
              this.playerChips -= 10;
              this.currentHand.won = false;
            }
            this.playerHands[0].handState = false;
            this.gameState = false;
          }
        } else {
          this.gameState = false;
        }
      }
    }
  }

  stand() {
    let idx = this.playerHands[0] === this.currentHand ? 0 : 1;
    if (this.currentHand.handState === true && (!this.activeHands() || idx === 1)) {
      if (this.dealerHand.cards.length > 1 && this.dealerHand.cards[1]) {
        let dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];
        while (this.dealerHand.getValue() < 17) {
          let newCard = this.deck.dealCard();
          if (newCard) {
            this.dealerHand.addCard(newCard);
            dealerCardRanks.push(newCard.rank);
          }
        }
        if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
          dealerCardRanks.push(this.deck.dealCard());
        }
      }

      let dealerPoints = this.dealerHand.getValue();
      let handPoints = 0;

      if (this.dealerHand.getValue() > 21 ||
        this.dealerHand.getValue() < this.currentHand.getValue()) {
        this.playerChips += 10;
        this.currentHand.won = true;
      } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
        this.playerChips -= 10;
        this.currentHand.won = false;
      }
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
      if (this.activeHands()) {
        this.switchHands();
        let coins = this.currentHand.splitAction === "double" ? 20 : 10;
        if (this.dealerHand.getValue() > 21 ||
          this.dealerHand.getValue() < this.currentHand.getValue()) {
          this.playerChips += coins;
          this.currentHand.won = true;
        } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
          this.playerChips -= coins;
          this.currentHand.won = false;
        }
      }
      this.gameState = false;
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
    } else {
      this.currentHand.splitAction = "stand";
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
      this.switchHands();
    }
  }

  double() {

    if (this.currentHand.handState === true && this.currentHand.cards.length === 2) {
      this.currentHand.addCard(this.deck.dealCard());
      let previousHandIdx = this.playerHands[0] === this.currentHand ? 0 : 1;
      if (this.currentHand.getValue() > 21) {
        this.playerChips -= 20;
        this.currentHand.handState = false;
        this.currentHand.won = false;
      } else {
        if (this.activeHands()) {
          this.currentHand.splitAction = "double";
        }
      }
      this.playerHands[previousHandIdx] = this.currentHand;
      if (this.activeHands() && previousHandIdx === 0) {
        this.switchHands();
      } else {
        let dealerCardRanks;
        if (this.dealerHand.cards[0] && this.dealerHand.cards[1]) {
          dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];
        }

        while (this.dealerHand.getValue() < 17) {
          let newCard = this.deck.dealCard();
          this.dealerHand.addCard(newCard);
          dealerCardRanks.push(newCard.rank);
        }
        if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
          dealerCardRanks.push(this.deck.dealCard());
        }
        if (this.currentHand.getValue() < 22) {
          if (this.dealerHand.getValue() > 21 ||
            this.dealerHand.getValue() < this.currentHand.getValue()) {
            this.playerChips += 20;
            this.currentHand.won = true;
          } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
            this.playerChips -= 20;
            this.currentHand.won = false;
          }
        }
        this.currentHand.handState = false;
        this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
        if (this.activeHands()) {
          this.switchHands();
          let coins = this.currentHand.splitAction === "double" ? 20 : 10;
          if (this.dealerHand.getValue() > 21 ||
            this.dealerHand.getValue() < this.currentHand.getValue()) {
            this.playerChips += coins;
            this.currentHand.won = true;
          } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
            this.playerChips -= coins;
            this.currentHand.won = false;
          }
          this.currentHand.handState = false;
        }
        this.gameState = false;
      }
    }
  }


  split() {

    // if (this.currentHand.cards[0].rank === this.currentHand.cards[1].rank) {
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
      if (this.currentHand.getValue() === 21) {
        this.blackjack();
        if (this.activeHands()) {
          this.switchHands();
        }
      }
    // }
  }

  surrender() {
    if (this.currentHand.handState === true && this.currentHand.cards.length === 2) {
      this.playerChips -= 5;
      this.currentHand.handState = false;
      this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
      let idx = this.playerHands.indexOf(this.currentHand);
      if (this.activeHands()) {
        this.switchHands();
        if (idx === 1) {
          let dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];

          while (this.dealerHand.getValue() < 17) {
            let newCard = this.deck.dealCard();
            this.dealerHand.addCard(newCard);
            dealerCardRanks.push(newCard.rank);
          }
          if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
            dealerCardRanks.push(this.deck.dealCard());
          }

          let coins = this.currentHand.splitAction === "double" ? 20 : 10;
          if (this.dealerHand.getValue() > 21 ||
            this.dealerHand.getValue() < this.currentHand.getValue()) {
            this.playerChips += coins;
            this.currentHand.won = true;
          } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
            this.playerChips -= coins;
            this.currentHand.won = false;
          }
          this.gameState = false;
        }
      }
    }
  }

  blackjack() {
    this.playerChips += 15;
    this.currentHand.handState = false;

  }

}

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

const VALUES = {'A':11, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
  '8':8, '9':9, '10':10, 'J':10, 'Q':10, 'K':10};

class GameView {
  constructor() {
    this.game = new Game(1000, 6);
    this.showHand = undefined;
    this.chips = 1000;
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {


class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
}

module.exports = Card;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Card = __webpack_require__(2);

const SUITS = ['C', 'S', 'H', 'D'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10',
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {


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
      if (this.cards[i]) {
        handRanks.push(this.cards[i].rank);
        value += VALUES[this.cards[i].rank];
      }
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const GameView = __webpack_require__(1);
const Game = __webpack_require__(0);

$( () => {
  new GameView();
});


/***/ })
/******/ ]);