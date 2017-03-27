## Smart Blackjack

### Background

Blackjack is the most popular casino banking game in the world. It is
played between the dealer and a player. A player can
win in one of the following ways:

1) Get 21 points on the first two cards(blackjack)
2) Get more points than dealer without exceeding 21
3) Let dealer deal more cards until his/her hand exceeds 21

Many variations of the game exist. This project will focus on classic Blackjack
with blackjack pays 3:2 and dealer must hit soft 17.

Smart black will not only allow the player to play the game, but will also
give him/her advice on the correct moves based on the probability of success
and expected outcome for each possible move.

### Functionality & MVP

This game will have the following functionality:

- [ ] User will be able to play multiple blackjack games with all the
      functionality including: hit, stand, surrender, split, double
- [ ] User will be able to hit an Advice button that will tell him/her
      the move with the best statistical outcome
- [ ] A pop up will show up to ask the user if he/she is user before
      making the move when it is not the best one
- [ ] There will be a pot keeping track of user chips

In addition, this project will include:

- [ ] Rules of the game Modal
- [ ] A production Readme

### Wireframes

The app will have one main game board taking majority of screen. All the
buttons for the game will be inside of it, except reset and start.

There will be a Rules of the game modal link higher in the page as well as
reset and start buttons under the game board.

To the right of the game console, there will be a "Ask the statistician"
option, which will tell the user the best statistical move.

![wireframes](images/wireframe.jpg)

### Architecture and Technologies


This project will be implemented with the following technologies:

1) Vanilla JavaScript for overall structure and game logic
2) HTML Canvas to display the blackjack board, dealer and cards
