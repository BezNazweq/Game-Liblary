let grid = document.getElementById("gameGrid");
let difficulty = "normal";
let rows = 4;
let cols = 4;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let gameActive = false;
const difficultySettings = {
    easy: { rows: 2, cols: 4 },
    normal: { rows: 4, cols: 4 },
    hard: { rows: 4, cols: 6 },
    "very-hard": { rows: 4, cols: 8 }
};
const emojiList = [
    '🍎','🍌','🍇','🍉','🍒','🍓','🍑','🍍','🥝','🥑','🍆','🥕','🌽','🍔','🍕','🍟','🍩','🍪','🍫','🍿','🍭','🍬','🍯','🥨','🥐','🥯','🥞','🧇','🍗','🍖','🍤','🍣','🍱','🍛','🍜','🍝','🍚','🍙','🍘','🍥','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🍰','🎂','🧁','🍮','🍯','🍵','☕','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾'
];
const bgColors = [
    '#ffb3ba','#baffc9','#bae1ff','#ffffba','#bdb2ff','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#ffc6ff','#b5ead7','#ffdac1','#e2f0cb','#b5ead7','#c7ceea','#f1cbff','#f3ffe3','#f7d6e0','#e4c1f9','#f9c6c9','#f6eac2','#c2f9bb','#c2e9fb','#f9f7cf','#f7d6e0','#e4c1f9','#f9c6c9','#f6eac2','#c2f9bb','#c2e9fb','#f9f7cf','#f7d6e0'
];
function setDifficultyAndRestart() {
    setDifficulty();
    startGame();
}
function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
    rows = difficultySettings[difficulty].rows;
    cols = difficultySettings[difficulty].cols;
}
function startGame() {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameActive = true;
    const totalCards = rows * cols;

    let usedEmojis = emojiList.slice(0, totalCards / 2);
    let usedColors = bgColors.slice(0, totalCards / 2);
    const cardValues = usedEmojis.map((emoji, i) => ({emoji, color: usedColors[i]}));
    const cardDeck = [...cardValues, ...cardValues].sort(() => Math.random() - 0.5);
    cardDeck.forEach((obj, idx) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = obj.emoji;
        card.dataset.bg = obj.color;
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Card with emoji ${obj.emoji}`);
        card.style.background = '';
        card.addEventListener("click", flipCard);
        card.addEventListener("keydown", function(e) { if (e.key === 'Enter' || e.key === ' ') { flipCard.call(card); } });
        grid.appendChild(card);
    });
}
function flipCard() {
    if (lockBoard || !gameActive) return;
    if (this === firstCard || this.classList.contains('flipped')) return;
    this.classList.add("flipped");
    this.textContent = this.dataset.value;
    this.style.background = this.dataset.bg;
    showParticles(this, this.dataset.bg);
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkForMatch();
}
function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
        matchedPairs++;
        showParticles(firstCard, firstCard.dataset.bg);
        showParticles(secondCard, secondCard.dataset.bg);        if (matchedPairs === (rows * cols) / 2) {
            setTimeout(() => {
                alert("You Win!");
                gameActive = false;
            }, 500);
        } else {
            resetBoard();
        }
        return;
    }
    unflipCards();
}
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
}
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.textContent = "";
        secondCard.textContent = "";
        firstCard.style.background = '';
        secondCard.style.background = '';
        resetBoard();
    }, 1000);
}
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}
function showParticles(card, color) {
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        const size = 8 + Math.random() * 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 8px 2px ${color}`;
        particle.style.left = (rect.left + rect.width/2 + window.scrollX) + 'px';
        particle.style.top = (rect.top + rect.height/2 + window.scrollY) + 'px';
        document.body.appendChild(particle);
        const angle = Math.random() * 2 * Math.PI;
        const distance = 40 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        particle.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
            { transform: `translate(${x}px,${y}px) scale(${0.5 + Math.random()})`, opacity: 0 }
        ], {
            duration: 900 + Math.random()*400,
            easing: 'cubic-bezier(.17,.67,.83,.67)',
            fill: 'forwards'
        });
        setTimeout(() => particle.remove(), 1300);
    }
}
setDifficulty();
startGame();
