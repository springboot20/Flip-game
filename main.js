const cards = document.querySelectorAll('.card');
const scoreCount = document.querySelector('.score-count');
const levelStatusText = document.querySelector('.level-text > small');
const cardsContainer = document.querySelector('.cards-container');

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

  const newCardCount = getCardCountForNewLevel(level) * cardPairsPerLevel;
  const newLevelCards = createNewCardPerLevel(newCardCount);

  newLevelCards.forEach((card) => {
    card.addEventListener('click', flipCard);
    cardsContainer.appendChild(card);
  });

  shuffle(newLevelCards);
  resetBoard();
};

const getCardCountForNewLevel = (level) => {
  const basePairs = cardPairsPerLevel; // Start with 8 pairs (16 cards) at level 1
  const additionalPairsPerLevel = 2; // Add 2 pairs (4 cards) per level
  return basePairs + (level - 1) * additionalPairsPerLevel;
};

const generateRandom = (length) => {
  return Math.floor(Math.random() * length);
};

const createNewCardPerLevel = (count) => {
  const cardArray = [];
  const imgs = [
    './emojis/emoji1.jpg',
    './emojis/emoji2.jpg',
    './emojis/emoji3.jpg',
    './emojis/emoji4.jpg',
    './emojis/emoji5.jpg',
  ];

  for (let index = 0; index < count; index++) {
    const card = document.createElement('div');
    const frontImg = document.createElement('img');
    const backImg = document.createElement('img');

    backImg.src = './emojis/playIcon.jpg';
    frontImg.src = imgs[generateRandom(imgs.length)];

    card.dataset = `emoji${index % (count / 2)}`;
    card.appendChild(frontImg);
    card.appendChild(backImg);

    cardArray.push(card);
  }
  return cardArray;
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

function shuffle(cards) {
  cards.forEach((card) => {
    let index = Math.floor(Math.random() * cards.length);
    card.style.order = index;
  });
}

const resetGame = () => {
  score = 0;
  level = 1;
  pairsFound = 0;

  scoreCount.innerHTML = `${score}`;
  levelStatusText.innerHTML = `${level}`;

  cardsContainer.innerHTML = ''; // Remove all existing cards
  const initialCardCount = getCardCountForNewLevel(level) * 2; // Calculate initial number of cards
  const initialCards = createNewCardPerLevel(initialCardCount); // Create initial cards

  initialCards.forEach((card) => {
    card.addEventListener('click', flipCard);
    cardsContainer.appendChild(card);
  });
  shuffle(initialCards);
  resetBoard();
};

/**
 * Event listeners
 */

cards.forEach((card) => card.addEventListener('click', flipCard));
document.getElementById('btn').addEventListener('click', () => {
  resetGame();
});
