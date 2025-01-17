const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ship {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 20;
    this.angle = 0;
    this.rotation = 0;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
    this.health = 3;
    this.lastCollisionTime = 0; 
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(
      this.x + this.radius * Math.cos(this.angle),
      this.y - this.radius * Math.sin(this.angle)
    );
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.angle) + Math.sin(this.angle)),
      this.y + this.radius * (Math.sin(this.angle) - Math.cos(this.angle))
    );
    ctx.lineTo(
      this.x - this.radius * (Math.cos(this.angle) - Math.sin(this.angle)),
      this.y + this.radius * (Math.sin(this.angle) + Math.cos(this.angle))
    );
    ctx.closePath();
    ctx.stroke();

   
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Health: " + this.health, 20, 30);
  }

  update(deltaTime) {
    if (this.thrusting) {
      this.thrust.x += 0.1 * Math.cos(this.angle);
      this.thrust.y -= 0.1 * Math.sin(this.angle);
    } else {
      this.thrust.x -= this.thrust.x * 0.02;
      this.thrust.y -= this.thrust.y * 0.02;
    }

    this.x += this.thrust.x;
    this.y += this.thrust.y;

    this.angle += this.rotation;

    if (this.x < 0 - this.radius) this.x = canvas.width + this.radius;
    if (this.x > canvas.width + this.radius) this.x = 0 - this.radius;
    if (this.y < 0 - this.radius) this.y = canvas.height + this.radius;
    if (this.y > canvas.height + this.radius) this.y = 0 - this.radius;
  }

  reset() {
    const safeDistance = 300; 
    this.x = canvas.width / 2 + (Math.random() * 2 - 1) * safeDistance;
    this.y = canvas.height / 2 + (Math.random() * 2 - 1) * safeDistance;
    this.thrust.x = 0;
    this.thrust.y = 0;
    this.angle = 0;
    this.rotation = 0;
    this.thrusting = false;
    this.lastCollisionTime = Date.now(); 
  }
}

const ship = new Ship();

document.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'ArrowUp':
      ship.thrusting = true;
      break;
    case 'ArrowLeft':
      ship.rotation = -0.1;
      break;
    case 'ArrowRight':
      ship.rotation = 0.1;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'ArrowUp':
      ship.thrusting = false;
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      ship.rotation = 0;
      break;
  }
});

class Asteroid {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 2 + 1;
    this.velX = Math.cos(this.angle) * this.speed;
    this.velY = Math.sin(this.angle) * this.speed;
  }

  draw() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    
    if (this.x < 0 - this.radius) this.x = canvas.width + this.radius;
    if (this.x > canvas.width + this.radius) this.x = 0 - this.radius;
    if (this.y < 0 - this.radius) this.y = canvas.height + this.radius;
    if (this.y > canvas.height + this.radius) this.y = 0 - this.radius;
  }
}

function createAsteroids(numAsteroids) {
  const asteroids = [];
  for (let i = 0; i < numAsteroids; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    asteroids.push(new Asteroid(x, y, 30));
  }
  return asteroids;
}

let asteroids = createAsteroids(10);

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ship.update(deltaTime);
  ship.draw();

  asteroids.forEach((asteroid) => {
    asteroid.update();
    asteroid.draw();

    const currentTime = Date.now();
    if (dist(ship.x, ship.y, asteroid.x, asteroid.y) < ship.radius + asteroid.radius) {
      if (currentTime - ship.lastCollisionTime > 1000) { 
        console.log('Collision detected!');
        ship.health -= 1;
        ship.lastCollisionTime = currentTime; 

        if (ship.health > 0) {
          ship.reset();
          console.log('Ship Health After Collision: ', ship.health);
        } else {
          alert("Game Over! Restarting...");
          ship.health = 3;
          asteroids = createAsteroids(10);
        }
      }
    }
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();