const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('scoreVal');
const msg = document.getElementById('msg');
const stick = document.getElementById('joystick-stick');
const base = document.getElementById('joystick-base');

canvas.width = 300;
canvas.height = 400;

let score = 0;
let gameActive = true;
let bat = { x: 130, y: 330, w: 40, h: 40 };
let obstacles = [];
let speed = 4;
let velocity = { x: 0, y: 0 };

// Joystick Logic
let stickX = 0;
let stickY = 0;
const maxRadius = 40;

base.addEventListener('touchstart', handleJoystick);
base.addEventListener('touchmove', handleJoystick);
base.addEventListener('touchend', () => {
    stick.style.transform = `translate(0px, 0px)`;
    velocity.x = 0;
    velocity.y = 0;
});

function handleJoystick(e) {
    if (!gameActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxRadius) {
        dx *= maxRadius / distance;
        dy *= maxRadius / distance;
    }

    stick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Calculate velocity based on stick position
    velocity.x = (dx / maxRadius) * speed;
    velocity.y = (dy / maxRadius) * speed;
}

// Game Loop
function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update Bat Position
    bat.x += velocity.x;
    bat.y += velocity.y;

    // Keep Bat inside Canvas
    if (bat.x < 0) bat.x = 0;
    if (bat.y < 0) bat.y = 0;
    if (bat.x > canvas.width - bat.w) bat.x = canvas.width - bat.w;
    if (bat.y > canvas.height - bat.h) bat.y = canvas.height - bat.h;

    // Obstacle Logic
    if (Math.random() < 0.03) {
        obstacles.push({ x: Math.random() * (canvas.width - 30), y: -30, w: 30, h: 30 });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.y += 3;

        // Collision
        if (bat.x < o.x + o.w && bat.x + bat.w > o.x && bat.y < o.y + o.h && bat.y + bat.h > o.y) {
            endGame();
        }

        ctx.fillStyle = '#ff4757';
        ctx.fillRect(o.x, o.y, o.w, o.h);

        if (o.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            scoreVal.innerText = score;
        }
    }

    // Draw Bat
    ctx.fillStyle = '#2f3542';
    ctx.fillRect(bat.x, bat.y, bat.w, bat.h);

    requestAnimationFrame(update);
}

function endGame() {
    gameActive = false;
    msg.style.display = 'block';
    setTimeout(resetGame, 3000);
}

function resetGame() {
    score = 0;
    obstacles = [];
    velocity = { x: 0, y: 0 };
    bat = { x: 130, y: 330, w: 40, h: 40 };
    scoreVal.innerText = '0';
    msg.style.display = 'none';
    gameActive = true;
    update();
}

update();
