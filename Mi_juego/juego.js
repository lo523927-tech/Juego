const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const soundPoint = document.getElementById('soundPoint');
const loseLife = document.getElementById('loseLife');
const reiniciarBtn = document.getElementById('reiniciarBtn');

let player, target, score, lives, timeLeft, targetTimer, keys;

function inicializarJuego() {
  player = { x: 50, y: 50, size: 30, speed: 5 };
  target = { 
    x: Math.random() * 370, 
    y: Math.random() * 370, 
    size: 20, 
    color: 'green', 
    parpadeo: 0 
  };
  score = 0;
  lives = 3;
  timeLeft = 30;
  targetTimer = 0;
  keys = {};
}

inicializarJuego();

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);
reiniciarBtn.addEventListener('click', () => inicializarJuego());

function randomColor() {
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgb(${r},${g},${b})`;
}

function update() {
  if(timeLeft <= 0 || lives <= 0) return;

  if(keys['ArrowUp']) player.y -= player.speed;
  if(keys['ArrowDown']) player.y += player.speed;
  if(keys['ArrowLeft']) player.x -= player.speed;
  if(keys['ArrowRight']) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Colisión
  let dx = (player.x + player.size/2) - (target.x + target.size/2);
  let dy = (player.y + player.size/2) - (target.y + target.size/2);
  let distance = Math.sqrt(dx*dx + dy*dy);
  if(distance < player.size/2 + target.size/2) {
    score++;
    player.speed += 0.2;
    target.size = Math.random()*25 + 15;
    target.color = randomColor();
    soundPoint.currentTime = 0;
    soundPoint.play();
    targetTimer = 0;
    target.parpadeo = 10;
    target.x = Math.random() * (canvas.width - target.size);
    target.y = Math.random() * (canvas.height - target.size);
  }

  // perder vida 
  targetTimer += 1/60;
  if(targetTimer > 5) {
    lives--;
    loseLife.currentTime = 0;
    loseLife.play();
    targetTimer = 0;
    target.parpadeo = 10;
    target.x = Math.random() * (canvas.width - target.size);
    target.y = Math.random() * (canvas.height - target.size);
  }

  if(target.parpadeo > 0) target.parpadeo--;
}

function draw() {
  // Fondo animado
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `rgb(${score*20 % 255}, 150, 200)`);
  gradient.addColorStop(1, `rgb(200, ${score*30 % 255}, 150)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // jugador
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // objetivo con parpadeo
  if(target.parpadeo > 0 && target.parpadeo % 2 === 0){
    ctx.fillStyle = 'white';
  } else {
    ctx.fillStyle = target.color;
  }
  ctx.beginPath();
  ctx.arc(target.x + target.size/2, target.y + target.size/2, target.size/2, 0, Math.PI*2);
  ctx.fill();

  // info
  ctx.fillStyle = 'black';
  ctx.font = '18px Arial';
  ctx.fillText('Puntos: ' + score, 10, 20);
  ctx.fillText('Vidas: ' + lives, 10, 40);
  ctx.fillText('Tiempo: ' + timeLeft + 's', 10, 60);

  // mensaje final
  if(timeLeft <= 0 || lives <= 0){
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('¡Juego terminado!', 60, 200);
    ctx.font = '24px Arial';
    ctx.fillText('Puntaje final: ' + score, 110, 240);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Cronómetro
setInterval(() => {
  if(timeLeft > 0 && lives > 0) timeLeft--;
}, 1000);

loop();
