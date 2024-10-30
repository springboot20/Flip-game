const cards = document.querySelectorAll(".card");
const scoreCount = document.querySelector(".score-count");
const levelStatusText = document.querySelector(".level-text > small");
const cardsContainer = document.querySelector(".cards-container");
const chanceEl = document.querySelector(".chancesLeft > span");
const highScoreEl = document.querySelector(".highScore > span");

let maximumLevel = 6;

/**
 * Game initial states
 */
let isGameStarted = false;
let isFlipped = false;
let lockBoard = false; // New variable to prevent clicking when two cards are being checked
let firstCard, secondCard;
let score = 0;
let level = 1; // starting level
let pairsFound = 0; // number of paired cards
let chanceLeft = 10; // number of trier if two pair of card did not matched
let highScore = 0;
let cardPairsPerLevel = 8; // sixteen card will be displayed
let highScoreInterval = null;

const basePairs = cardPairsPerLevel; // Start with 8 pairs (16 cards) at level 1
const additionalPairsPerLevel = 2; // Add 2 pairs (4 cards) per level

// images pairs for dynamic generate
const imgs = [
  "./emojis/emoji1.jpg",
  "./emojis/emoji2.jpg",
  "./emojis/emoji3.jpg",
  "./emojis/emoji4.jpg",
  "./emojis/emoji5.jpg",
  "./emojis/emoji6.jpg",
  "./emojis/emoji7.jpg",
  "./emojis/emoji8.jpg",
  "./emojis/emoji9.jpg",
  "./emojis/emoji10.jpg",
  "./emojis/emoji11.jpg",
  "./emojis/emoji12.jpg",
];

const startHighScoreCounter = () => {
  highScore = 0;

  clearInterval(highScoreInterval);

  highScoreInterval = setInterval(() => {
    highScore++;
    highScoreEl.innerText = highScore;
  }, 100);
};

const stopHighScoreCounter = () => {
  clearInterval(highScoreInterval);
};

function flipCard() {
  if (lockBoard) return; // Prevent flipping if board is locked
  if (this === firstCard) return; // Prevent double click on the same card

  this.classList.add("flip");

  if (!isGameStarted) {
    isGameStarted = true;

    startHighScoreCounter();
  }

  if (!isFlipped) {
    isFlipped = true;
    firstCard = this;
    return;
  } else {
    secondCard = this;
  }

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
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  scoreCount.innerHTML = score; // Replace instead of append
  resetBoard();
};

const clearExistingCardsOnLevelUp = (cardsContainer) => {
  cardsContainer.innerHTML = null;
};

const levelUp = () => {
  level++;
  pairsFound = 0;
  levelStatusText.innerHTML = level;

  // Change grid layout for level 2 and beyond
  if (level >= 3) {
    cardsContainer.classList.add("five-columns");
  } else {
    cardsContainer.classList.remove("five-columns");
  }

  // clear existing cards on leveling up
  clearExistingCardsOnLevelUp(cardsContainer);

  const newCardCount = getCardCountForNewLevel(level) * 2;
  const newLevelCards = createNewCardPerLevel(newCardCount);

  console.log(newLevelCards);

  // add new set of cards to the containers
  newLevelCards.forEach((card) => cardsContainer.appendChild(card));

  // Reattach click event for the new set of cards
  newLevelCards.forEach((card) => card.addEventListener("click", flipCard));

  // shuffle the cards i.e rearrange them
  shuffle(newLevelCards);

  // reset the game board
  resetBoard();
};

const getCardCountForNewLevel = (level) => {
  return basePairs + (level - 1) * additionalPairsPerLevel;
};

const generateRandom = (length) => {
  return Math.floor(Math.random() * length);
};

const createNewCardPerLevel = (count) => {
  const cardArray = [];
  const totalPairs = count / 2;

  for (let index = 0; index < totalPairs; index++) {
    const frontImgSrc = imgs[index % imgs.length];
    const datasetValue = `emoji${index}`;

    // create first card of the pair
    const card1 = document.createElement("div");
    card1.className = "card";
    card1.dataset.image = datasetValue;

    const frontImg1 = document.createElement("img");
    frontImg1.src = frontImgSrc;
    frontImg1.className = "front";

    const backImg1 = document.createElement("img");
    backImg1.src = "./emojis/playIcon.jpg";
    backImg1.className = "back";

    card1.appendChild(frontImg1);
    card1.appendChild(backImg1);

    // create second card of the pair
    const card2 = document.createElement("div");
    card2.className = "card";
    card2.dataset.image = datasetValue;

    const frontImg2 = document.createElement("img");
    frontImg2.src = frontImgSrc;
    frontImg2.className = "front";

    const backImg2 = document.createElement("img");
    backImg2.src = "./emojis/playIcon.jpg";
    backImg2.className = "back";

    card2.appendChild(frontImg2);
    card2.appendChild(backImg2);

    // Add both cards to the array
    cardArray.push(card1, card2);
  }

  cardArray.forEach((card) => {
    card.removeEventListener("click", flipCard);
  });

  return cardArray;
};

/**
 * Enhance failed with Improved Feedback
 */
const failed = () => {
  cards.forEach((card) => card.removeEventListener("click", flipCard));

  chanceLeft--;
  chanceEl.innerHTML = chanceLeft;

  if (chanceLeft <= 0) {
    alert("Game over");
    setTimeout(gameOver, 500);

    chanceLeft = 10;

  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }
};

const resetBoard = () => {
  [isFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

(() => {
  shuffle(cards);
  chanceEl.innerHTML = chanceLeft;
})();

const resetGame = () => {
  score = 0;
  level = 1;
  chanceLeft = 10;
  pairsFound = 0;
  highScoreEl.innerHTML = 0;

  scoreCount.innerHTML = `${score}`;
  levelStatusText.innerHTML = `${level}`;
  cardsContainer.classList.remove("five-columns"); // Ensure five-columns is removed when the game resets

  cardsContainer.innerHTML = ""; // Remove all existing cards

  const initialCardCount = getCardCountForNewLevel(level) * 2; // Calculate initial number of cards
  const initialCards = createNewCardPerLevel(initialCardCount); // Create initial cards

  initialCards.forEach((card) => {
    card.addEventListener("click", flipCard);
    cardsContainer.appendChild(card);
  });

  isGameStarted = false;

  stopHighScoreCounter();
  shuffle(initialCards);
  resetBoard();
};

resetGame();

const gameOver = () => {
  resetGame();
  resetBoard();
};

/**
 * Event listeners
 */

cards.forEach((card) => card.addEventListener("click", flipCard));

document.getElementById("btn").addEventListener("click", () => {
  resetGame();
});

function shuffle(cards) {
  // Shuffle the cards
  [...cards].forEach((card) => {
    let index = Math.floor(Math.random() * cards.length);
    card.style.order = index;
  });
}
