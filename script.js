// Создание холста
const canvas = document.getElementById('arkanoidCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Параметры платформы
const paddleWidth = 75;
const paddleHeight = 10;
const paddleSpeed = 7;
let paddleX = (width - paddleWidth) / 2;

// Параметры мяча
const ballRadius = 10;
let ballX = width / 2;
let ballY = height - ballRadius - paddleHeight;
let ballSpeedX = 3;
let ballSpeedY = -3;

// Кирпичи
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickMargin = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Cчет
let score = 0;

// Обработчики событий для управления платформой
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === 'Right' || event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Отрисовка платформы
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Отрисовка мяча
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Отрисовка кирпичей
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickMargin) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickMargin) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Обработка столкновений
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ballX > brick.x && ballX < brick.x + brickWidth && ballY > brick.y && ballY < brick.y + brickHeight) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('You win!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Отрисовка счета
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20);
}

// Обновление состояния игры
function update() {
  if (rightPressed && paddleX < width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Отскок мяча от стен
  if (ballX + ballRadius > width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // Отскок мяча от платформы
  if (ballY + ballRadius > height - paddleHeight && ballX > paddleX && ballX < paddleX + paddleWidth) {
    ballSpeedY = -ballSpeedY;
  }

  collisionDetection();
}

// Отрисовка экрана
function draw() {
  ctx.clearRect(0, 0, width, height);
  drawPaddle();
  drawBricks();
  drawBall();
  drawScore();
}

// Игровой цикл
function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 10);