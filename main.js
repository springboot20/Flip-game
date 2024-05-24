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

    if (pairsFound === getCardCountForNewLevel(level)) {
      setTimeout(levelUp, 1000);
    }
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

  // Change grid layout for level 2 and beyond
  if (level >= 2) {
    cardsContainer.classList.add('five-columns');
  } else {
    cardsContainer.classList.remove('five-columns');
  }

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
  const totalPairs = count / 2;

  const imgs = [
    './emojis/emoji1.jpg',
    './emojis/emoji2.jpg',
    './emojis/emoji3.jpg',
    './emojis/emoji4.jpg',
    './emojis/emoji5.jpg',
    './emojis/emoji6.jpg',
    './emojis/emoji7.jpg',
    './emojis/emoji8.jpg',
    './emojis/emoji9.jpg',
    './emojis/emoji10.jpg',
    './emojis/emoji11.jpg',
    './emojis/emoji12.jpg',
  ];

  for (let index = 0; index < totalPairs; index++) {
    const frontImgSrc = imgs[index % imgs.length];
    const datasetValue = `emoji${index}`;

    // create first card of the pair
    const card1 = document.createElement('div');
    card1.className = 'card';
    card1.dataset.image = datasetValue;

    const frontImg1 = document.createElement('img');
    frontImg1.src = frontImgSrc;
    frontImg1.className = 'front';

    const backImg1 = document.createElement('img');
    backImg1.src = './emojis/playIcon.jpg';
    backImg1.className = 'back';

    card1.appendChild(frontImg1);
    card1.appendChild(backImg1);

    // create second card of the pair
    const card2 = document.createElement('div');
    card2.className = 'card';
    card2.dataset.image = datasetValue;

    const frontImg2 = document.createElement('img');
    frontImg2.src = frontImgSrc;
    frontImg2.className = 'front';

    const backImg2 = document.createElement('img');
    backImg2.src = './emojis/playIcon.jpg';
    backImg2.className = 'back';

    card2.appendChild(frontImg2);
    card2.appendChild(backImg2);

    // Add both cards to the array
    cardArray.push(card1, card2);
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

(() => {
  shuffle(cards);
})();

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

resetGame();

/**
 * Event listeners
 */

cards.forEach((card) => card.addEventListener('click', flipCard));
document.getElementById('btn').addEventListener('click', () => {
  resetGame();
});

function shuffle(cards) {
  // Add shuffling class to all cards
  cards.forEach((card) => card.classList.add('shuffling'));

  // Wait for the shuffle animation to complete
  setTimeout(() => {
    // Remove shuffling class from all cards
    cards.forEach((card) => card.classList.remove('shuffling'));

    // Shuffle the cards
    cards.forEach((card) => {
      let index = Math.floor(Math.random() * cards.length);
      card.style.order = index;
    });
  }, 500);
}

// Call shuffleCards function where needed, e.g., at the start of the game or when proceeding to the next level
