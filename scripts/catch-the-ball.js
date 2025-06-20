let canvas, ctx;

function initializeCanvas() {
    canvas = document.getElementById("gameCanvas");
    if (canvas) {
        ctx = canvas.getContext("2d");
        return true;
    }
    return false;
}
initializeCanvas();
let basket = { width: 100, height: 20, x: 0, y: 0, dx: 30 };
let ball = { radius: 15, x: 0, y: 0, dy: 4 };
let score = 0;
let difficulty = "normal";
let isGameRunning = false;
let lives = 3;
const ballSpeed = { easy: 2, normal: 4, hard: 6, veryHard: 8 };

function resizeCanvas() {
    if (!canvas) {
        if (!initializeCanvas()) return;
    }
    

    canvas.width = Math.min(500, Math.max(320, window.innerWidth * 0.7));
    canvas.height = Math.min(400, Math.max(240, window.innerHeight * 0.5));
    basket.x = canvas.width / 2 - basket.width / 2;
    basket.y = canvas.height - 40;
}

window.addEventListener('resize', resizeCanvas);

function drawBasket() {
    if (!ctx) return;
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawBall() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF5733";
    ctx.fill();
    ctx.closePath();
}

function showParticles(x, y, color) {
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        const size = 8 + Math.random() * 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 8px 2px ${color}`;
        particle.style.left = (canvas.offsetLeft + x) + 'px';
        particle.style.top = (canvas.offsetTop + y) + 'px';
        document.body.appendChild(particle);
        const angle = Math.random() * 2 * Math.PI;
        const distance = 40 + Math.random() * 40;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;
        particle.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 0.9 },
            { transform: `translate(${px}px,${py}px) scale(${0.5 + Math.random()})`, opacity: 0 }
        ], {
            duration: 900 + Math.random()*400,
            easing: 'cubic-bezier(.17,.67,.83,.67)',
            fill: 'forwards'
        });
        setTimeout(() => particle.remove(), 1300);
    }
}

function updateBall() {
    if (!isGameRunning) return;
    ball.y += ball.dy;
    if (ball.y - ball.radius > canvas.height) {
        lives--;
        document.getElementById("lives").innerText = `Lives: ${lives}`;
        showParticles(ball.x, canvas.height - 10, '#e57373');
        if (lives <= 0) {
            endGame();
            return;
        }
        resetBall();
    }
    if (
        ball.y + ball.radius >= basket.y &&
        ball.x >= basket.x &&
        ball.x <= basket.x + basket.width
    ) {
        score++;
        document.getElementById("score").innerText = `Score: ${score}`;
        showParticles(ball.x, ball.y, '#4CAF50');
        resetBall();
    }
}

function resetBall() {
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = 0;
    ball.dy = ballSpeed[difficulty];
}

function moveBasket(event) {
    if (!isGameRunning) return;
    if (event.key === "a" && basket.x > 0) {
        basket.x -= basket.dx;
    }
    if (event.key === "d" && basket.x + basket.width < canvas.width) {
        basket.x += basket.dx;
    }
}

function setDifficulty() {
    const level = document.getElementById("difficulty").value;
    switch (level) {
        case "easy":
            difficulty = "easy";
            break;
        case "normal":
            difficulty = "normal";
            break;
        case "hard":
            difficulty = "hard";
            break;
        case "very-hard":
            difficulty = "veryHard";
            break;
    }
    if (isGameRunning) resetBall();
}

function startGame() {
    score = 0;
    lives = 3;
    isGameRunning = true;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    basket.x = canvas.width / 2 - basket.width / 2;
    basket.y = canvas.height - 40;
    resetBall();
    document.getElementById('startBtn').disabled = true;
}

function endGame() {
    isGameRunning = false;
    setTimeout(() => {
        alert(`Game Over! Your score: ${score}`);
        document.getElementById('startBtn').disabled = false;
    }, 100);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawBall();
    updateBall();
    requestAnimationFrame(gameLoop);
}


window.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById("gameCanvas");
    if (canvas) {
        document.addEventListener("keydown", moveBasket);
        resizeCanvas();
        gameLoop();
    }
});
