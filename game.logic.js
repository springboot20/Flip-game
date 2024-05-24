class FlipGame {
  constructor(scoreEl) {
    this.isFlipped = false;
    this.lockBoard = false;
    this.firstCard = false;
    this.secondCard = false;
    this.score = 0;

    // html elements
    this.scoreEl = scoreEl;
  }

  static flipCard() {
    if (this.lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!this.isFlipped) {
      this.isFlipped = true;
      this.firstCard = this;
      return;
    } else this.secondCard = this;

    this.lockBoard = true;
  }
}
