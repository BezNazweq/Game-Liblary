let score = 0;
let currentAnswer = 0;
let questionCount = 0;
let maxQuestions = 10;

function startGame() {
    score = 0;
    questionCount = 0;
    document.getElementById('score').textContent = `Score: 0/${maxQuestions}`;
    hideFeedback();
    nextQuestion();
}

function nextQuestion() {
    if (questionCount >= maxQuestions) {
        document.getElementById('question').textContent = 'Quiz finished!';
        showFeedback(`Final score: ${score}/${maxQuestions}`, score > maxQuestions/2);
        return;
    }

    const difficulty = document.getElementById('difficulty').value;
    let a, b, op, answer;
    
    switch (difficulty) {
        case 'easy':
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            op = ['+', '-'][Math.floor(Math.random() * 2)];
            break;
        case 'normal':
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
            break;
        case 'hard':
            a = Math.floor(Math.random() * 100) + 1;
            b = Math.floor(Math.random() * 99) + 2;
            op = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
            break;
    }

    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else if (op === '*') answer = a * b;
    else if (op === '/') {
        answer = Math.floor(a / b);
        a = answer * b;
    }

    currentAnswer = answer;
    document.getElementById('question').textContent = `${a} ${op} ${b} = ?`;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    questionCount++;
}

function showParticles(x, y, isCorrect) {
    const elemRect = document.getElementById('question').getBoundingClientRect();
    const centerX = elemRect.left + (elemRect.width / 2);
    const centerY = elemRect.top + (elemRect.height / 2);
    
    for (let i = 0; i < 16; i++) {
        const particle = document.createElement('span');
        particle.className = 'math-particle particle';
        const size = 6 + Math.random() * 12;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
    
        if (isCorrect) {
            particle.style.background = `rgba(92, 184, 92, ${0.6 + Math.random()*0.4})`;
            particle.style.boxShadow = '0 0 8px rgba(92, 184, 92, 0.8)';
        } else {
            particle.style.background = `rgba(217, 83, 79, ${0.6 + Math.random()*0.4})`;
            particle.style.boxShadow = '0 0 8px rgba(217, 83, 79, 0.8)';
        }
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        document.body.appendChild(particle);
        
        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 60;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
            { transform: `translate(${px}px,${py}px) scale(${0.5 + Math.random()})`, opacity: 0 }
        ], {
            duration: 1000 + Math.random()*500,
            easing: 'cubic-bezier(.17,.67,.83,.67)',
            fill: 'forwards'
        });
        
        setTimeout(() => particle.remove(), 1500);
    }
}

function showFeedback(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = isCorrect ? 'feedback-message correct-message show' : 'feedback-message incorrect-message show';
    } else {
        console.error("Feedback element not found");
    }
}

function hideFeedback() {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.className = 'feedback-message';
        feedback.textContent = '';
    }
}

function submitAnswer() {
    const val = document.getElementById('answerInput').value;
    if (val === '') return;
    
    const userAnswer = parseInt(val);
    const isCorrect = userAnswer === currentAnswer;
    
    if (isCorrect) {
        score++;
        showFeedback('Correct!', true);
    } else {
        showFeedback(`Wrong! Correct answer: ${currentAnswer}`, false);
    }
    

    showParticles(0, 0, isCorrect);
    
    document.getElementById('score').textContent = `Score: ${score}/${maxQuestions}`;
    
    setTimeout(() => {
        hideFeedback();
        nextQuestion();
    }, 1500);
}

document.getElementById('answerInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') submitAnswer();
});

window.onload = startGame;
