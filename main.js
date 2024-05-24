const cards = document.querySelectorAll('.card');
const scoreCount = document.querySelector('.score-count');
const levelStatusText = document.querySelector('.level-text > small');

/**
 * Game initial states
 */
let isFlipped = false;
let lockBoard = false; // New variable to prevent clicking when two cards are being checked
let firstCard, secondCard;
let score = 0;
let level = 1; // starting level
let pairsFound = 0; // number of paired cards

let cardPairsPerLevel = 8; // sixteen card will be displayed

function flipCard() {
  if (lockBoard) return; // Prevent flipping if board is locked
  if (this === firstCard) return; // Prevent double click on the same card

  this.classList.add('flip');

  if (!isFlipped) {
    isFlipped = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true; // Lock the board
  checkCard();
}

const checkCard = () => {
  let isMatch = firstCard.dataset.image === secondCard.dataset.image;
  if (isMatch) {
    score++;
    pairsFound++;
    success();

    if (pairsFound === cardPairsPerLevel) levelUp;
  } else {
    failed();
  }
};

const success = () => {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  scoreCount.innerHTML = score; // Replace instead of append
  resetBoard();
};

const levelUp = () => {
  level++;
  pairsFound = 0;
  levelStatusText.innerHTML = level;
  shuffle();
  resetBoard();
};

const failed = () => {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
};

const resetBoard = () => {
  [isFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

function shuffle() {
  cards.forEach((card) => {
    let index = Math.floor(Math.random() * cards.length);
    card.style.order = index;
  });
}

(() => {
  shuffle();
})();

const resetGame = () => {
  score = 0;
  level = 0;
  pairsFound = 0;

  scoreCount.innerHTML = score;
  levelStatusText.innerHTML = level;

  cards.forEach((card) => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffle();
  resetBoard();
};

/**
 * Event listeners
 */

cards.forEach((card) => card.addEventListener('click', flipCard));
document.getElementById('btn').addEventListener('click', () => {
  resetGame();
});
