const cards = document.querySelectorAll('.card')
var isFlipped = false
var firstCard;
var secondCard;

cards.forEach((card) => card.addEventListener('click', flipCard))

function flipCard() {
     this.classList.add('flip')
     if (!isFlipped) {
          isFlipped = true
          firstCard = this
     } else {
          secondCard = this
          checkcard()
          console.log(firstCard);
     }
}

function checkcard() {
     if (firstCard.dataset.image === secondCard.dataset.image) {
          success()
     } else {
          failed()
     }
}


function success() {
     firstCard.removeEventListener('click', flipCard)
     secondCard.removeEventListener('click', flipCard)
     reset()
}
function failed() {
     setTimeout(() => {
          firstCard.classList.remove('flip')
          secondCard.classList.remove('flip')
          reset()
     }, 1000);
}

function reset() {
     isFlipped = false
     firstCard = null
     secondCard = null
}


(function shufffle() {
     cards.forEach((card) => {
          let index = Math.floor(Math.random() * 16)
          card.style.order = index
     })
})()


document.querySelector('.resetBtn').addEventListener('click', reset)
