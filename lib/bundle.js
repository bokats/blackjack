/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
      if (this.currentHand.getValue() === 21) {
        this.blackjack();
      }
    }
  }

  hit() {
    if (this.currentHand.handState === true) {
      this.currentHand.addCard(this.deck.dealCard());
      if (this.currentHand.getValue() > 21) {
        this.playerChips -= 10;
        this.currentHand.handState = false;
        this.playerHands[this.playerHands.indexOf(this.currentHand)] = this.currentHand;
        if (this.activeHands()) {
          this.switchHands();
        } else {
          this.gameState = false;
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
        }
      if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
        dealerCardRanks.push(this.deck.dealCards());
      }

      let dealerPoints = this.dealerHand.getValue();
      let handPoints = 0;

      for (let i = 0; i < this.playerHands.length; i++) {
        if (dealerPoints < this.playerHands[i].getValue() ||
          dealerPoints > 21) {
            if (this.playerHands[i] === this.currentHand) {
              this.currentHand.won = true;
            } else {
              this.playerHands[i].won = true;
            }
            this.playerChips += 10;
        } else if (this.playerHands[i].getValue() < dealerPoints) {
          if (this.playerHands[i] === this.currentHand) {
            this.currentHand.won = false;
          } else {
            this.playerHands[i].won = false;
          }
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
      if (this.activeHands()) {
        this.currentHand.splitAction = 'double';
        this.switchHands();
      } else {
        if (this.currentHand.getValue() > 21) {
          this.playerChips -= 20;
          this.currentHand.handState = false;
          this.currentHand.won = false;
        } else {
          let dealerCardRanks = [this.dealerHand.cards[0].rank, this.dealerHand.cards[1].rank];

          while (this.dealerHand.getValue() < 17) {
            let newCard = this.deck.dealCard();
            this.dealerHand.addCard(newCard);
            dealerCardRanks.push(newCard.rank);
          }
          if (dealerCardRanks.includes("A") && this.dealerHand.getSoftValue() === 17) {
            dealerCardRanks.push(this.deck.dealCards());
          }

          if (this.dealerHand.getValue() > 21 ||
            this.dealerHand.getValue() < this.currentHand.getValue()) {
            this.playerChips += 20;
            this.currentHand.won = true;
          } else if (this.currentHand.getValue() < this.dealerHand.getValue()) {
            this.playerChips -= 20;
            this.currentHand.won = false;
          }
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
      console.log("Player hands after split", this.playerHands);
      console.log("Current hand", this.currentHand);
      console.log("Dealer hand after split", this.dealerHand);
    // }
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

  blackjack() {
    this.playerChips += 15;
    this.gameState = false;
  }

}

module.exports = Game;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(0);

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
          $(".in-game-message").append("Busted!");
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


const VALUES = {'A':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
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
      if (this.cards[i].rank === "A" && value + 11 < 22) {
        value += 11;
      } else {
        value += VALUES[this.cards[i].rank];
      }
    }

    for (let i = 0; i < handRanks.length; i++) {
      if (handRanks[i] === "A" && value > 21) {
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