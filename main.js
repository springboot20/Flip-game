const cards = document.querySelectorAll('.card');
const scoreCount = document.querySelector('.score-count');
let isFlipped = false;
let lockBoard = false; // New variable to prevent clicking when two cards are being checked
let firstCard, secondCard;
let score = 0;

cards.forEach((card) => card.addEventListener('click', flipCard));

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

function checkCard() {
  let isMatch = firstCard.dataset.image === secondCard.dataset.image;
  isMatch ? success() : failed();
}

function success() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  score++;
  scoreCount.textContent = score; // Replace instead of append
  resetBoard();
}

function failed() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [isFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach((card) => {
    let index = Math.floor(Math.random() * cards.length);
    card.style.order = index;
  });
}

(() => {
  shuffle();
})();

document.getElementById('btn').addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  score = 0;
  scoreCount.innerHTML = score;
  cards.forEach((card) => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffle();
  resetBoard();
}
