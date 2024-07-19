const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: -gridSize };
let food = getRandomFoodPosition();
let score = 0;
let highScore = 0;
let gameInterval;

document.addEventListener('keydown', changeDirection);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        restartGame();
    }
});

function startGame() {
    gameInterval = setInterval(gameLoop, 150);
}

function gameLoop() {
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x >= canvasSize || head.x < 0 || head.y >= canvasSize || head.y < 0 || collision(head)) {
        clearInterval(gameInterval);
        showRestartButton();
        updateHighScore();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFoodPosition();
        document.getElementById('scoreBoard').innerText = `Score: ${score}`;
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
}

function changeDirection(event) {
    const key = event.key;

    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

function setDirection(dir) {
    if (dir === 'up' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (dir === 'down' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (dir === 'left' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (dir === 'right' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

function collision(head) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function getRandomFoodPosition() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        foodY = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
    return { x: foodX, y: foodY };
}

function showRestartButton() {
    const restartButton = document.getElementById('restartButton');
    restartButton.classList.add('show');
}

function hideRestartButton() {
    const restartButton = document.getElementById('restartButton');
    restartButton.classList.remove('show');
}

function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: -gridSize };
    food = getRandomFoodPosition();
    score = 0;
    document.getElementById('scoreBoard').innerText = `Score: ${score}`;
    hideRestartButton();
    startGame();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScoreBoard').innerText = `High Score: ${highScore}`;
    }
}

function detectDevice() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.getElementById('mobileControls').classList.remove('hidden');
    }
}

detectDevice();
startGame();
