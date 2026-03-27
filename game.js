const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const player = { x: 50, y: 50, w: 30, h: 30, speed: 4 };
const enemy = { x: 200, y: 200, w: 40, h: 40, speed: 2, dir: 1 };
const coffee = { x: 300, y: 150, w: 20, h: 20 };
let score = 0;
let stealth = 3;
let keys = {};
let gameRunning = false;

function randomPos(obj) {
    obj.x = Math.random() * (canvas.width - obj.w);
    obj.y = Math.random() * (canvas.height - obj.h);
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    gameRunning = true;
    randomPos(coffee);
    requestAnimationFrame(gameLoop);
}

document.getElementById('start-button').addEventListener('click', startGame);

document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

function update() {
    if (!gameRunning) return;
    // Player movement
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    // Boundaries
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    // Enemy patrol
    enemy.x += enemy.speed * enemy.dir;
    if (enemy.x < 0 || enemy.x + enemy.w > canvas.width) {
        enemy.dir *= -1;
    }

    // Collision detection
    if (checkCollision(player, coffee)) {
        score++;
        randomPos(coffee);
    }
    if (checkCollision(player, enemy)) {
        stealth--;
        player.x = 50; player.y = 50; // reset player
        if (stealth <= 0) {
            gameRunning = false;
            alert('Game Over! Score: ' + score);
        }
    }
}

function checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.h + a.y > b.y;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // player
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    // enemy
    ctx.fillStyle = '#E53935';
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    // coffee
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(coffee.x, coffee.y, coffee.w, coffee.h);

    // Score & stealth
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
    ctx.fillText('Stealth: ' + stealth, 10, 40);
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}
