const highScoreElement = document.getElementById("high-score");
const scoreElement = document.getElementById("score-board");
const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerHTML = "High Score: " + highScore;

// Snake grid logic
const box = 20; 
let snake, food, score, d, game, gameActive = false;

// Variables for Smooth Movement
const targetBox = box; // How far the snake moves per grid step
let isMoving = false; // Flag to check if we are already grid-aligned
let d_next = "right"; // Direction buffer for queued inputs

function initGame() {
    document.getElementById('start-menu').style.display = 'none';
    resetGame();
}

function resetGame() {
    clearInterval(game);
    // Start with a longer body for a better feel
    snake = [
        { x: 9 * box, y: 10 * box },
        { x: 8 * box, y: 10 * box },
        { x: 7 * box, y: 10 * box }
    ];
    food = {
        x: Math.floor(Math.random() * 14 + 1) * box,
        y: Math.floor(Math.random() * 14 + 1) * box
    };
    score = 0;
    d = "right";
    d_next = "right";
    scoreElement.innerHTML = "Score: 0";
    gameActive = true;
    
    // We don't use setInterval for logic anymore. 
    // We use RequestAnimationFrame for smooth drawing.
    gameLoop();
}

function changeDir(dir) {
    if (!gameActive || !isMoving) return; // Only accept direction when grid-aligned

    if (dir === "left" && d !== "right") d_next = "left";
    else if (dir === "up" && d !== "down") d_next = "up";
    else if (dir === "right" && d !== "left") d_next = "right";
    else if (dir === "down" && d !== "up") d_next = "down";
}

// Game Loop: Handles drawing every frame for smooth visuals
function gameLoop() {
    if (!gameActive) return;

    drawSmooth();
    requestAnimationFrame(gameLoop);
}

// Main logic: Moves snake per grid cell (called by drawSmooth when aligned)
function moveSnake() {
    d = d_next; // Use queued direction

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "left") snakeX -= box;
    if (d === "up") snakeY -= box;
    if (d === "right") snakeX += box;
    if (d === "down") snakeY += box;

    // Eat Food Logic
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.innerHTML = "Score: " + score;
        food = {
            x: Math.floor(Math.random() * 14 + 1) * box,
            y: Math.floor(Math.random() * 14 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over Checks
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

// Fixed drawing: Draw snake head smoothly transitioning between cells
let smoothX = 0;
let smoothY = 0;
function drawSmooth() {
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake Body (Draw all but head normally)
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = "#34495e";
        ctx.fillRect(snake[i].x, snake[i].y, box - 2, box - 2);
    }

    // --- Smooth Head Handling ---
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (smoothX === 0 && smoothY === 0) {
        // We are aligned, take queued direction
        moveSnake();
        isMoving = false;
    }

    // Set smoothness speed (lower = slower, higher = faster)
    let speed = 4;

    if (d === "right") smoothX += speed;
    else if (d === "left") smoothX -= speed;
    else if (d === "up") smoothY -= speed;
    else if (d === "down") smoothY += speed;

    // Calculate Smooth Draw Position
    let drawX = headX + smoothX;
    let drawY = headY + smoothY;

    // We reached the target grid point
    if (Math.abs(smoothX) >= box || Math.abs(smoothY) >= box) {
        smoothX = 0;
        smoothY = 0;
        // Don't call moveSnake() here, call it at start of aligned block
    } else {
        isMoving = true;
    }

    // Draw Smooth Head
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(drawX, drawY, box - 2, box - 2);
}

function gameOver() {
    gameActive = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreElement.innerHTML = "High Score: " + highScore;
    }
    
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

canvas.addEventListener("click", function() {
    if (!gameActive && document.getElementById('start-menu').style.display === 'none') {
        resetGame();
    }
});
