const cards = document.querySelectorAll('.card');
let isFlipped = false;
let firstCard;
let secondCard;

let count = 0;

cards.forEach((card) => card.addEventListener('click', flipCard));

function flipCard() {
  this.classList.add('flip');
  if (!isFlipped) {
    isFlipped = true;
    firstCard = this;
  } else {
    secondCard = this;
    checkCard();
    console.log(firstCard);
  }
}

function checkCard() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    success();
  } else {
    failed();
  }
}

function success() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  reset();
}
function failed() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    reset();
  }, 400);
}

(function shuffle() {
  cards.forEach((card) => {
    let index = Math.floor(Math.random() * 16);
    card.style.order = index;
  });
})();

console.log(document.querySelector('.resetBtn'));

document.getElementById('btn').addEventListener('click', () => {
  document.addEventListener('load', () => {
    isFlipped = false;
    firstCard = null;
    secondCard = null;
  });
});
