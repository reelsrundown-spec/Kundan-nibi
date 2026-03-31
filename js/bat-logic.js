const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");

const box = 20;
canvas.width = 300; 
canvas.height = 360;

let bat = [{ x: 8 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 14) * box, y: Math.floor(Math.random() * 14 + 2) * box };
let stones = []; 
let score = 0;
let foodCounter = 0;
let d = "RIGHT";

function changeDir(direction) {
    if (direction == 'LEFT' && d != 'RIGHT') d = 'LEFT';
    if (direction == 'UP' && d != 'DOWN') d = 'UP';
    if (direction == 'RIGHT' && d != 'LEFT') d = 'RIGHT';
    if (direction == 'DOWN' && d != 'UP') d = 'DOWN';
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bat Drawing
    for (let i = 0; i < bat.length; i++) {
        ctx.fillStyle = (i == 0) ? "#a29bfe" : "#6c5ce7";
        ctx.fillRect(bat[i].x, bat[i].y, box, box);
    }

    // Food
    ctx.fillStyle = "#55efc4";
    ctx.fillRect(food.x, food.y, box, box);

    // Falling Stones
    ctx.fillStyle = "#ff7675";
    for(let i=0; i<stones.length; i++) {
        ctx.fillRect(stones[i].x, stones[i].y, box, box);
        stones[i].y += 4; // കല്ല് താഴേക്ക് വരുന്ന വേഗത

        // വവ്വാലിന്റെ തലയിൽ കല്ല് കൊണ്ടാൽ ഔട്ട്
        if(Math.abs(stones[i].x - bat[0].x) < box && Math.abs(stones[i].y - bat[0].y) < box) {
            gameOver();
        }
    }

    let batX = bat[0].x;
    let batY = bat[0].y;

    if (d == "LEFT") batX -= box;
    if (d == "UP") batY -= box;
    if (d == "RIGHT") batX += box;
    if (d == "DOWN") batY += box;

    if (batX == food.x && batY == food.y) {
        score++;
        foodCounter++;
        scoreElement.innerHTML = score;
        food = { x: Math.floor(Math.random() * 14) * box, y: Math.floor(Math.random() * 14 + 2) * box };
        
        if(foodCounter % 5 == 0) {
            stones.push({ x: Math.floor(Math.random() * 14) * box, y: 0 });
        }
    } else {
        bat.pop();
    }

    let newHead = { x: batX, y: batY };

    if (batX < 0 || batX >= canvas.width || batY < 0 || batY >= canvas.height || collision(newHead, bat)) {
        gameOver();
    }

    bat.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function gameOver() {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    location.reload();
}

let game = setInterval(draw, 150);
          
