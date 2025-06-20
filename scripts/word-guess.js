const words = [
    'apple', 'banana', 'orange', 'grape', 'lemon', 'peach', 'cherry', 'melon', 'mango', 'kiwi',
    'school', 'garden', 'planet', 'animal', 'window', 'bottle', 'pencil', 'guitar', 'pillow', 'cloud',
    'friend', 'family', 'summer', 'winter', 'spring', 'autumn', 'river', 'mountain', 'forest', 'desert'
];
let chosenWord = '';
let displayWord = [];
let guessedLetters = [];
let tries = 6;

function startGame() {
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill('_');
    guessedLetters = [];
    tries = 6;
    updateDisplay();
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessInput').focus();
    document.getElementById('triesLeft').textContent = `Tries left: ${tries}`;
    hideFeedback();
}

function updateDisplay() {
    const wordDisplayEl = document.getElementById('wordDisplay');
    wordDisplayEl.innerHTML = '';
    

    displayWord.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box' + (letter !== '_' ? ' guessed' : '');
        letterBox.textContent = letter;
        wordDisplayEl.appendChild(letterBox);
    });
    
    document.getElementById('guessedLetters').textContent = 'Guessed: ' + guessedLetters.join(', ');
    document.getElementById('triesLeft').textContent = `Tries left: ${tries}`;
}

function showParticles(letter, correct) {

    const letterBoxes = document.querySelectorAll('.letter-box');
    
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            const box = letterBoxes[i];
            const rect = box.getBoundingClientRect();
            
            for (let j = 0; j < 8; j++) {
                const particle = document.createElement('span');
                particle.className = 'word-particle particle';
                const size = 5 + Math.random() * 8;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = correct ? '#5cb85c' : '#d9534f';
                particle.style.left = (rect.left + rect.width/2) + 'px';
                particle.style.top = (rect.top + rect.height/2) + 'px';
                document.body.appendChild(particle);
                
                const angle = Math.random() * 2 * Math.PI;
                const distance = 30 + Math.random() * 30;
                const px = Math.cos(angle) * distance;
                const py = Math.sin(angle) * distance;
                
                particle.animate([
                    { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
                    { transform: `translate(${px}px,${py}px) scale(${0.5 + Math.random()})`, opacity: 0 }
                ], {
                    duration: 800 + Math.random()*300,
                    easing: 'cubic-bezier(.17,.67,.83,.67)',
                    fill: 'forwards'
                });
                
                setTimeout(() => particle.remove(), 1100);
            }
        }
    }
}

function showFeedback(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = isCorrect ? 
        'feedback-message correct-message show' : 
        'feedback-message incorrect-message show';
    
    setTimeout(hideFeedback, 2000);
}

function hideFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback-message';
}

function submitGuess() {
    const input = document.getElementById('guessInput');
    let letter = input.value.toUpperCase();
    
    if (!letter.match(/^[A-Z]$/) || guessedLetters.includes(letter)) {
        input.value = '';
        return;
    }
    
    guessedLetters.push(letter);
    let found = false;
    
    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            displayWord[i] = letter;
            found = true;
        }
    }
    
    if (found) {
        showParticles(letter, true);
        showFeedback('Correct!', true);
    } else {
        tries--;
        showFeedback('Wrong!', false);
    }
    
    updateDisplay();
    input.value = '';
    input.focus();
    
    if (displayWord.join('') === chosenWord) {
        showFeedback('You Win!', true);
        document.getElementById('triesLeft').textContent = 'You Win!';
        input.disabled = true;
    } else if (tries === 0) {
        showFeedback(`Game Over!`, false);
        document.getElementById('triesLeft').textContent = `Game Over! Word was: ${chosenWord}`;
        input.disabled = true;
    }
}


function setupEventListeners() {
    const input = document.getElementById('guessInput');
    if (input) {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') submitGuess();
        });
    }
}

window.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    startGame();
});
